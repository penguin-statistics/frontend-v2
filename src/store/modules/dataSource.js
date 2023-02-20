export default {
  namespaced: true,
  state: {
    /** current data source "global" | "personal" */
    source: "global",
    /** current data source server "CN" | "US" | ... */
    server: "CN",
    /** current matrix categories "all" | "automated" | "manual" */
    category: "all",
  },
  mutations: {
    changeSource: (state, value) => {
      state.source = value;
    },
    changeServer: (state, value) => {
      state.server = value;
    },
    changeCategory: (state, value) => {
      state.category = value;
    }
  },
  getters: {
    source: (state) => state.source,
    server: (state) => state.server,
    category: (state) => state.category,
  },
};
