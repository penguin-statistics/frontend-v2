import strings from "@/utils/strings";
import Console from "@/utils/Console";
import I18n from "@/mixins/I18n";
import environment from "@/utils/environment";

export default {
  mixins: [I18n],
  created () {
    if (this.language) {
      this.changeLocale(this.language, false)
    } else {
      const language = strings.getFirstBrowserLanguage();
      Console.info("i18n", "detected language", language);
      if (language) {
        // because this is a detection result, thus we are not storing it,
        // unless the user manually set one.
        this.changeLocale(language, false)
      }
    }
  },
  computed: {
    appEnvironment () {
      return [
        `lang-${this.$i18n.locale}`,
        environment.runtime.isApp ? 'runtime-app' : 'runtime-web'
      ]
    },
  },
}