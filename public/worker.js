/* eslint-env worker */

self.onload = function (e) {
  console.log('loaded')
}

self.onmessage = function (e) {
  console.log('worker got message', e)
  const { data } = e
  switch (data) {
    case 'load':
      importScripts('recognize.js')
    // case 'initialize':

  }
}
