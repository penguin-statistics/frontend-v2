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
import {findDuplicates} from "@/utils/arrayUtils";

const recognizerVersion = 'v4.0.0'

// async function image2wasmHeapOffset (blob) {
//   const Module = window.Module
//   const imageData = await blob.arrayBuffer()
//   const uint8 = new Uint8Array(imageData)
//   const numBytes = uint8.length
//   const dataPtr = Module._malloc(numBytes * Uint8Array.BYTES_PER_ELEMENT)
//   const dataOnHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes)
//   dataOnHeap.set(uint8)

//   return {
//     offset: dataPtr,
//     length: numBytes,
//     blobUrl: URL.createObjectURL(blob)
//   }
// }

async function file2ArrayBuffer(file) {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = function(event) {
      resolve(event.target.result);
    };
    reader.readAsArrayBuffer(file);
  });
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
      script.src = mirror.deliver(`/recognition/${recognizerVersion}/penguin-recognizer.js`)
      // script.src = "/penguin-recognizer.js"
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
      version: Module.version,
      loadServer: Module.load_server,
      loadTemplates: Module.load_templs,
      loadHashIndex: Module.load_hash_index,
      loadStageIndex: Module.load_stage_index,
      getExceptionMessage: Module.getExceptionMessage,
      Recognizer: Module.Recognizer,
    };

    const transformedStages = {}

    const stages = store.getters['data/content']({ id: 'stages' })

    const duplicatedStageIds = findDuplicates(stages.map(el => el.code))
    console.log('duplicates', duplicatedStageIds)

    stages
      .forEach((stage) => {
        // skip stages with duplicated code and is non-existent in the current server
        if (
          ~duplicatedStageIds.indexOf(stage.code) &&
          !existUtils.existence(stage, true)
        ) {
          Console.debug('Recognizer', 'skipping stage due to non-existence', stage.code, stage.stageId)
          return
        }

        let drops = (stage.dropInfos || [])
          .map(drop => drop.itemId)
          .filter(drop => !!drop && drop !== 'furni')

        if (stage.recognitionOnly) drops = [...drops, ...stage.recognitionOnly]

        transformedStages[stage.code] = {
          stageId: stage.stageId,
          drops: uniq(drops),
          existence: existUtils.existence(stage, true)
        }
      })

    Console.debug("Recognizer", "init: preload server: preloading with", server);
    this.wasm.loadServer(server);

    Console.debug('Recognizer', 'init: preload json: preloading with', transformedStages, charHash)

    this.wasm.loadHashIndex(JSON.stringify(charHash))
    this.wasm.loadStageIndex(JSON.stringify(transformedStages))
    
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
            const itemId = file.name.split('.')[0]
            Console.debug('Recognizer', 'init: preload icons: adding', itemId, 'to preloaded item icon')
            file.async('arraybuffer').then(async buffer => {
              this.wasm.loadTemplates(itemId, buffer)
            }).then(resolve)
          }))
        })
        return Promise.all(imageBuffer)
      })


    Console.info('Recognizer', 'init: preload icons: preloaded')

    const version = this.wasm.version

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
      const blobUrl = URL.createObjectURL(file)
      // console.groupCollapsed('Recognition of', file.name)
      // console.log('start recognizing file', file.name)
      // console.time(file.name)
      // const data = await image2wasmHeapOffset(file)
      // console.log('finished writing file to wasm heap. starting recognition')
      // console.timeLog(file.name)
      const fileContentBuffer = await file2ArrayBuffer(file);
      const start = performance.now()
      let result, parsedResult
      try {
        const recognizer = new window.Module.Recognizer("RESULT");
        Console.info('Recognizer', 'start recognizing file', file.name, 'with file content buffer', fileContentBuffer)

        result = recognizer.recognize(fileContentBuffer, false, false)
        Console.debug('Recognizer', 'recognized with raw result', result)
        parsedResult = safeParseJson(result)
      } catch (e) {
        let exceptionMessage
        try {
          exceptionMessage = this.wasm.getExceptionMessage(e)
        } catch (e) {
          exceptionMessage = "Unknown exception"
        }
        Console.error(
          "Recognizer",
          "caught wasm error",
          e,
          `(${exceptionMessage})`,
          "responding with null result"
        );
        const duration = performance.now() - start
        resultCb({
          id,
          file,
          blobUrl,
          duration,
          result: {
            exceptions: [{ what: "Result::False" }],
            drops: [],
          },
        });
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
          parsedResult.dropArea.drops =
            parsedResult.dropArea.drops.filter(el => !stage.recognitionOnly.includes(el.itemId))
        }

        if (!parsedResult.exceptions.length) {
          const zone = get.zones.byZoneId(stage.zoneId)

          Console.debug('Recognizer', 'validating drops', parsedResult)
          const validate = new ReportValidator(
            this.instanceInfo.server,
            zone,
            stage,
            parsedResult.dropArea.drops
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
        blobUrl,
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
