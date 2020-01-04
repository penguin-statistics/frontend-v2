import axios from 'axios'

const service = axios.create({
  // on non-production environments the client will try to send any unknown requests (requests that did not match a static file)
  // to http://penguin-stats.io/PenguinStats/api via `webpack-dev-server`, described in vue.config.js
  baseURL: "/PenguinStats/api"
});

// Add a response interceptor
service.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  error.errorMessage = `${error.message} (http-${error.statusCode})`;
  // Do something with response error
  return Promise.reject(error);
});

export default service
