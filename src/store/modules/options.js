import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    dataTable: {
      showMainline: true,
      showPermanent: true,
      showActivity: true,
      onlyOpen: false,
    },
    randomBackground: Object.assign({}, {
      last: Date.now(),
      id: []
    })
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
    }
  },
  getters: {
    dataTable: state => state.dataTable,
    randomBackground: state => state.randomBackground,
  }
};