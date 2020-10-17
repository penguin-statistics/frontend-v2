import { Plugins } from '@capacitor/core';
const { Device } = Plugins;

let deviceInfoCache = null

function getDeviceInfo() {
  if (!deviceInfoCache) deviceInfoCache = Device.getInfo()
  return deviceInfoCache
}

export default {
  platform: {
    async is (id) {
      const info = getDeviceInfo()
      return (await info).platform === id || false
    },
    isIOS () {
      return this.is('ios')
    },
    isAndroid () {
      return this.is('android')
    },
    isElectron () {
      return this.is('electron')
    },
    isWeb () {
      return this.is('web')
    },
  }
}