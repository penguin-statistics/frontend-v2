import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";

// store file
import ajax from './modules/ajax';
import auth from './modules/auth';
import cacheUpdateAt from './modules/cacheUpdateAt';
import data from './modules/data';
import dataSource from './modules/dataSource';
import settings from './modules/settings';
import ui from './modules/ui';

Vue.use(Vuex);

const previousState = localStorage.getItem("penguin-stats-state");
if (previousState) {
  localStorage.setItem("penguin-stats-data", {data: previousState["data"]});
  localStorage.setItem("penguin-stats-settings", {settings: previousState["settings"]});
  localStorage.setItem("penguin-stats-auth", {auth: previousState["auth"]});
  localStorage.setItem("penguin-stats-cacheTTL", {cacheUpdateAt: previousState["cacheUpdateAt"]});
  localStorage.removeItem("penguin-stats-state")
}

const ls = new SecureLS({ isCompression: true });

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "penguin-stats-data",
      paths: [
        "data"
      ],
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
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
    settings,
    ui
  }
});