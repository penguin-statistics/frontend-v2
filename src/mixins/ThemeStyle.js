import Console from '@/utils/Console'

const themes = {
  default: {
    light: {
      primary: '#1976D2'
    },
    dark: {
      primary: '#2196F3'
    }
  },
  miku2021: {
    light: {
      primary: '#39C5BB',
      primaryDarken1: '#00a9a0'
    },
    dark: {
      primary: '#39C5BB',
      primaryDarken1: '#00a9a0'
    }
  }
}

export default {
  methods: {
    changeThemeStyle (themeId, save = true) {
      Console.info('ThemeStyle', 'theme:', themeId, '| saving to vuex:', save)
      if (save) this.$store.commit('settings/changeThemeStyle', themeId)
      this.triggerThemeUpdate(themeId)
    },
    triggerThemeUpdate (themeId = this.$store.getters['settings/themeStyle']) {
      const theme = themes[themeId][this.$vuetify.theme.dark ? 'dark' : 'light']
      const primary = theme.primary

      if (primary) this.$vuetify.theme.currentTheme.primary = primary

      document.querySelector("meta[name=theme-color]")
        .setAttribute("content", theme.primaryDarken1);

      this.$store.state.ui.activeThemeStyle = themeId
    }
  }
}
