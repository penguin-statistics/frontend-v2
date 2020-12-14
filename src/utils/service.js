import axios from 'axios'
import Console from "@/utils/Console";
import store from "@/store";
import mirror from "@/utils/mirror";
import semver from "semver";
import config from "@/config"
import i18n from "@/i18n";

let baseURL;
if (mirror.global.isCurrent() || mirror.cn.isCurrent()) {
  // those are official mirrors. just use the relative path.
  baseURL = "/PenguinStats/api/v2"
} else if (process.env.NODE_ENV === "development") {
  // developing at localhost.
  // also use the relative path, but we left the task to WebpackDevServer for proxying local API responses
  // so use relative path.
  baseURL = "/PenguinStats/api/v2"
} else {
  // high chance of using a staging environment where api is not available with the frontend deployment.
  // use the absolute endpoint to get the juicy responses :)
  baseURL = "https://penguin-stats.io/PenguinStats/api/v2"
}

const service = axios.create({
  // baseURL: see rules above
  baseURL,
  withCredentials: true,
  timeout: 90 * 1000 // 1.5 minute
});

const deployingFlag = `<meta name="penguin:exception" content="type=deploying">`

function needsUpdate(response) {
  if ("x-penguin-upgrade" in response.headers) {
    // X-Penguin-Upgrade: Client version must be outdated due to
    // API endpoint changes or other changes that must be updated.
    return true
  }
  if ("x-penguin-compatible" in response.headers) {
    const version = response.headers["x-penguin-compatible"]
      // replace prefix
      .replace(new RegExp("^" + config.project + "@"), "")

    const cleaned = semver.clean(version)

    if (cleaned === null) {
      // if still invalid, assume it is VALID then
      return false
    } else {
      // cleaned successfully
      // if current one is smaller than expected, then it is INVALID
      return semver.lt(config.version, cleaned)
    }
  }
  return false
}

// Add a response interceptor
service.interceptors.response.use(function (response) {
  if (needsUpdate(response)) {
    store.commit("ui/setOutdated", true)
  }

  return response;
}, function (error) {
  if (error.response) {

    if (needsUpdate(error.response)) {
      store.commit("ui/setOutdated", true)
    }

    // eliminate `user not found` errors (reports 404).
    if (error.response.status !== 404) {
      Console.error("Ajax", "failed", error)
    }

    let message;

    if (error && error.response && error.response.data && error.response.data.indexOf(deployingFlag) >= 0) {
      message = i18n.t('fetch.failed.deploying')
    } else {
      message = error.response.data || error.message
    }

    error.errorMessage = `(s=${error.response.status}) ${message}`;
  } else {
    error.errorMessage = `(s=-1) ${error.message}`;
  }
  // Do something with response error
  return Promise.reject(error);
});

const externalService = axios.create({
  withCredentials: false
})

export {service, externalService}
