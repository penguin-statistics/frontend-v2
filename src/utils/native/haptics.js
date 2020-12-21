import {
  Plugins,
  HapticsImpactStyle, HapticsNotificationType
} from '@capacitor/core';

const { Haptics } = Plugins;

window.GlobalCapacitorHaptics = Haptics

export default {
  light() {
    Haptics.impact({
      style: HapticsImpactStyle.Heavy
    });
  },

  error() {
    Haptics.notification({
      type: HapticsNotificationType.ERROR
    })
  },

  warning() {
    Haptics.notification({
      type: HapticsNotificationType.WARNING
    })
  },

  success() {
    Haptics.notification({
      type: HapticsNotificationType.SUCCESS
    })
  },

  notification(type) {
    Haptics.notification({type})
  },
  impact(style) {
    Haptics.impact({style})
  }
}