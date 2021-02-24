import preloads from '@/models/preloads'
// import Jimp from 'jimp'
import JSZip from 'jszip'
const Module = window.Module

// function addCanvas (canvas, url, small = false) {
//   // canvas.style.height = small ? '80px' : '264px'
//   // if (!small) canvas.style.float = 'left'
//   canvas.setAttribute('data-title', new Date().toLocaleString())
//   canvas.setAttribute('data-url', url)
//   const s = document.getElementById('canvases')
//   if (s) s.prepend(canvas)
// }

async function image2wasmHeapOffset (blob) {
  console.time('writeToWasmHeap')
  const imageData = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(event.target.result)
    }
    reader.readAsArrayBuffer(blob)
  })
  const uint8 = new Uint8Array(imageData)

  const numBytes = uint8.length
  const dataPtr = Module._malloc(numBytes)
  const dataOnHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes)
  dataOnHeap.set(uint8)
  console.timeEnd('writeToWasmHeap')

  return {
    offset: dataOnHeap.byteOffset,
    length: numBytes,
    blobUrl: URL.createObjectURL(blob)
  }
}

class Recognizer {
  async initialize (server) {
    this.wasm = {
      recognize: Module.cwrap('recognize', 'string', ['number', 'number']),
      preload_json: Module.cwrap('preload_json', 'void', ['string', 'string', 'string', 'string']),
      preload_tmpl: Module.cwrap('preload_templ', 'void', ['string', 'number'])
      // free_buffer: Module.cwrap('free_buffer', 'void', ['number'])
    }

    console.log('preloading json')

    this.wasm.preload_json(
      JSON.stringify(preloads.stage),
      JSON.stringify(preloads.item),
      JSON.stringify(preloads.hash),
      server
    )

    console.log('json preloaded')

    console.log('starting to preload item icons')

    const items = ['2001', '2002', '2003', '2004', '30011', '30012', '30013', '30014', '30021', '30022', '30023', '30024', '3003', '30031', '30032', '30033', '30034', '30041', '30042', '30043', '30044', '30051', '30052', '30053', '30054', '30061', '30062', '30063', '30064', '30073', '30074', '30083', '30084', '30093', '30094', '30103', '30104', '30115', '30125', '30135', '30145', '31013', '31014', '31023', '31024', '31033', '31034', '3112', '3113', '3114', '3211', '3212', '3221', '3222', '3231', '3232', '3241', '3242', '3251', '3252', '3261', '3262', '3271', '3272', '3281', '3282', '3301', '3302', '3303', '4005', 'ap_supply_lt_010', 'randomMaterial_1', 'randomMaterial_2', 'randomMaterial_3', 'randomMaterial_4']
    const self = this

    await fetch('/items.zip')
      .then((response) => {
        if (response.status >= 200 && response.status < 400) {
          return Promise.resolve(response.blob())
        } else {
          return Promise.reject(new Error(response.statusText))
        }
      })
      .then(JSZip.loadAsync)
      .then(async function (zip) {
        console.log(zip.files)
        for (const item of items) {
          console.log('adding', item, 'to preloaded item icon')
          const blob = await zip.file('items/' + item + '.jpg').async('blob')

          // console.log('item', item, 'image', image, 'imageData', imageData, 'numBytes', numBytes, 'dataPtr', dataPtr, 'dataOnHeap', dataOnHeap)
          // console.log('preloading template. itemId:', item)
          const { offset, length } = await image2wasmHeapOffset(blob)
          self.wasm.preload_tmpl(item, offset, length)
        }
      })

    return this
  }

  async recognize (files, resultCb) {
    for (const file of files) {
      console.groupCollapsed('Recognition logs for', file.name)
      console.log('start recognizing file', file.name)
      console.time(file.name)
      const data = await image2wasmHeapOffset(file)
      console.log('finished writing file to wasm heap. starting recognition')
      console.timeLog(file.name)
      const start = performance.now()
      const result = this.wasm.recognize(data.offset, data.length, 0)
      const duration = performance.now() - start
      console.log('recognized with result', result, 'executing callback')
      console.timeLog(file.name)
      const parsedResult = JSON.parse(result) || { errors: [], drops: [] }
      console.debug('recognition result', parsedResult)
      resultCb({
        file,
        blobUrl: data.blobUrl,
        duration,
        result: parsedResult
      })
      console.log('callback executed. freeing buffer with offset', data.offset)
      console.timeLog(file.name)
      // this.wasm.free_buffer(data.offset)
      console.log('buffer freed. timer ended')
      console.timeEnd(file.name)
      console.groupEnd()
    }
  }
}

export default Recognizer
