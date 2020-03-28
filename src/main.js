import Vue from 'vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from "vue-analytics"
import i18n from "@/i18n"
import config from "@/config"
import VueNumberInput from '@chenfengyuan/vue-number-input';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

const production = process.env.NODE_ENV === 'production';

if (production) {
  Sentry.init({
    dsn: 'https://5d8bed30aca44a19a3a49c4de2ca73d9@sentry.imgal.vin/2',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
    release: 'frontend-v2@' + (config.version || 'unknown')
  });
}

Vue.use(VueAnalytics, {
  id: 'UA-142226262-1',
  // customResourceURL: "https://www.google-analytics.com/analytics.js",
  router,
  debug: {
    // enabled: process.env.NODE_ENV === "development",
    enabled: false,
    sendHitTask: production
  },
  batch: {
    enabled: true, // enable/disable
    amount: 5, // amount of events fired
    delay: 2000 // delay in milliseconds
  },
  autoTracking: {
    exception: true,
    exceptionLogs: !production
  }
});

router.beforeEach((to, from, next) => {
  document.title = `${i18n.t(to.meta.i18n)} | ${i18n.t('app.name')}`;
  next();
});

Vue.config.productionTip = false;

Vue.use(VueNumberInput);

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');