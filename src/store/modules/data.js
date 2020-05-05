import Vue from 'vue';
import itemsManager from '@/models/items'
import limitationsManager from '@/models/limitations'
import stagesManager from '@/models/stages'
import zonesManager from '@/models/zones'
// import trendsManager from '@/models/trends'
import globalMatrixManager from '@/models/matrices/globalMatrix'
import personalMatrixManager from '@/models/matrices/personalMatrix'

export default {
  namespaced: true,
  state: {},
  mutations: {
    store: (state, {key, value}) => {
      Vue.set(state, key, value)
    }
  },
  actions: {
    // eslint-disable-next-line
    async fetch({}, refresh = false) {
      itemsManager.get(refresh);
      limitationsManager.get(refresh);
      stagesManager.get(refresh);
      zonesManager.get(refresh);
      globalMatrixManager.get(refresh);
      personalMatrixManager.get(refresh)
    // await trendsManager.get(refresh);
    },
    async refreshPersonalMatrix() {
      await personalMatrixManager.get(true)
    }
  },
  getters: {
    byKey: (state) => (id) => {
      return state[id]
    },
    length: (state) => {
      return Object.keys(state).length;
    }
  }
};