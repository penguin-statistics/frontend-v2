export default {
  namespaced: true,
  state: {
    source: 'global'
  },
  mutations: {
    switch: (state, value) => {
      state.source = value;
    }
  },
  getters: {
    source: state => state.source
  }
};