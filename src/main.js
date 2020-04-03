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

import './serviceWorker/register'

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import { Integrations as ApmIntegrations } from '@sentry/apm';

const production = process.env.NODE_ENV === 'production';

if (production) {
  Sentry.init({
    dsn: 'https://9636aaa824a744f98a619df0aaabba00@sentry.io/1536764',
    integrations: [
      new Integrations.Vue({Vue, attachProps: true}),
      new ApmIntegrations.Tracing(),
    ],
    tracesSampleRate: 0.05,
    release: 'frontend-v2@' + (config.version || 'unknown'),
    ignoreErrors: [
      //// START: those errors are found at https://docs.sentry.io/platforms/javascript/#decluttering-sentry
      'top.GLOBALS',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.epicplay.com',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      // Facebook borked
      'fb_xd_fragment',
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
      // reduce this. (thanks @acdha)
      // See http://stackoverflow.com/questions/4113268
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      'conduitPage',
      //// END

      //// Those are our customized ones
      "QuotaExceededError",
      "vivoNewsDetailPage",
      "Request aborted"
    ]
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
    exceptionLogs: true,
    screenview: true
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