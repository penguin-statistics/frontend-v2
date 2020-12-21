import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import config from "@/config";
import environment from "@/utils/environment";
import Vue from "vue";

if (environment.production) {
  const sentEvents = {};

  // set the limitation of a same client sending the same message event to Sentry for every session
  const maxSameEventPerClient = 10;

  Sentry.init({
    dsn: 'https://9636aaa824a744f98a619df0aaabba00@sentry.io/1536764',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
        tracing: true
      })
    ],
    tracesSampleRate: 0.05,
    release: (config.project || 'unknown') + '@' + (config.version || 'unknown'),
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
      "vivoNewsDetailPage",
      "removeAD",

      "getBoundingClientRect",
      // ignore native client does not have web implementation error
      // since there's currently no feature sensitive native client plugin invocations.
      "does not have web implementation",
      "GlobalCapacitor"
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