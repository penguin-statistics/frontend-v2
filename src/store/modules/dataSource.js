export default {
  namespaced: true,
  state: 'global',
  mutations: {
    switchDataSource: (state, value) => {
      state = value;
    }
  }
};