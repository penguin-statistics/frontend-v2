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
  actions: {
    // switches the server together with what depends on it: planner excludes are per-server,
    // and the data of the previous server is dropped and the one of the new server fetched.
    // pass fetch: false when the caller is going to fetch the data on its own anyway, and
    // clearExcludes: false when the switch did not come from the user picking a server
    switchServer: ({ state, commit, dispatch }, { server, fetch = true, clearExcludes = true }) => {
      if (server === state.server) return;
      const oldServer = state.server;
      if (clearExcludes) commit("planner/clearExcludes", null, { root: true });
      dispatch("data/clean", oldServer, { root: true });
      commit("changeServer", server);
      if (fetch) dispatch("data/fetch", false, { root: true });
    }
  },
  getters: {
    source: (state) => state.source,
    server: (state) => state.server,
    category: (state) => state.category,
  },
};
