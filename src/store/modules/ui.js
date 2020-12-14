import Vue from "vue"

export default {
  namespaced: true,
  state: {
    snackbar: {
      enabled: false,
      color: "",
      timeout: 0,
      text: "",
      icon: "",
      extra: {}
    },
    outdated: false,
    loadingRoute: ""
  },
  mutations: {
    setSnackbar (state, {color, timeout, text, icon, extra}) {
      state.snackbar.enabled = false;
      state.snackbar.enabled = true;
      state.snackbar.color = color;
      state.snackbar.timeout = timeout;
      state.snackbar.text = text;
      state.snackbar.icon = icon;
      state.snackbar.extra = extra;
    },
    setOutdated (state, value) {
      state.outdated = value
    },
    setNotice (state, value) {
      Vue.set(state, "notice", value)
    },
    setLoadingRoute (state, value) {
      state.loadingRoute = value
    },
  },
  getters: {
    snackbar: state => state.snackbar,
    outdated: state => state.outdated,
    notice: state => state.notice,
    loadingRoute: state => state.loadingRoute,
  }
};