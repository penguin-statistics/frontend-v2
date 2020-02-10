export default {
  state: {
    dark: true,
    language: null
  },
  mutations: {
    switchDark(state, newState) {
      state.dark = newState
    },
    changeLocale(state, newLocale) {
      state.language = newLocale
    }
  },
  getters: {
    language: state => state.language
  }
};