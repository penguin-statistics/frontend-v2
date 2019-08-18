import axios from 'axios'

const service = axios.create({
  // on non-production environments the client will try to send any unknown requests (requests that did not match a static file)
  // to http://localhost:8081/PenguinStats/api , described in vue.config.js
  baseURL: process.env.NODE_ENV === "production" ? "/PenguinStats/api" : "/"
});

// Add a response interceptor
service.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  error.errorMessage = error.response.data.message || `${error.message} (http-${error.statusCode})`;
  // Do something with response error
  return Promise.reject(error);
});

export default service
