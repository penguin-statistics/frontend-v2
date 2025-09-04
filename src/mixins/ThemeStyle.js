import Console from '@/utils/Console'
import mirror from "@/utils/mirror";
import I18n from "@/mixins/I18n";

const themes = {
  default: {
    light: {
      primary: "#1976D2",
      primaryDarken1: "#005eb6",
    },
    dark: {
      primary: "#2196F3",
      primaryDarken1: "#007cd6",
    },
  },
  miku2021: {
    light: {
      primary: "#39C5BB",
      primaryDarken1: "#00a9a0",
    },
    dark: {
      primary: "#39C5BB",
      primaryDarken1: "#00a9a0",
    },
  },
  seaborn: {
    forceTheme: "dark",
    light: {
      primary: "#3ab4ce",
      primaryDarken1: "#005C68",
    },
    dark: {
      primary: "#3ab4ce",
      primaryDarken1: "#005C68",
    },
  },
  avemujica: {
    forceTheme: "dark",
    light: {
      primary: "#ab254a",
      primaryDarken1: "#1a090e",
    },
    dark: {
      primary: "#ab254a",
      primaryDarken1: "#1a090e",
    },
  },
};

const seabornLogos = [
  'kawaii',
  'kowai'
]

const seabornLogo = seabornLogos[Math.floor(Math.random() * seabornLogos.length)]

export default {
  mixins: [I18n],
  methods: {
    changeThemeStyle(themeId, save = true) {
      Console.info('ThemeStyle', 'theme:', themeId, '| saving to vuex:', save)
      if (save) this.$store.commit('settings/changeThemeStyle', themeId)
      this.triggerThemeUpdate(themeId)
    },
    triggerThemeUpdate(themeId = this.$store.state.ui.activeThemeStyle) {
      const theme = themes[themeId][this.$vuetify.theme.dark ? 'dark' : 'light']
      const primary = theme.primary
      const accent = theme.accent

      if (primary) this.$vuetify.theme.currentTheme.primary = primary
      if (accent) this.$vuetify.theme.currentTheme.accent = accent

      this.$store.state.ui.activeThemeStyle = themeId

      document.querySelector("meta[name=theme-color]")
        .setAttribute("content", theme.primaryDarken1);
      document.documentElement.setAttribute("data-theme", themeId);

      if (themes[themeId].forceTheme) {
        const isDark = themes[themeId].forceTheme === 'dark'

        this.$vuetify.theme.dark = isDark
        this.$store.commit('settings/switchDark', isDark ? 'dark' : 'light')
      }

      // Console.info('ThemeStyle', 'themeId:', themeId, '| this.language:', this.language)
      // if (themeId !== 'seaborn' && strings.specialLocaleMappings[this.language]) {
      //   // rollback to the original locale
      //   Console.info('ThemeStyle', 'rollback to the original locale:', strings.specialLocaleMappings[this.$i18n.locale])
      //   this.changeLocale(strings.specialLocaleMappings[this.$i18n.locale], true)
      // }
    },
  },
  computed: {
    currentLogoSrc() {
      return mirror.deliver(
        this.$store.state.ui.activeThemeStyle === 'seaborn'
          ? (
            '/logos/seaborn/' + seabornLogo + '.png'
          )
          : '/logos/penguin_stats_logo.png'
      )
    },
    currentLogoName() {
      return this.$store.state.ui.activeThemeStyle === 'seaborn'
        ? seabornLogo
        : 'penguin_stats_logo'
    }
  }
}
