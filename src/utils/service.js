import axios from 'axios'
import Console from "@/utils/Console";
import store from "@/store";
import mirror from "@/utils/mirror";

let baseURL;
if (mirror.global.isCurrent() || mirror.cn.isCurrent()) {
  // those are official mirrors. just use the relative path.
  baseURL = "https://penguin-stats.io/PenguinStats/api/v2"
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

// Add a response interceptor
service.interceptors.response.use(function (response) {
  if ("x-penguin-upgrade" in response.headers) {
    // X-Penguin-Upgrade: Client version outdated
    store.commit("ui/setOutdated", true)
  }

  return response;
}, function (error) {
  if (error.response) {

    if ("x-penguin-upgrade" in error.response.headers) {
      // X-Penguin-Upgrade: Client version outdated
      store.commit("ui/setOutdated", true)
    }

    // eliminate `user not found` errors (reports 404).
    if (error.response.status !== 404) {
      Console.error("Ajax", "failed", error)
    }

    error.errorMessage = `(s=${error.response.status}) ${error.response.data ? error.response.data : error.message}`;
  } else {
    error.errorMessage = `(s=-1) ${error.message}`;
  }
  // Do something with response error
  return Promise.reject(error);
});

export default service
