import workbox from "./workers/register"

import Vue from 'vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from "vue-analytics"
import i18n from "@/i18n"
import config from "@/config"

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import { Integrations as ApmIntegrations } from '@sentry/apm';
import mirror from "@/utils/mirror";

const production = process.env.NODE_ENV === 'production';

if (production) {
  const sentEvents = {};

  // set the limitation of a same client sending the same message event to Sentry for every session
  const maxSameEventPerClient = 20;

  Sentry.init({
    dsn: 'https://9636aaa824a744f98a619df0aaabba00@sentry.io/1536764',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      }),
      new ApmIntegrations.Tracing(),
    ],
    tracesSampleRate: 0.005,
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
      "Request aborted",
      "Cannot read property 'style' of null",
      "removeAD",
      "querySelectorAll"
    ],
    ignoreUrls: [
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i,  // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
    ],
    beforeSend(event) {
      const {message} = event;
      if (message in sentEvents) {
        const counts = sentEvents[message];

        // if there's still 'quota' for the client to send this event
        if (counts < maxSameEventPerClient) {
          // record that we have send the event this time
          sentEvents[message] = counts + 1;
          // report event
          return event
        }
      } else {
        // this has not yet been sent; init var and send it
        sentEvents[message] = 1;
        return event
      }
    }
  });
}

const googleAnalyticsID = mirror.cn.isCurrent() ? 'UA-142226262-4' : 'UA-142226262-1'

Vue.use(VueAnalytics, {
  id: googleAnalyticsID,
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
  }
});

router.beforeEach((to, from, next) => {
  document.title = `${i18n.t(to.meta.i18n)} | ${i18n.t('app.name')}`;
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