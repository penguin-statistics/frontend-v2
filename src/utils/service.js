import axios from 'axios'
import Console from "@/utils/Console";

const service = axios.create({
  // on non-production environments the client will try to send any unknown requests (requests that did not match a static file)
  // to https://penguin-stats.io/PenguinStats/api via `webpack-dev-server`, described in `vue.config.js`
  // in order to use local server, please change the corresponding setting in `vue.config.js`
  baseURL: process.env.NODE_ENV === "development" ? "/PenguinStats/api" : "https://penguin-stats.io/PenguinStats/api"
});

// Add a response interceptor
service.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  Console.error("[ajax] error", error);
  if (error.response) {
    error.errorMessage = `(${error.response.status}) ${error.response.data ? error.response.data : error.message}`;
  } else {
    error.errorMessage = `(-1) ${error.message}`;
  }
  // Do something with response error
  return Promise.reject(error);
});

export default service
