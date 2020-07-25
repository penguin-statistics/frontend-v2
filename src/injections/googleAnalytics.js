import Vue from "vue";
import VueAnalytics from "vue-analytics";
import router from "@/router";
import mirror from "@/utils/mirror";
import environment from "@/utils/environment";

const googleAnalyticsID = mirror.cn.isCurrent() ? 'UA-142226262-4' : 'UA-142226262-1'

Vue.use(VueAnalytics, {
  id: googleAnalyticsID,
  // customResourceURL: "https://www.google-analytics.com/analytics.js",
  router,
  debug: {
    // enabled: process.env.NODE_ENV === "development",
    enabled: false,
    sendHitTask: environment.production
  },
  batch: {
    enabled: true, // enable/disable
    amount: 5, // amount of events fired
    delay: 2000 // delay in milliseconds
  }
});