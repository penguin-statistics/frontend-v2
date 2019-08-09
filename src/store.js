import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "penguin-stats-state"
    })
  ],
  state: {
    data: {},
    settings: {
      dark: true,
      locale: 'zh'
    }
  },
  mutations: {
    store: (state, d) => {
      state.data = {...d}
    },
    switchDark (state, newState) {
      state.settings.dark = newState
    },
    changeLocale (state, newLocale) {
      state.settings.locale = newLocale
    }
  }
})
