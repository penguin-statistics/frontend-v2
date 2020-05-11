import axios from 'axios'
import Console from "@/utils/Console";
import store from "@/store";

const isValidHost = window.location.hostname === "penguin-stats.io" || window.location.hostname === "penguin-stats.cn"

const service = axios.create({
  baseURL: isValidHost ? "/PenguinStats/api" : "https://penguin-stats.io/PenguinStats/api",
  withCredentials: true
});

// Add a response interceptor
service.interceptors.response.use(function (response) {
console.log(response.headers)
  if ("x-penguin-upgrade" in response.headers) {
    // X-Penguin-Upgrade: Client version outdated
    store.commit("ui/setOutdated", true)
  }

  return response;
}, function (error) {
  // eliminate `users not found` errors (reports 404).
  if (error.response) {

    if ("X-Penguin-Upgrade" in error.response.headers) {
      // X-Penguin-Upgrade: Client version outdated
      store.commit("ui/setOutdated", true)
    }

    if (error.response.status !== 404) {
      Console.error("Ajax", "error", error)
    }

    error.errorMessage = `(${error.response.status}) ${error.response.data ? error.response.data : error.message}`;
  } else {
    error.errorMessage = `(-1) ${error.message}`;
  }
  // Do something with response error
  return Promise.reject(error);
});

export default service
