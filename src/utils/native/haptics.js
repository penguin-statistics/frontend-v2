import {
  Plugins,
  HapticsImpactStyle, HapticsNotificationType
} from '@capacitor/core';
import Console from "@/utils/Console";

const { Haptics } = Plugins;

window.GlobalCapacitorHaptics = Haptics

function invoke(method, ...args) {
  try {
    Haptics.prototype.call(method, args)
  } catch (e) {
    Console.warn('Haptics', 'failed to invoke haptics', e)
  }
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

  notification(type) {
    invoke('notification', type)
  },
  impact(style) {
    invoke('impact', style)
  }
}