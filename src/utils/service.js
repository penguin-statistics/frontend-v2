import axios from 'axios'

const service = axios.create({
  baseURL: "https://penguin-stats.io/PenguinStats/api"
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
