export default {
  state: {
    username: null
  },
  mutations: {
    authLogin(state, username) {
      state.username = username
    },
    authLogout(state) {
      state.username = null
    }
  },
  getters: {
    authed: state => {
      return !!state.username
    },
    authUsername: state => {
      return state.username || ''
    }
  }
};