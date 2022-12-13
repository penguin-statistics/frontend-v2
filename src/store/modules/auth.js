import Cookies from 'js-cookie'

export default {
  namespaced: true,
  state: {
    username: null,
    probeUid: {
      u: null,
      c: null
    }
  },
  mutations: {
    changeUsername (state, username) {
      state.username = username
    },
    changeProbeUid (state, uid) {
      state.probeUid.u = Date.now()
      state.probeUid.c = uid
    }
  },
  actions: {
    login ({ commit }, userId) {
      commit('changeUsername', userId)
      // only add true login ones
      if (userId) commit('options/addUserIdHistory', userId, { root: true })
    },
    logout ({ commit }) {
      commit('changeUsername', null)
      Cookies.remove("userID", { path: "/", domain: "." + window.location.hostname })
    }
  },
  getters: {
    loggedIn: state => {
      return !!state.username
    },
    username: state => {
      return state.username || ''
    },
    probeUid: state => state.probeUid
  }
}
