import { Plugins } from '@capacitor/core';
import router from "@/router";
import Console from "@/utils/Console";
const { SplashScreen, App, PenguinPlugin } = Plugins;

export default {
  created () {
    Console.info("Build", `Project meta: build:${PENGUIN_BUILD}, buildFrom:${PENGUIN_BUILD_FROM}`)

    App.addListener('appUrlOpen', function( data ){
      Console.info("NativeBridge:App", "App opened with URL", data)
      const path = new URL(data.url).pathname.replace(/\/+/g, "/")

      // We only push to the route if there is a slug present
      if ( path ){
        router.push({ path });
      }
    });

    App.addListener('appRestoredResult', function(data) {
      Console.info("NativeBridge:App", 'App restored with state', data);
    });

    App.addListener("appStateChange", function(data) {
      Console.info("NativeBridge:App", 'App state changed with new state', data);
    })

    PenguinPlugin.getLocalizationEnvironment()
      .then(value => {
        Console.info("NativeBridge:PenguinPlugin", "Localization Environment as", value)
      })

    PenguinPlugin.addListener("eventBus", function (event) {
      Console.info("NativeBridge:PenguinPlugin:eventBus", "received event", event)
      if (event.type === "navigate") router.push({ path: event.value })
    })
  },
  mounted () {
    this.$nextTick(() => {
      SplashScreen.hide();
    })
  }
}