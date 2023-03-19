import router from "@/router";
import Console from "@/utils/Console";
import environment from "@/utils/environment";
import PenguinPlugin from "@/utils/plugins/PenguinPlugin";
import {App} from "@capacitor/app";
import {Capacitor} from "@capacitor/core";
import {SplashScreen} from "@capacitor/splash-screen";
import penguin from "@/utils/native/penguin";
import helmet from "@/utils/helmet";


export default {
  created() {
    Console.info(
      "Build",
      `Hello from Penguin Statistics! :D Running platform '${PENGUIN_PLATFORM}' with '${
        environment.production ? "production" : "development"
      }'`
    );

    App.addListener("appUrlOpen", function (data) {
      Console.info("Capacitor:App", "App opened with URL", data);
      const path = new URL(data.url).pathname.replace(/\/+/g, "/");

      // We only push to the route if there is a slug present
      if (path) {
        router.push({path});
      }
    });

    App.addListener("appRestoredResult", function (data) {
      Console.info("Capacitor:App", "App restored with state", data);
    });

    App.addListener("appStateChange", function (data) {
      Console.info("Capacitor:App", "App state changed with new state", data);
      if (data && typeof data.isActive === "boolean") {
        environment.appIsActive = data.isActive;
      }
    });

    if (Capacitor.isPluginAvailable("PenguinPlugin")) {
      PenguinPlugin.addListener("networkPathChanged", function (data) {
        Console.info("Capacitor:(penguin)", "Network Path Changed", data);
      });

      PenguinPlugin.addListener("eventBus", function (event) {
        Console.info("Capacitor:(penguin):eventBus", "received event", event);
        if (event.type === "navigate") router.push({path: event.value});
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
  computed: {
    sharedState() {
      return {
        server: this.$store.getters["dataSource/server"],
        themeStyle: this.$store.getters["settings/themeStyle"],
      }
    }
  },
  watch: {
    sharedState: {
      handler: function (newState) {
        penguin.updateSharedState(newState);
      },
      immediate: true,
      deep: true
    },
    $route: {
      handler: function (to) {
        console.log('route changed', to)
        if (environment.isApp) {
          penguin.updateCurrentUserActivity({
            id: 'io.penguinstats.app.visit.' + to.fullPath,
            name: helmet.title.assemble(to),
            path: to.fullPath,
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
};
