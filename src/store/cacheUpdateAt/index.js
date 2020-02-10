export default {
  state: {},
  mutations: {
    storeCacheUpdateAt: (state, d) => {
      state = Object.assign(state, d);
    }
  },
  getters: {
    cacheUpdateAt: (state) => (name) => {
      return state[name]
    }
  }
};