import Vue from 'vue'
import './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueAnalytics from "vue-analytics";

Vue.use(VueAnalytics, {
  id: 'UA-XXX-X',
  // customResourceURL: "https://www.google-analytics.com/analytics.js",
  router,
  debug: {
    enabled: process.env.NODE_ENV === "development",
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  batch: {
    enabled: true, // enable/disable
    amount: 5, // amount of events fired
    delay: 2000 // delay in milliseconds
  },
  autoTracking: {
    exception: true,
    exceptionLogs: process.env.NODE_ENV === "development"
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
