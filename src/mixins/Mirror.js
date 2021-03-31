import mirror from '@/utils/mirror'
import device from '@/utils/native/device'

// function wrapPromise(promise) {
//   return promise
//     .then(ans => {
//       return ans
//     })
//     .catch(() => {
//       return false
//     })
// }

export default {
  computed: {
    isCNMirror () {
      return mirror.cn.isCurrent()
    },
    isVercel () {
      return mirror.vercel.isCurrent()
    },
    primaryColor () {
      if (this.isVercel) {
        return 'orange darken-4'
      } else {
        return 'primary darken-1'
      }
    },
    currentMirrorHostname () {
      return mirror.cn.isCurrent() ? mirror.cn.identifier : mirror.global.identifier
    }
  },
  asyncComputed: {
    isIOS () {
      return device.platform.isIOS()
    },
    isAndroid () {
      return device.platform.isAndroid()
    },
    isElectron () {
      return device.platform.isElectron()
    },
    isWeb () {
      return device.platform.isWeb()
    }
  }
}
