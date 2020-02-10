export default {
  state: {
    states: []
  },
  mutations: {
    ajaxNewState(state, payload) {
      state.states.push(payload);
    }
  },
  actions: {
    ajaxNewState(state, payload) {
      state.states.push(payload);
    },
    _getOrCreateAjaxStateObject ({commit, state}, id) {
      let found = state.states.find(value => value.id === id);
      if (found) {
        return found
      } else {
        let pushing = Object.create(null);
        pushing.id = id;
        pushing.pending = false;
        pushing.error = null;
  
        commit('ajaxNewState', pushing);
        return pushing
      }
    } ,
    ajaxStarted({dispatch}, {id}) {
      dispatch('_getOrCreateAjaxStateObject', id)
        .then(res => {
          res.pending = true
        });
    },
    ajaxFinished({dispatch}, {id, error}) {
      dispatch('_getOrCreateAjaxStateObject', id)
        .then(res => {
          res.pending = false;
          res.error = error
        });
    }
  },
  getters: {
    ajaxPending: state => {
      return state.states.some(value => value.pending)
    },
    ajaxFinishedAll: state => {
      return state.states.every(value => !value.pending)
    },
    ajaxErrors: state => {
      return state.states.filter(value => !!value.error)
    },
  }
};