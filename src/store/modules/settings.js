import Console from '@/utils/Console'

export default {
  namespaced: true,
  state: {
    themeStyle: 'default',
    dark: 'system',
    language: null,
    optimization: {
      lowData: false
    }
  },
  mutations: {
    switchDark (state, newState) {
      state.dark = newState
    },
    changeLocale (state, newLocale) {
      state.language = newLocale
    },
    changeOptimization (state, { type, value }) {
      if (!(type in state.optimization)) Console.warn('Store/Settings', 'unknown optimization type', type)
      state.optimization[type] = value
    },
    changeThemeStyle (state, newThemeStyle) {
      state.themeStyle = newThemeStyle
    }
  },
  getters: {
    language: state => state.language,
    dark: state => state.dark,
    lowData: state => state.optimization.lowData,
    themeStyle: state => state.themeStyle
  }
}
