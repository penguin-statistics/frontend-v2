const MAX_HISTORY_RECORD_LENGTH = 30

export default {
  namespaced: true,
  state: {
    // histories is a FIFO stack where the latest record is at the FIRST element of the stack.
    histories: [],
    // histories is a stack where the latest record is at the LAST element of the stack.
    favorites: []
  },
  mutations: {
    addHistory (state, stageId) {
      if (state.histories.includes(stageId)) {
        // in order to *move* record to the top of the stack we need to delete it first
        // to avoid duplication
        state.histories.splice(state.histories.indexOf(stageId), 1)
      }
      if (state.histories.length >= MAX_HISTORY_RECORD_LENGTH) {
        // we avoid exceeding the limit by first remove the last element
        state.histories.pop()
      }
      state.histories.unshift(stageId)
    },
    clearHistory (state) {
      state.histories = []
    },
    toggleFavorite (state, newFavorite) {
      if (state.favorites.includes(newFavorite)) {
        state.favorites.splice(state.favorites.indexOf(newFavorite), 1)
      } else {
        state.favorites.push(newFavorite)
      }
    },
    clearFavorite (state) {
      state.favorites = []
    }
  },
  getters: {
    histories: state => {
      return state.histories
    },
    favorites: state => {
      return state.favorites
    },
    hasFavorite: state => key => {
      return state.favorites.includes(key)
    }
  }
}
