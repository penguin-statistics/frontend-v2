export default {
  namespaced: true,
  state: {},
  mutations: {
    store: (state, d) => {
      state = Object.assign(state, d);
    }
  },
  getters: {
    byName: (state) => (name) => {
      return state[name]
    }
  }
};