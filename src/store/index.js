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
import ui from './modules/ui';
// import compressor from "@/utils/compressor";

Vue.use(Vuex);

const previousState = localStorage.getItem("penguin-stats-state");
if (previousState) {
  localStorage.setItem("penguin-stats-data", {data: previousState["data"]});
  localStorage.setItem("penguin-stats-settings", {settings: previousState["settings"]});
  localStorage.setItem("penguin-stats-auth", {auth: previousState["auth"]});
  localStorage.setItem("penguin-stats-cacheTTL", {cacheUpdateAt: previousState["cacheUpdateAt"]});
  localStorage.removeItem("penguin-stats-state")
}

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "penguin-stats-data",
      paths: [
        "data"
      ],
      // storage: {
      //   getItem: (key) => {
      //     const timerId = Math.random();
      //     console.time("getItem " + timerId)
      //     const got = compressor.decompress(
      //       localStorage.getItem(key)
      //     )
      //     console.timeEnd("getItem " + timerId)
      //     return got
      //   },
      //   // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
      //   setItem: (key, value) => {
      //     const timerId = Math.random();
      //     console.time("setItem " + timerId)
      //     const set = localStorage.setItem(
      //       key,
      //       compressor.compress(value)
      //     )
      //     console.timeEnd("setItem " + timerId)
      //     return set
      //   },
      //   removeItem: (key) => localStorage.removeItem(key),
      // },
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