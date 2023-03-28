import strings from '@/utils/strings'
import Console from '@/utils/Console'
import I18n from '@/mixins/I18n'
import environment from '@/utils/environment'

export default {
  mixins: [I18n],
  created () {
    // if isApp, we then use the "detection" result (but truly in iOS that's the per-app localization settings)
    // or, if the user has NOT explicitly set the language. in this case we apply it.
    if (!this.language || environment.isAppIOS) {
      const language = strings.getFirstBrowserLanguage()
      Console.info('i18n', 'detected language', language)
      if (language) {
        // because this is a detection result, thus we are not storing it,
        // unless the user manually set one.
        if (this.$store.state.ui.activeThemeStyle === 'seaborn') {
          // set seaborn locale
          this.changeLocale(strings.seabornLocaleMappings[language], false);
        } else if (this.$store.state.ui.activeThemeStyle !== 'seaborn' && strings.specialLocaleMappings[language]) {
          // revert to normal locale
          this.changeLocale(strings.specialLocaleMappings[language], false);
        } else {
          // set normally
          this.changeLocale(language, false)
        }
      }
    } else {
      if (this.$store.state.ui.activeThemeStyle === 'seaborn') {
        // set seaborn locale
        this.changeLocale(strings.seabornLocaleMappings[this.language] ?? this.language, false);
      } else if (this.$store.state.ui.activeThemeStyle !== 'seaborn' && strings.specialLocaleMappings[this.language]) {
        // revert to normal locale
        this.changeLocale(strings.specialLocaleMappings[this.language], false);
      } else {
        this.changeLocale(this.language, false)
      }
    }
  },
  computed: {
    appEnvironment () {
      return [
        environment.isApp ? 'runtime-app' : 'runtime-web'
      ]
    }
  }
}
