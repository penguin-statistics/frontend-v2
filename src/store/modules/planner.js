import Vue from 'vue'
export default {

  namespaced: true,
  state: {
    items: [],
    options: {
      byProduct: false,
      requireExp: false,
      requireLmb: false
      // calculateStore: false
    },
    excludes: []
  },
  mutations: {
    changeItems (state, items) {
      state.items = items
    },
    changeOptions (state, options) {
      state.options = options
    },
    changeExcludes (state, excludes) {
      state.excludes = excludes
    },
    clearExcludes (state) {
      Vue.set(state, 'excludes', [])
    }
  },
  getters: {
    config: state => state,
    excludes: state => state.excludes
  }
}
