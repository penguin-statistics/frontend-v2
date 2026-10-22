import config from "@/config";
import i18n from "@/i18n";
import store from "@/store";
import mirror from "@/utils/mirror";

// Datadog RUM collects the field performance data. It is only loaded when the build is configured
// with a RUM application (thus not in forks, local development or builds without the variables),
// only in the sampled sessions, and only once the page has loaded, so that it never competes with the app itself
const applicationId = process.env.VUE_APP_DATADOG_RUM_APPLICATION_ID;
const clientToken = process.env.VUE_APP_DATADOG_RUM_CLIENT_TOKEN;
// percentage of the sessions sent, 20 unless configured (an empty variable counts as unset)
const configuredSampleRate = parseFloat(process.env.VUE_APP_DATADOG_RUM_SESSION_SAMPLE_RATE);
const sampleRate = configuredSampleRate >= 0 && configuredSampleRate <= 100 ? configuredSampleRate : 20;

// the sessions are sampled here rather than by the SDK, so that the ones left out never download it.
// the decision is shared by the tabs and kept for the maximum duration of a RUM session
const samplingKey = "penguin-stats-rum-sampling";
const samplingDuration = 4 * 60 * 60 * 1000;

// the PenguinID is the credential of the account: elements showing it carry a data-dd-action-name,
// and the action names (taken from the text of the clicked element) and the error messages are redacted
const longNumber = /\b\d{6,}\b/g;

function host() {
  if (mirror.global.isCurrent()) return "penguin-stats.io";
  if (mirror.cn.isCurrent()) return "penguin-stats.cn";
  return "other";
}

function redact(text) {
  const penguinId = store.getters["auth/username"];
  if (penguinId && penguinId.length >= 6) text = text.split(penguinId).join("[PenguinID]");
  return text.replace(longNumber, "[number]");
}

function isSampled() {
  if (sampleRate <= 0 || sampleRate >= 100) return sampleRate >= 100;
  try {
    const saved = JSON.parse(localStorage.getItem(samplingKey));
    if (saved && saved.rate === sampleRate && Date.now() - saved.at < samplingDuration) return saved.sampled === true;
  } catch (e) {
    // no storage, or a malformed value: decide again
  }
  const sampled = Math.random() * 100 < sampleRate;
  try {
    localStorage.setItem(samplingKey, JSON.stringify({ sampled, rate: sampleRate, at: Date.now() }));
  } catch (e) {
    // the decision then only holds for this page load
  }
  return sampled;
}

async function start() {
  const { datadogRum } = await import(
    /* webpackChunkName: "datadog-rum" */ "@datadog/browser-rum"
  );
  datadogRum.init({
    applicationId,
    clientToken,
    site: "datadoghq.com",
    service: "penguin-stats-frontend",
    env: process.env.VUE_APP_DATADOG_RUM_ENV || "prod",
    version: config.version,
    // sampled by isSampled() already
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    // no long-lived anonymous user ID in the session cookie
    trackAnonymousUser: false,
    defaultPrivacyLevel: "mask-user-input",
    beforeSend(event) {
      if (event.type === "action" && event.action.target && typeof event.action.target.name === "string") {
        event.action.target.name = redact(event.action.target.name);
      }
      if (event.type === "error") {
        // console errors dump whole API requests and responses (with the Authorization header and the
        // request body), and Sentry has them already
        if (event.error.source === "console") return false;
        event.error.message = redact(event.error.message);
        if (event.error.stack) event.error.stack = redact(event.error.stack);
      }
      return true;
    },
    // no allowedTracingUrls: trace headers would make every API request preflighted
  });
  datadogRum.setGlobalContextProperty("host", host());
  datadogRum.setGlobalContextProperty("platform", PENGUIN_PLATFORM);
  store.watch(
    () => i18n.locale,
    (locale) => datadogRum.setGlobalContextProperty("locale", locale),
    { immediate: true }
  );
  store.watch(
    (state, getters) => getters["dataSource/server"],
    (server) => datadogRum.setGlobalContextProperty("server", server),
    { immediate: true }
  );
}

export function startRum() {
  if (!applicationId || !clientToken || !isSampled()) return;
  const run = () => {
    start().catch((err) => console.warn("RUM: failed to start", err));
  };
  const idle = () => {
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 2000 });
    else setTimeout(run, 0);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}
