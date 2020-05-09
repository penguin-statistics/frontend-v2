import Vue from 'vue';
import itemsManager from '@/models/managers/items'
import limitationsManager from '@/models/managers/limitations'
import stagesManager from '@/models/managers/stages'
import zonesManager from '@/models/managers/zones'
import trendsManager from '@/models/managers/trends'
import globalMatrixManager from '@/models/managers/matrices/globalMatrix'
import personalMatrixManager from '@/models/managers/matrices/personalMatrix'

export default {
  namespaced: true,
  state: {
    meta: {
      // current version
      v: 2
    },
    data: {}
  },
  mutations: {
    store: (state, {key, value}) => {
      Vue.set(state.data, key, value)
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
      personalMatrixManager.get(refresh);
      trendsManager.get(refresh);
    },
    async refreshPersonalMatrix() {
      await personalMatrixManager.get(true)
    }
  },
  getters: {
    byKey: (state) => (id) => {
      return state.data[id]
    },
    length: (state) => {
      return Object.keys(state.data).length;
    }
  }
};