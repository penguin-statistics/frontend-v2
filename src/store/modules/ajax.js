export default {
  namespaced: true,
  state: {
    states: []
  },
  mutations: {
    newState (state, payload) {
      state.states.push(payload)
    }
  },
  actions: {
    _getOrCreateState ({ commit, state }, id) {
      const found = state.states.find(value => value.id === id)
      if (found) {
        return found
      } else {
        const pushing = Object.create(null)
        pushing.id = id
        pushing.pending = false
        pushing.error = null

        commit('newState', pushing)
        return pushing
      }
    },
    started ({ dispatch }, { id }) {
      dispatch('_getOrCreateState', id)
        .then(res => {
          res.pending = true
        })
    },
    finished ({ dispatch }, { id, error }) {
      dispatch('_getOrCreateState', id)
        .then(res => {
          res.pending = false
          res.error = error
        })
    }
  },
  getters: {
    pending: state => state.states.some(value => value.pending),
    pendingByKey: state => key => state.states.some(value => value.pending && value.id === key),
    // finishedAll: state => {
    //   return state.states.every(value => !value.pending)
    // },
    errors: state => state.states.filter(value => !!value.error),
    matrixPending: state => state.states.some(value => value.pending && value.id.includes('Matrix'))
  }
}
