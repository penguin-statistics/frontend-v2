import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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
