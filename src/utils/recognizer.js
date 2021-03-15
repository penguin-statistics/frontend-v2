import charHash from '@/models/recognition/charHash'
import store from '@/store'
import JSZip from 'jszip'
import reduce from 'lodash/reduce'
import uniq from 'lodash/uniq'

async function image2wasmHeapOffset (blob) {
  const Module = window.Module
  // console.log('image2wasmHeapOffset: start reading file')
  // console.time('image2wasmHeapOffset')
  // const imageData = await new Promise(resolve => {
  //   const reader = new FileReader()
  //   reader.onload = function (event) {
  //     console.log('image2wasmHeapOffset: finished reading file')
  //     console.timeLog('image2wasmHeapOffset')
  //     resolve(event.target.result)
  //   }
  //   reader.readAsArrayBuffer(blob)
  // })
  const imageData = await blob.arrayBuffer()
  // console.log('image2wasmHeapOffset: initializing array')
  // console.timeLog('image2wasmHeapOffset')
  const uint8 = new Uint8Array(imageData)
  const numBytes = uint8.length
  // console.log('image2wasmHeapOffset: initialized array')
  // console.timeLog('image2wasmHeapOffset')
  const dataPtr = Module._malloc(numBytes)
  // console.log('image2wasmHeapOffset: allocated wasm memory')
  // console.timeLog('image2wasmHeapOffset')
  const dataOnHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes)
  // console.log('image2wasmHeapOffset: created Uint8Array on wasm heap')
  // console.timeLog('image2wasmHeapOffset')
  dataOnHeap.set(uint8)
  // console.log('image2wasmHeapOffset: set Uint8Array value on wasm heap')
  // console.timeEnd('image2wasmHeapOffset')

  return {
    offset: dataOnHeap.byteOffset,
    length: numBytes,
    blobUrl: URL.createObjectURL(blob)
  }
}

function safeParseJson (s) {
  const result = JSON.parse(s)
  if (result === undefined || result === null || Array.isArray(result)) throw new Error("invalid result type", s)
  return result
}

class Recognizer {
  async initialize (server) {
    console.groupCollapsed('Initialization')

    // Lazy load of recognize.js and recognize.wasm
    if (!window.Module) {
      var script = document.createElement('script')
      script.src = '/recognize.js'
      document.body.appendChild(script)
      await new Promise(resolve => {
        script.onload = function () {
          resolve()
          console.log('recognize.js loaded')
        }
      })
      await new Promise(resolve => {
        window.Module.onRuntimeInitialized = () => {
          console.log('recognize.wasm loaded')
          resolve()
        }
      })
    } else {
      console.log('recognize.js and recognize.wasm have already been loaded')
    }
    const Module = window.Module

    this.wasm = {
      recognize: Module.cwrap('recognize', 'string', ['number', 'number']),
      preload_json: Module.cwrap('preload_json', 'void', [
        'string',
        'string',
        'string',
        'string'
      ]),
      preload_tmpl: Module.cwrap('preload_templ', 'void', ['string', 'number'])
      // free_buffer: Module.cwrap('free_buffer', 'void', ['number'])
    }

    console.log('preloading json')

    const preloads = {
      stages: reduce(
        store.getters['data/content']({ id: 'stages' }),
        (obj, item) => {
          return {
            ...obj,
            [item.code]: {
              stageId: item.stageId,
              drops: uniq(
                reduce(
                  item.dropInfos,
                  (array, dropInfo) => {
                    if (dropInfo.itemId && dropInfo.itemId !== 'furni') {
                      return [...array, dropInfo.itemId]
                    } else {
                      return [...array]
                    }
                  },
                  item.recognitionOnly ? [...item.recognitionOnly] : []
                )
              )
            }
          }
        },
        {}
      ),
      // items: reduce(
      //   store.getters["data/content"]({ id: "items" }),
      //   (obj, item) => {
      //     return {
      //       ...obj,
      //       [item["itemId"]]: {},
      //     };
      //   },
      //   {
      //     4006: {},
      //   }
      // ),
      items: {}, // TODO: will be fixed in WASM v3
      hash: charHash
    }

    console.log("preloading with", preloads)

    this.wasm.preload_json(
      JSON.stringify(preloads.stages),
      JSON.stringify(preloads.items),
      JSON.stringify(preloads.hash),
      server
    )

    console.log('json preloaded')

    console.log('starting to preload item icons')

    await fetch('/items.zip')
      .then((response) => {
        if (response.status >= 200 && response.status < 400) {
          return Promise.resolve(response.blob())
        } else {
          return Promise.reject(new Error(response.statusText))
        }
      })
      .then((zip) => JSZip.loadAsync(zip))
      .then(async (zip) => {
        const ImageBuffer = []
        zip.forEach((relativePath, file) => {
          ImageBuffer.push(new Promise(resolve => {
            const item = file.name.split('.')[0]
            console.log('adding', item, 'to preloaded item icon')
            file.async('blob').then(async (blob) => {
              const { offset, length } = await image2wasmHeapOffset(blob, file.name)
              this.wasm.preload_tmpl(item, offset, length)
            }).then(resolve)
          }))
        })
        return Promise.all(ImageBuffer)
      })
    console.groupEnd()
    return this
  }

  async recognize (files, resultCb) {
    for (const file of files) {
      console.groupCollapsed('Recognition of', file.name)
      // console.log('start recognizing file', file.name)
      // console.time(file.name)
      const data = await image2wasmHeapOffset(file)
      // console.log('finished writing file to wasm heap. starting recognition')
      // console.timeLog(file.name)
      const start = performance.now()
      let result, parsedResult
      try {
        result = this.wasm.recognize(data.offset, data.length, 0)
        parsedResult = safeParseJson(result)
      } catch (e) {
        console.log('caught wasm error', e, 'responding with null result')
        const duration = performance.now() - start
        resultCb({
          file,
          blobUrl: data.blobUrl,
          duration,
          result: {
            errors: [{type: "Result::False"}],
            warnings: [],
            drops: []
          }
        })
        console.groupEnd()
        continue
      }
      const duration = performance.now() - start
      // console.log('recognized with result', result)
      // console.timeLog(file.name)
      console.debug('recognition result', parsedResult)
      resultCb({
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
      console.groupEnd()
    }
  }
}

export default Recognizer
