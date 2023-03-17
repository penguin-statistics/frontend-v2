import {mapGetters} from "vuex";
import strings from "@/utils/strings";
import Console from "@/utils/Console";
import I18n from "@/mixins/I18n";

export default {
  watch: {
    themeStyle: {
      handler: function (newThemeStyle, oldThemeStyle) {
        if (newThemeStyle === oldThemeStyle) return;
        Console.info('FeaturedTheme', '(triggered by: themeStyle) theme changed:', newThemeStyle)
        if (newThemeStyle === 'seaborn' && this.dark !== 'dark') {
          Console.info('FeaturedTheme', '(triggered by: themeStyle) is seaborn, forcing dark mode')
          this.$store.commit('settings/switchDark', 'dark');
        }
        if (newThemeStyle === 'seaborn' && oldThemeStyle !== 'seaborn') {
          Console.info('FeaturedTheme', '(triggered by: themeStyle) is seaborn, switch locale to seaborn')
          this.changeLocale(strings.seabornLocaleMappings[this.$i18n.locale]);
        } else if (newThemeStyle !== 'seaborn' && oldThemeStyle === 'seaborn') {
          Console.info('FeaturedTheme', '(triggered by: themeStyle) is not seaborn anymore, rollback locale')
          this.changeLocale(strings.specialLocaleMappings[this.$i18n.locale])
        }

      },
      immediate: true,
    },
    language: {
      handler: function (newLocale, oldLocale) {
        if (newLocale === oldLocale) return;
        // if (this.themeStyle === 'seaborn') {
        //   // if user is using seaborn theme, and the locale is zh_CN (or other locales without seaborn translation),
        //   // switch to zh_CN_x_seaborn (or other locales with seaborn translation)
        //   Console.info('FeaturedTheme', '(triggered by: language) is seaborn, switch locale to seaborn')
        //   const newLocaleIsSeaborn = Object.keys(strings.specialLocaleMappings).includes(newLocale)
        //   if (!newLocaleIsSeaborn) {
        //     this.changeLocale(strings.seabornLocaleMappings[newLocale]);
        //   }
        // } else if (this.themeStyle !== 'seaborn') {
        //   // if user is not using seaborn theme, and the locale is zh_CN_x_seaborn (or other locales with seaborn translation),
        //   // switch to zh_CN (or other locales without seaborn translation)
        //   Console.info('FeaturedTheme', '(triggered by: language) is not seaborn, rollback locale')
        //   const oldLocaleIsSeaborn = Object.keys(strings.specialLocaleMappings).includes(oldLocale)
        //   if (oldLocaleIsSeaborn) {
        //     this.changeLocale(strings.specialLocaleMappings[oldLocale])
        //   }
        // }
        // // if new locale is seaborn locale, switch to seaborn theme
        // if (Object.keys(strings.seabornLocaleMappings).includes(newLocale)) {
        //   Console.info('FeaturedTheme', '(triggered by: language) is seaborn locale, switch theme to seaborn')
        //   this.$store.commit('settings/changeThemeStyle', 'seaborn');
        // }
      },
      immediate: true,
    }
  },
  computed: {
    ...mapGetters('settings', ['themeStyle', 'language']),
  },
  mixins: [I18n],
}
