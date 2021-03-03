import { Plugins } from '@capacitor/core'
const { Device } = Plugins

const debugKey = 'PENGUIN_STATS_DEBUG'

function getConfig () {
  return (window && window[debugKey]) || {}
}

function boolean (key, rejectApp) {
  // development & in-app: force true
  // otherwise if specifically specified, use that value
  // otherwise fallback to false
  if (rejectApp && PENGUIN_PLATFORM === 'app') return false
  return process.env.NODE_ENV !== 'production' || getConfig()[key] || false
}

export default {
  get device () {
    return (async () => {
      return {
        info: await Device.getInfo(),
        languageCode: await Device.getLanguageCode()
      }
    })()
  },
  get production () { return process.env.NODE_ENV === 'production' },
  runtime: {
    get isApp () { return PENGUIN_PLATFORM === 'app' }
  },
  get isTouchScreen () {
    if (window.matchMedia) return window.matchMedia('(pointer: coarse)').matches
    return 'ontouchstart' in window || window.navigator.maxTouchPoints > 0
  },
  get canHover () {
    if (window.matchMedia) return window.matchMedia('(any-hover)').matches
    return !this.isTouchScreen
  },
  get isWindows () { return navigator.platform.indexOf('Win') > -1 },
  debug: {
    get performance () { return boolean('performance') },
    get devtools () { return boolean('devtools') },
    get colorfulConsole () { return boolean('colorfulConsole', true) },
    get fullConsole () { return boolean('fullConsole') },
    get frostnova () { return boolean('frostnova') }
  },
  get platform () {
    if (PENGUIN_PLATFORM === 'app') {
      return (async () => {
        const device = await this.device
        return `app:${device.info.platform}`
      })()
    }
    return Promise.resolve('web')
  },
  get isApp () {
    return PENGUIN_PLATFORM === 'app'
  },
  adapter ({ prod, dev }) {
    return this.production ? prod : dev
  }

  // native: {
  //   async mirrorAPIEndpoint() {
  //     const { region } = await PenguinPlugin.getRegion()
  //     Console.info("NativeBridge:PenguinPlugin", "Region as", region)
  //
  //     let domain
  //     if (region === "CN") {
  //       domain = mirror.cn.identifier
  //     } else {
  //       domain = mirror.global.identifier
  //     }
  //     return `https://${domain}/PenguinStats/api/v2`
  //   }
  // }
}
