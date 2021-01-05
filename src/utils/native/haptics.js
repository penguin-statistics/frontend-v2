import {
  Plugins,
  HapticsImpactStyle, HapticsNotificationType
} from '@capacitor/core';
import Console from "@/utils/Console";

const { Haptics, PenguinPlugin } = Plugins;

function invoke(method, ...args) {
  Console.log('Haptics', typeof Haptics, Object.keys(Haptics))
  Haptics[method](...args)
    .catch(e => Console.warn('Haptics', 'failed to invoke haptics', e))
}

export default {
  light() {
    invoke('impact', {
      style: HapticsImpactStyle.Heavy
    })
  },

  error() {
    invoke('notification', {
      style: HapticsNotificationType.ERROR
    })
  },

  warning() {
    invoke('notification', {
      style: HapticsNotificationType.WARNING
    })
  },

  success() {
    invoke('notification', {
      style: HapticsNotificationType.SUCCESS
    })
  },

  general() {
    PenguinPlugin.hapticsGeneral()
  },

  notification(type) {
    invoke('notification', type)
  },
  impact(style) {
    invoke('impact', style)
  }
}