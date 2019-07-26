import axios from 'axios'
import store from '@/store'

const service = axios.create({
  baseURL: "https://penguin-stats.io/PenguinStats/api"
});

service.interceptors.request.use(function (config) {
  store.dispatch("ajax_began")

  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
service.interceptors.response.use(function (response) {
  store.dispatch("ajax_finished")

  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default service
