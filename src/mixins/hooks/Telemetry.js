import * as Sentry from "@sentry/vue";
import store from "@/store";
import i18n from "@/i18n";
import Console from "@/utils/Console";

class SessionData {
  constructor() {
    this.data = {
      LoggedIn: store.getters["auth/loggedIn"],
      Username: store.getters["auth/username"] || "(null)",
      LanguageActive: i18n.locale || "(null)",
      LanguagePersisted: store.getters["settings/language"] || "(null)",
      Theme: store.getters["settings/dark"],
      OptimizeLowData: store.getters["settings/lowData"],
    };
  }

  get normal() {
    return this.data;
  }
}

export default {
  created() {
    this.updateTelemetryData();
  },
  watch: {
    watchDataCollection() {
      this.updateTelemetryData();
    },
  },
  methods: {
    updateTelemetryData() {
      const sessionData = new SessionData();
      Console.debug("Telemetry", "updating telemetry data");

      // set sentry tags
      Sentry.configureScope((scope) => scope.setTags(sessionData.normal));
    },
  },
  computed: {
    watchDataCollection() {
      return {
        LoggedIn: store.getters["auth/loggedIn"],
        Username: store.getters["auth/username"] || "(null)",
        LanguageActive: i18n.locale || "(null)",
        LanguagePersisted: store.getters["settings/language"] || "(null)",
        Theme: store.getters["settings/dark"],
        OptimizeLowData: store.getters["settings/lowData"],
      };
    },
  },
};
