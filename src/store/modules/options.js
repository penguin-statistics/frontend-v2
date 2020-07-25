import Vue from 'vue';
import config from '@/config'

export default {
  namespaced: true,
  state: {
    dataTable: {
      showPermanent: true,
      showActivity: true,
      onlyOpen: false,
    },
    randomBackground: Object.assign({}, {
      last: Date.now(),
      id: []
    }),
    userIdHistory: []
  },
  mutations: {
    changeDataTable (state, value) {
      Vue.set(state, "dataTable", value)
    },
    changeRandomBackground(state, {last, id}) {
      state.randomBackground.last = last
      state.randomBackground.id = id
    },
    clearRandomBackground (state) {
      state.randomBackground.last = Date.now()
      state.randomBackground.id = []
    },
    addUserIdHistory (state, id) {
      const existedHistory = state.userIdHistory.find(el => el.id === id)
      if (existedHistory) {
        // only update the time when existed
        existedHistory.time = Date.now()
        existedHistory.version = config.version
      } else {
        // otherwise, add the non-existing id history.
        state.userIdHistory.push({
          id,
          time: Date.now(),
          version: config.version
        })
      }
    },
    removeUserIdHistory (state, id) {
      state.userIdHistory = state.userIdHistory.filter(el => el.id !== id)
    },
    clearUserIdHistory (state) {
      state.userIdHistory = []
    }
  },
  getters: {
    dataTable: state => state.dataTable,
    randomBackground: state => state.randomBackground,
    userIdHistory: state => state.userIdHistory
  }
};