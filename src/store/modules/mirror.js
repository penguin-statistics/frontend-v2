export default {
  namespaced: true,
  state: {
    preference: null,
    ignoreNotification: false
  },
  mutations: {
    changePreference(state, newLocale) {
      state.preference = newLocale
    },
    changeIgnoreNotification (state, newState) {
      state.ignoreNotification = newState
    },
  },
  getters: {
    preference: state => state.preference,
    ignoreNotification: state => state.ignoreNotification,
  }
};