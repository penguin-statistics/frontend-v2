import Vue from "vue"

export default {
  namespaced: true,
  state: {
    caches: {}
  },
  mutations: {
    set (state, {key, value}) {
      Vue.set(state.caches, key, value)
    }
  },
  getters: {
    content: state => key => state.caches[key],
    have: state => key => key in state.caches
  }
};