import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    snackbar: {
      enabled: false,
      color: '',
      timeout: 0,
      text: '',
      icon: '',
      extra: {}
    },
    outdated: false,
    loadingRoute: '',
    serverLocked: false,
    activeThemeStyle: 'default'
  },
  mutations: {
    setSnackbar(state, {color, timeout, text, icon, extra}) {
      state.snackbar.enabled = false
      Vue.nextTick(() => {
        state.snackbar.enabled = true
        state.snackbar.color = color
        state.snackbar.timeout = timeout
        state.snackbar.text = text
        state.snackbar.icon = icon
        state.snackbar.extra = extra
      })
    },
    setOutdated(state, value) {
      state.outdated = value
    },
    setNotice(state, value) {
      Vue.set(state, 'notice', value)
    },
    setLoadingRoute(state, value) {
      state.loadingRoute = value
    },
    lockServer: state => state.serverLocked = true,
    unlockServer: state => state.serverLocked = false
  },
  getters: {
    snackbar: state => state.snackbar,
    outdated: state => state.outdated,
    notice: state => state.notice,
    loadingRoute: state => state.loadingRoute,
    serverLocked: state => state.serverLocked,
    activeThemeStyle: state => state.activeThemeStyle
  }
}
