import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import itemsManager from '@/models/items'
import limitationsManager from '@/models/limitations'
import stagesManager from '@/models/stages'
import zonesManager from '@/models/zones'
// import trendsManager from '@/models/trends'
import globalMatrixManager from '@/models/matrices/globalMatrix'
import personalMatrixManager from '@/models/matrices/personalMatrix'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "penguin-stats-state",
      paths: [
        "data",
        "settings",
        "auth",
        "cacheUpdateAt"
      ]
    })
  ],
  state: {
    data: {},
    ajax: {
      states: []
    },
    settings: {
      dark: true,
      locale: 'zh'
    },
    auth: {
      username: null
    },
    cacheUpdateAt: {},
    dataSource: 'global'
  },
  mutations: {
    store: (state, d) => {
      state.data = Object.assign(state.data, d);
    },
    storeCacheUpdateAt: (state, d) => {
      state.cacheUpdateAt = Object.assign(state.cacheUpdateAt, d);
    },
    switchDataSource: (state, value) => {
      state.dataSource = value;
    },
    switchDark(state, newState) {
      state.settings.dark = newState
    },
    changeLocale(state, newLocale) {
      state.settings.locale = newLocale
    },
    authLogin(state, username) {
      state.auth.username = username
    },
    authLogout(state) {
      state.auth.username = null
    },
    ajaxNewState(state, payload) {
      state.ajax.states.push(payload);
    }
  },
  actions: {
    // eslint-disable-next-line
    async fetchData({}, refresh = false) {
      await itemsManager.get(refresh);
      await limitationsManager.get(refresh);
      await stagesManager.get(refresh);
      await zonesManager.get(refresh);
      // await trendsManager.get(refresh);
      await globalMatrixManager.get(refresh);
      await personalMatrixManager.get(refresh)
    },
    async refreshPersonalMatrixData() {
      await personalMatrixManager.get(true)
    },
    _getOrCreateAjaxStateObject ({commit, state}, id) {
      let found = state.ajax.states.find(value => value.id === id);
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
    authed: state => {
      return !!state.auth.username
    },
    authUsername: state => {
      return state.auth.username || ''
    },
    ajaxPending: state => {
      return state.ajax.states.some(value => value.pending)
    },
    ajaxFinishedAll: state => {
      return state.ajax.states.every(value => !value.pending)
    },
    ajaxErrors: state => {
      return state.ajax.states.filter(value => !!value.error)
    },
    dataByKey: (state) => (id) => {
      return state.data[id]
    },
    cacheUpdateAt: (state) => (name) => {
      return state.cacheUpdateAt[name]
    }
  }
})