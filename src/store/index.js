import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// store file
import ajax from './modules/ajax';
import auth from './modules/auth';
import cacheUpdateAt from './modules/cacheUpdateAt';
import data from './modules/data';
import dataSource from './modules/dataSource';
import settings from './modules/settings';

Vue.use(Vuex);

localStorage.removeItem("penguin-stats-state");

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "penguin-stats-data",
      paths: [
        "data"
      ]
    }),
    createPersistedState({
      key: "penguin-stats-settings",
      paths: [
        "settings"
      ]
    }),
    createPersistedState({
      key: "penguin-stats-auth",
      paths: [
        "auth"
      ]
    }),
    createPersistedState({
      key: "penguin-stats-cacheTTL",
      paths: [
        "cacheUpdateAt"
      ]
    })
  ],
  modules: {
    ajax,
    auth,
    cacheUpdateAt,
    data,
    dataSource,
    settings
  }
});