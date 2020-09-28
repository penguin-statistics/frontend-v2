import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

export default {
  created () {
    SplashScreen.hide();
  }
}