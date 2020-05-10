export default {
  namespaced: true,
  state: {
    /** current data source "global" | "personal" */
    source: 'global',
    /** current data source server "CN" | "US" | ... */
    server: "CN"
  },
  mutations: {
    changeSource: (state, value) => {
      state.source = value;
    },
    changeServer: (state, value) => {
      state.server = value;
    },
  },
  getters: {
    source: state => state.source,
    server: state => state.server,
  }
};