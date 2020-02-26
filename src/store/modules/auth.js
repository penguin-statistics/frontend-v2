export default {
  namespaced: true,
  state: {
    username: null
  },
  mutations: {
    login(state, username) {
      state.username = username
    },
    logout(state) {
      state.username = null
    }
  },
  getters: {
    loggedIn: state => {
      return !!state.username
    },
    username: state => {
      return state.username || ''
    }
  }
};