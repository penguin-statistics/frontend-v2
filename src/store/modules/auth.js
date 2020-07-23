import Cookies from "js-cookie";
import config from "@/config";

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
    login({commit, dispatch}, {userId, prompted = true}) {
      commit('changeUsername', userId)
      if (prompted) {
        Cookies.set(config.authorization.userId.cookieKey, this.auth.username, {expires: 90, path: "/"});
        dispatch("data/refreshPersonalMatrix", null, { root: true });

        this.$ga.event('account', 'login', 'login_success', 1);
      }
      // only add true login ones
      if (userId) commit('options/addUserIdHistory', userId, { root: true })
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