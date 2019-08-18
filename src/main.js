import Vue from 'vue'
import './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueAnalytics from "vue-analytics";
import AOS from 'aos'
import 'aos/dist/aos.css'

Vue.use(VueAnalytics, {
  id: 'UA-XXX-X',
  // customResourceURL: "https://www.google-analytics.com/analytics.js",
  router,
  debug: {
    // enabled: process.env.NODE_ENV === "development",
    enabled: false,
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
  created() {
    AOS.init({
      delay: 100,
      duration: 700,
      easing: 'ease-in-out-sine'
    })
  },
  render: h => h(App),
}).$mount('#app');
