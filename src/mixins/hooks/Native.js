import { Capacitor } from "@capacitor/core";
import router from "@/router";
import Console from "@/utils/Console";
import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";
import PenguinPlugin from "@/utils/plugins/PenguinPlugin";
import environment from "@/utils/environment";

export default {
  created() {
    Console.info(
      "Build",
      `Hello from Penguin Statistics! :D Running platform '${PENGUIN_PLATFORM}' with '${
        environment.production ? "production" : "development"
      }'`
    );

    App.addListener("appUrlOpen", function(data) {
      Console.info("Capacitor:App", "App opened with URL", data);
      const path = new URL(data.url).pathname.replace(/\/+/g, "/");

      // We only push to the route if there is a slug present
      if (path) {
        router.push({ path });
      }
    });

    App.addListener("appRestoredResult", function(data) {
      Console.info("Capacitor:App", "App restored with state", data);
    });

    App.addListener("appStateChange", function(data) {
      Console.info("Capacitor:App", "App state changed with new state", data);
    });

    if (Capacitor.isPluginAvailable("PenguinPlugin")) {
      PenguinPlugin.addListener("networkPathChanged", function(data) {
        Console.info("Capacitor:(penguin)", "Network Path Changed", data);
      });

      PenguinPlugin.addListener("eventBus", function(event) {
        Console.info("Capacitor:(penguin):eventBus", "received event", event);
        if (event.type === "navigate") router.push({ path: event.value });
      });

      PenguinPlugin.listenerReady();

      PenguinPlugin.getLocalizationEnvironment().then((value) => {
        Console.info(
          "Capacitor:(penguin)",
          "Localization Environment as",
          value
        );
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      SplashScreen.hide();
    });
  },
};
