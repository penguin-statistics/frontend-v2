const pako = require('pako')

export default {
  compress (jsonData) {
    return pako.deflate(
      JSON.stringify(jsonData),
      { to: 'string' }
    )
  },
  decompress (compressed) {
    return pako.inflate(
      compressed,
      { to: 'string' }
    )
  }
}
