import Vue from 'vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueAnalytics from "vue-analytics"
import 'aos/dist/aos.css'
import I18n from "@/i18n"
import config from "@/config"

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

const production = process.env.NODE_ENV === 'production';

Vue.config.performance = true;

if (production) {
  Sentry.init({
    dsn: 'https://aebfbfbe08de42f7a9f291f5ae9ebf97@sentry.imgal.vin/2',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],

    // NOTE: the config below (`logErrors`) controls whether the error will be logged
    // to the console or not. Considering we are in production, logging
    // errors to the console is not appropriate (since we are using Sentry).
    // So I've turned this setting off. If necessary please re-enable it.
    // More info at: https://docs.sentry.io/platforms/javascript/vue/
    logErrors: false,
    release: 'frontend-v2@' + (config.version || 'unknown'),
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
  document.title = `${I18n.t(to.meta.i18n)} | ${I18n.t('app.name')}`;
  next();
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');