import Console from '@/utils/Console'

function noop () {}

export default function (url, protocols, { backoffInitial, backoffMax }, callbacks) {
  // const opts = {}

  let ws
  let retryTimes = 0
  let timer = 1
  const $ = {}
  let backoffLast = backoffInitial

  const nextTimeout = function () {
    if (retryTimes >= backoffMax) {
      return backoffLast
    }
    backoffLast = backoffLast * 2
    return backoffLast
  }

  $.buffer = []

  $.open = function () {
    let u = url
    if (retryTimes > 0) {
      u += '&i=' + retryTimes
    }

    ws = new WebSocket(u, protocols)

    ws.onmessage = callbacks.onmessage || noop

    ws.onopen = function (e) {
      (callbacks.onopen || noop)(e)
      retryTimes = 0
      for (let i = 0; i < $.buffer.length; i++) {
        ws.send($.buffer.shift())
      }
    }

    ws.onclose = function (e) {
      e.code === 1e3 || e.code === 1001 || e.code === 1005 || $.reconnect(e);
      (callbacks.onclose || noop)(e)
    }

    ws.onerror = function (e) {
      (e && e.code === 'ECONNREFUSED') ? $.reconnect(e) : (callbacks.onerror || noop)(e)
    }
  }

  $.reconnect = function (e) {
    retryTimes++
    timer = setTimeout(function () {
      (callbacks.onreconnect || noop)(e)
      $.open()
    }, nextTimeout())
  }

  $.send = function (message) {
    // if transport is not yet ready to receive message then write message to buffer and
    // send the message when transport is connected
    if (ws === undefined || ws.readyState !== WebSocket.OPEN) {
      $.buffer.push(message)
      Console.debug('Transport', 'transport not ready, pushed current message to buffer')
      return
    }

    ws.send(message)
  }

  $.close = function (x, y) {
    timer = clearTimeout(timer)
    ws.close(x || 1e3, y)
  }

  $.open() // init

  return $
}
