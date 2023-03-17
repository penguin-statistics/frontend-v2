import Console from '@/utils/Console'

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
    forceTheme: 'dark',
    light: {
      primary: "#3ab4ce",
      primaryDarken1: "#005C68",
    },
    dark: {
      primary: "#3ab4ce",
      primaryDarken1: "#005C68",
    },
  },
};

export default {
  methods: {
    changeThemeStyle(themeId, save = true) {
      Console.info('ThemeStyle', 'theme:', themeId, '| saving to vuex:', save)
      if (save) this.$store.commit('settings/changeThemeStyle', themeId)
      this.triggerThemeUpdate(themeId)
    },
    triggerThemeUpdate(themeId = this.$store.getters['settings/themeStyle']) {
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
    }
  }
}
