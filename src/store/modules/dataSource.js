export default {
  namespaced: true,
  state: {
    /** current data source "global" | "personal" */
    source: 'global',
    /** current data source server "CN" | "US" | ... */
    server: 'CN',
    serverLocked: 0
  },
  mutations: {
    changeSource: (state, value) => {
      state.source = value
    },
    changeServer: (state, value) => {
      state.server = value
    },
    lockServer (state) {
      state.serverLocked = 1
    },
    unlockServer (state) {
      state.serverLocked = 0
    },
    changeLockState: (state, value) => {
      state.serverLocked = value
    }
  },
  getters: {
    source: state => state.source,
    server: state => state.server,
    serverLocked: state => state.serverLocked
  }
}
