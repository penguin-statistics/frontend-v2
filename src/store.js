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
      language: null
    },
    auth: {
      username: null
    },
    cacheUpdateAt: {},
    dataSource: 'global'
  },
  mutations: {
    store: (state, {key, value}) => {
      Vue.set(state.data, key, value)
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
      state.settings.language = newLocale
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
      Promise.all([
        itemsManager.get(refresh),
        limitationsManager.get(refresh),
        stagesManager.get(refresh),
        zonesManager.get(refresh)
      ]).then(() => {
        globalMatrixManager.get(refresh);
        personalMatrixManager.get(refresh)
      })
      // await trendsManager.get(refresh);

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
    },
    language: state => state.settings.language
  }
})