export default {
  namespaced: true,
  state: {
    histories: [],
    favorites: []
  },
  mutations: {
    addHistory (state, stageId) {
      state.histories.push({
        at: Date.now(),
        id: stageId
      })
    },
    toggleFavorite (state, newFavorite) {
      if (state.favorites.includes(newFavorite)) {
        state.favorites.splice(state.favorites.indexOf(newFavorite), 1)
      } else {
        state.favorites.push(newFavorite)
      }
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
};