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
      primary: '#39C5BB'
    },
    dark: {
      primary: '#39C5BB'
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
      const primary = themes[themeId][this.$vuetify.theme.dark ? 'dark' : 'light'].primary

      if (primary) this.$vuetify.theme.currentTheme.primary = primary

      document.querySelector("meta[name=theme-color]")
        .setAttribute("content", primary);

      this.$store.state.ui.activeThemeStyle = themeId
    }
  }
}
