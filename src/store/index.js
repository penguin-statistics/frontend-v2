import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// store file
import ajax from '@/store/ajax';
import auth from '@/store/auth';
import cacheUpdateAt from '@/store/cacheUpdateAt';
import data from '@/store/data';
import dataSource from '@/store/dataSource';
import settings from '@/store/settings';
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
    ajax: ajax,
    auth: auth,
    cacheUpdateAt: cacheUpdateAt,
    data: data,
    dataSource: dataSource,
    settings: settings
  }
});