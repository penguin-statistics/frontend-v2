import {
  Plugins,
  HapticsImpactStyle
} from '@capacitor/core';

const { Haptics } = Plugins;

export default {
  fire (style = HapticsImpactStyle.Heavy) {
    Haptics.impact({
      style: style
    });
  },

  heavy() {
    this.fire(HapticsImpactStyle.Heavy);
  },

  medium() {
    this.fire(HapticsImpactStyle.Medium);
  },

  light() {
    this.fire(HapticsImpactStyle.Light);
  },

  vibrate() {
    Haptics.vibrate();
  }
}