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
    ajax: {
      success: true,
      error: null
    },
    settings: {
      dark: true,
      locale: 'zh'
    },
    auth: {
      username: null
    }
  },
  mutations: {
    store: (state, d) => {
      state.data = {...d }
    },
    switchDark(state, newState) {
      state.settings.dark = newState
    },
    changeLocale(state, newLocale) {
      state.settings.locale = newLocale
    },
    authLogin(state, username) {
      state.auth.username = username
    },
    authLogout(state) {
      state.auth.username = null
    },
    ajaxFailed (state, errorMessage) {
      state.ajax.success = false;
      state.ajax.error = errorMessage
    }
  },
  actions: {},
  getters: {
    authed: state => {
      return !!state.auth.username
    },
    authUsername: state => {
      return state.auth.username || ''
    },
    // TODO: use vuex module refactor code
    trends: state => {
      return state.data && state.data.trends && state.data.trends.results
    },
    ajax: state => {
      return state.ajax
    }

  }
})