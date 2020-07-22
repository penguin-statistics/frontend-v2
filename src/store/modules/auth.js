export default {
  namespaced: true,
  state: {
    username: null
  },
  mutations: {
    changeUsername (state, username) {
      state.username = username
    }
  },
  actions: {
    login({commit}, username) {
      commit('changeUsername', username)
      // only add true login ones
      if (username) commit('options/addUserIdHistory', username, { root: true })
    },
    logout({commit}) {
      commit('changeUsername', null)
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