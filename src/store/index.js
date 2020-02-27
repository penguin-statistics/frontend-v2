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
  modules: {
    ajax,
    auth,
    cacheUpdateAt,
    data,
    dataSource,
    settings
  }
});