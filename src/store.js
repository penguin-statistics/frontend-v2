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
    ajaxLoading: false,
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
    changeAjaxState (state, newState) {
      state.ajaxLoading = newState
    },
    switchDark (state, newState) {
      state.settings.dark = newState
    },
    changeLocale (state, newLocale) {
      state.settings.locale = newLocale
    }
  },
  actions: {
    ajax_began ({commit}) {
      commit('changeAjaxState', true)
    },
    ajax_finished ({commit}) {
      commit('changeAjaxState', false)
    }
  }
})
