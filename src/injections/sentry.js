import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import {Integrations as ApmIntegrations} from "@sentry/apm";
import config from "@/config";
import environment from "@/utils/environment";
import Vue from "vue";

if (environment.production) {
  Sentry.init({
    dsn: 'https://9636aaa824a744f98a619df0aaabba00@sentry.io/1536764',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      }),
      new ApmIntegrations.Tracing(),
    ],
    tracesSampleRate: 0.1,
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
      // "QuotaExceededError",
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
    ]
  });
}