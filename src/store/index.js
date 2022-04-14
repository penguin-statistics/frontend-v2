import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import snackbar from "@/utils/snackbar";

// store file
import ajax from "./modules/ajax";
import auth from "./modules/auth";
import cache from "./modules/cache";
import data from "./modules/data";
import dataSource from "./modules/dataSource";
import mirror from "./modules/mirror";
import options from "./modules/options";
import planner from "./modules/planner";
import settings from "./modules/settings";
import stagePreferences from "./modules/stagePreferences";
import ui from "./modules/ui";
// import compressor from "@/utils/compressor";

Vue.use(Vuex);

const previousState = localStorage.getItem("penguin-stats-state");
if (previousState) {
  localStorage.removeItem("penguin-stats-state");
  localStorage.setItem("penguin-stats-data", { data: previousState.data });
  localStorage.setItem("penguin-stats-settings", {
    settings: previousState.settings,
  });
  localStorage.setItem("penguin-stats-auth", { auth: previousState.auth });
  localStorage.setItem("penguin-stats-cacheTTL", {
    cacheUpdateAt: previousState.cacheUpdateAt,
  });
  localStorage.setItem("penguin-stats-planner", {
    planner: previousState.planner,
    options: previousState.options,
    stagePreferences: previousState.stagePreferences,
  });
}

let notifiedStorageIssue = false;

const notifyStorageIssueOnce = () => {
  if (!notifiedStorageIssue) {
    notifiedStorageIssue = true;
    try {
      setTimeout(() => {
        snackbar.launch("warning", 30000, "settings.storageIssue");
      }, 3000);
    } catch (e) {
      console.warn("Storage: storageIssue snackbar launch failed: ", e);
    }
  }
};

const inMemoryStorageMap = {};

const inMemoryStorage = {
  getItem: (key) => {
    return inMemoryStorageMap[key];
  },
  setItem: (key, value) => {
    inMemoryStorageMap[key] = value;
  },
  removeItem: (key) => {
    delete inMemoryStorageMap[key];
  },
};

const isSafari = navigator.userAgent.indexOf("Safari") > -1;

const ephemeralStorages = [
  ...(isSafari ? [] : [localStorage]),
  ...(isSafari ? [] : [sessionStorage]),
  inMemoryStorage,
];

const persistedStorages = [
  localStorage,
  sessionStorage,
  inMemoryStorage
]

// delete cache before entry
for (const storage of persistedStorages) {
  storage.removeItem("penguin-stats-data");
  storage.removeItem("penguin-stats-cache");
}

let currentEphemeralStorage = ephemeralStorages[0]
let currentPersistedStorage = persistedStorages[0]

const getCurrentStorage = (mode) => {
  switch (mode) {
    case 'ephemeral':
      return currentEphemeralStorage
    case 'persisted':
      return currentPersistedStorage
    default:
      console.warn('getStorage got unexpected mode:', mode)
  }
}

const setCurrentStorage = (newStorage, mode) => {
  switch (mode) {
    case "ephemeral":
      currentEphemeralStorage = newStorage
      break
    case "persisted":
      currentPersistedStorage = newStorage
      break
    default:
      console.warn("getStorage got unexpected mode:", mode);
  }
}

const fallbackedStorage = (storages, mode) => {
  return {
    getItem: (key) => {
      console.groupCollapsed("Storage: getItem", key);
      console.groupEnd();

      try {
        const current = getCurrentStorage(mode)
        return current.getItem(key);
      } catch (e) {
        for (const storage of storages) {
          try {
            setCurrentStorage(storage, mode)
            return storage.getItem(key);
          } catch (e) {
            console.warn("Storage: getItem failed: ", e);
            // ignore error but notify once
          }
        }
      }
      notifyStorageIssueOnce();
      console.warn("Storage: no storage available with getItem for key", key);
      return null;
    },
    setItem: (key, value) => {
      console.groupCollapsed("Storage: setItem", key);
      console.trace(value);
      console.groupEnd();
      try {
        getCurrentStorage(mode).setItem(key, value);
        return;
      } catch (e) {
        for (const storage of storages) {
          try {
            setCurrentStorage(storage, mode);
            storage.setItem(key, value);
            return;
          } catch (e) {
            console.warn("Storage: setItem failed: ", e);
            // ignore error but notify once
          }
        }
      }
      notifyStorageIssueOnce();
      console.warn("Storage: no storage available with setItem for key", key);
    },
    removeItem: (key) => {
      console.groupCollapsed("Storage: removeItem", key);
      console.groupEnd();

      try {
        getCurrentStorage(mode).removeItem(key);
        return;
      } catch (e) {
        for (const storage of storages) {
          try {
            setCurrentStorage(storage, mode);
            storage.removeItem(key);
            return;
          } catch (e) {
            console.warn("Storage: removeItem failed: ", e);
            // ignore error but notify once
          }
        }
      }
      notifyStorageIssueOnce();
      console.warn(
        "Storage: no storage available with removeItem for key",
        key
      );
    },
  };
};

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: "penguin-stats-data",
      paths: ["data"],
      storage: fallbackedStorage(ephemeralStorages, "ephemeral"),
    }),
    createPersistedState({
      key: "penguin-stats-cache",
      paths: ["cache"],
      storage: fallbackedStorage(ephemeralStorages, "ephemeral"),
    }),
    createPersistedState({
      key: "penguin-stats-data-source",
      paths: ["dataSource"],
      storage: fallbackedStorage(persistedStorages, "persisted"),
    }),
    createPersistedState({
      key: "penguin-stats-settings",
      paths: ["settings", "options", "stagePreferences"],
      storage: fallbackedStorage(persistedStorages, "persisted"),
    }),
    createPersistedState({
      key: "penguin-stats-auth",
      paths: ["auth"],
      storage: fallbackedStorage(persistedStorages, "persisted"),
    }),
    createPersistedState({
      key: "penguin-stats-mirror",
      paths: ["mirror"],
      storage: fallbackedStorage(persistedStorages, "persisted"),
    }),
    createPersistedState({
      key: "penguin-stats-planner",
      paths: ["planner"],
      storage: fallbackedStorage(persistedStorages, "persisted"),
    }),
  ],
  modules: {
    ajax,
    auth,
    cache,
    data,
    dataSource,
    settings,
    stagePreferences,
    planner,
    mirror,
    options,
    ui,
  },
});
