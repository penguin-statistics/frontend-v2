import charHash from '@/models/recognition/charHash'
import store from '@/store'
import JSZip from 'jszip'
import uniq from 'lodash/uniq'
import Console from "@/utils/Console";
import strings from "@/utils/strings";
import ReportValidator from "@/utils/reportValidator";
import get from '@/utils/getters'
import existUtils from "@/utils/existUtils";
import mirror from "@/utils/mirror";

const recognizerVersion = 'v3.2.2-1'

async function image2wasmHeapOffset (blob) {
  const Module = window.Module
  const imageData = await blob.arrayBuffer()
  const uint8 = new Uint8Array(imageData)
  const numBytes = uint8.length
  const dataPtr = Module._malloc(numBytes * Uint8Array.BYTES_PER_ELEMENT)
  const dataOnHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes)
  dataOnHeap.set(uint8)

  return {
    offset: dataPtr,
    length: numBytes,
    blobUrl: URL.createObjectURL(blob)
  }
}

function safeParseJson (s) {
  const result = JSON.parse(s)
  if (result === undefined || result === null || Array.isArray(result)) throw new TypeError("Unexpected result type: " + typeof s)
  return result
}

class Recognizer {
  async initialize (server) {
    // console.groupCollapsed('Initialization')

    // Lazy load of recognize.js and recognize.wasm
    if (window.Module) {
      Console.info('Recognizer', 'init: recognition backend: both js and wasm are already loaded')
    } else {
      const script = document.createElement('script')
      script.src = mirror.deliver(`/recognition/${recognizerVersion}/penguin.js`)
      // script.src = "/penguin.js"
      document.body.appendChild(script)
      await new Promise(resolve => {
        script.onload = function () {
          resolve()
          Console.info('Recognizer', 'init: recognition backend: js loaded')
        }
      })
      await new Promise(resolve => {
        window.Module.onRuntimeInitialized = () => {
          Console.info('Recognizer', 'init: recognition backend: wasm loaded')
          resolve()
        }
      })
    }
    const Module = window.Module

    this.wasm = {
      load_server: Module.cwrap('load_server', 'void', ['string']),
      load_tmpl: Module.cwrap('load_templ', 'void', ['string', 'number']),
      load_json: Module.cwrap('load_json', 'void', ['string', 'string']),
      recognize: Module.cwrap('recognize', 'string', ['number', 'number']),
      get_info: Module.cwrap('get_info', 'string', []),
      // free_buffer: Module.cwrap('free_buffer', 'void', ['number'])
    }

    const stages = {}

    store.getters['data/content']({ id: 'stages' })
      .forEach((stage) => {
        let drops = (stage.dropInfos || [])
          .map(drop => drop.itemId)
          .filter(drop => !!drop && drop !== 'furni')

        if (stage.recognitionOnly) drops = [...drops, ...stage.recognitionOnly]

        stages[stage.code] = {
          stageId: stage.stageId,
          drops: uniq(drops),
          existence: existUtils.existence(stage, true)
        }
      })


    Console.debug('Recognizer', 'init: preload json: preloading with', stages, charHash)

    this.wasm.load_json(
      JSON.stringify(stages),
      JSON.stringify(charHash)
    )

    Console.debug('Recognizer', 'init: preload server: preloading with', server)

    this.wasm.load_server(server)

    Console.info('Recognizer', 'init: preload icons: preloading')

    await fetch(mirror.deliver(`/recognition/${recognizerVersion}/items.zip`))
    // await fetch("/items.zip")
      .then((response) => {
        if (response.status >= 200 && response.status < 400) {
          return Promise.resolve(response.blob())
        } else {
          return Promise.reject(new Error(response.statusText))
        }
      })
      .then((zip) => JSZip.loadAsync(zip))
      .then(async (zip) => {
        const imageBuffer = []
        zip.forEach((relativePath, file) => {
          imageBuffer.push(new Promise(resolve => {
            const item = file.name.split('.')[0]
            Console.debug('Recognizer', 'init: preload icons: adding', item, 'to preloaded item icon')
            file.async('blob').then(async (blob) => {
              const { offset, length } = await image2wasmHeapOffset(blob, file.name)
              this.wasm.load_tmpl(item, offset, length)
            }).then(resolve)
          }))
        })
        return Promise.all(imageBuffer)
      })


    Console.info('Recognizer', 'init: preload icons: preloaded')

    const version = this.wasm.get_info()

    Console.info('Recognizer', 'initialization completed with wasm version', version)

    this.instanceInfo = {
      server,
      version
    }

    return this
  }

  async recognize (files, resultCb) {
    for (const file of files) {
      const id = `${Date.now()}_${Math.random()}`
      // console.groupCollapsed('Recognition of', file.name)
      // console.log('start recognizing file', file.name)
      // console.time(file.name)
      const data = await image2wasmHeapOffset(file)
      // console.log('finished writing file to wasm heap. starting recognition')
      // console.timeLog(file.name)
      Console.info('Recognizer', 'start recognizing file', file.name, 'with wasm heap offset', data.offset, data.length)
      const start = performance.now()
      let result, parsedResult
      try {
        result = this.wasm.recognize(data.offset, data.length)
        Console.debug('Recognizer', 'recognized with raw result', result)
        parsedResult = safeParseJson(result)
      } catch (e) {
        Console.error('Recognizer', 'caught wasm error', e, 'responding with null result')
        const duration = performance.now() - start
        resultCb({
          id,
          file,
          blobUrl: data.blobUrl,
          duration,
          result: {
            exceptions: [{ what: "Result::False" }],
            drops: []
          }
        })
        continue
      }
      const duration = performance.now() - start

      Console.debug('Recognizer', 'Recognized. Took', duration + 'ms', 'with result', parsedResult)

      parsedResult.exceptions = parsedResult.exceptions.map(exception => {
        exception.what = `${
          strings.capitalize(
            exception.where
              .split('.')
              .filter(el => !el.match(/^-?\d+$/))
              .map(strings.capitalize)
              .join('')
          )
        }::${exception.what}`
        return exception
      })

      if (parsedResult.stage.stageCode) {
        const stage = get.stages.byStageId(parsedResult.stage.stageId)

        if (Array.isArray(stage.recognitionOnly)) {
          parsedResult.drops = parsedResult.drops.filter(el => !stage.recognitionOnly.includes(el.itemId))
        }

        if (!parsedResult.exceptions.length) {
          const zone = get.zones.byZoneId(stage.zoneId)

          Console.debug('Recognizer', 'validating drops', parsedResult)
          const validate = new ReportValidator(
            this.instanceInfo.server,
            zone,
            stage,
            parsedResult.drops
          ).validate()
          Console.debug('Recognizer', 'validated with result', validate)

          if (validate.rate > 0) {
            parsedResult.exceptions.push({
              what: "DropInfos::Violation",
              details: validate
            })
          }
        }
      }

      resultCb({
        id,
        file,
        blobUrl: data.blobUrl,
        duration,
        result: parsedResult
      })
      // console.log('callback executed')
      // console.timeLog(file.name)
      // this.wasm.free_buffer(data.offset)
      // console.log('buffer freed. timer ended')
      // console.timeEnd(file.name)
      // console.groupEnd()
    }
  }
}

export default Recognizer
