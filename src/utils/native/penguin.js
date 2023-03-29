import {
  Plugins,
  Capacitor
} from '@capacitor/core'
import Console from '@/utils/Console'

const {PenguinPlugin} = Plugins

function invoke(method, ...args) {
  if (Capacitor.isPluginAvailable('PenguinPlugin')) {
    Console.info('PenguinPlugin', 'invoking PenguinPlugin with', method, args)
    return PenguinPlugin[method](...args)
      .catch(e => Console.warn('PenguinPlugin', 'failed to invoke', e))
  } else {
    Console.info('PenguinPlugin', 'cancelled invoking PenguinPlugin with', method, args, 'plugin unavailable under current platform')
    // return Promise.reject(new Error('PenguinPlugin does not exist under current platform'))
  }
}

export default {
  openBundleSettings() {
    return invoke('openBundleSettings')
  },
  getLastSyncedPushPreferences() {
    return invoke('getLastSyncedPushPreferences')
  },
  submitNewPushPreferences(preferences) {
    return invoke('submitNewPushPreferences', {preferences})
  },
  updateSharedState(state) {
    return invoke('updateSharedState', state)
  },
  updateCurrentUserActivity(activity) {
    return invoke('updateCurrentUserActivity', activity)
  }
}
