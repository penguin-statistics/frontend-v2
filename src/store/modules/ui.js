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
    }
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
  },
  getters: {
    snackbar: state => state.snackbar,
  }
};