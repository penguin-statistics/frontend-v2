import config from "@/config";
import i18n from "@/i18n";
import store from "@/store";
import mirror from "@/utils/mirror";

// Datadog RUM collects the field performance data. It is only loaded when the build is configured
// with a RUM application (thus not in forks, local development or builds without the variables),
// only in the sampled sessions, and only once the page has loaded (or its data has arrived, see startRum), so that
// it does not compete with the app itself
const applicationId = process.env.VUE_APP_DATADOG_RUM_APPLICATION_ID;
const clientToken = process.env.VUE_APP_DATADOG_RUM_CLIENT_TOKEN;
// percentage of the sessions sent, 20 unless configured (an empty variable counts as unset)
const configuredSampleRate = parseFloat(process.env.VUE_APP_DATADOG_RUM_SESSION_SAMPLE_RATE);
const sampleRate = configuredSampleRate >= 0 && configuredSampleRate <= 100 ? configuredSampleRate : 20;

// the sessions are sampled here rather than by the SDK, so that the ones left out never download it.
// the decision is shared by the tabs and kept for the maximum duration of a RUM session
const samplingKey = "penguin-stats-rum-sampling";
const samplingDuration = 4 * 60 * 60 * 1000;

// the API requests that carry a W3C trace context (traceparent), so that their RUM resource links to the backend trace:
// only those to the API of the official site the page is on. They are same-origin, thus the header adds no CORS
// preflight; a cross-origin request would need the backend to allow the header in a preflight first (builds served
// elsewhere, such as previews or the app, use https://penguin-stats.io as a cross-origin API and are left out)
const tracedOrigins = ["https://penguin-stats.io", "https://penguin-stats.cn"];
const tracedPath = "/PenguinStats/api/";

function isTracedRequest(url) {
  const origin = window.location.origin;
  return tracedOrigins.includes(origin) && url.startsWith(origin + tracedPath);
}

// the PenguinID is the credential of the account: elements showing it carry a data-dd-action-name,
// and the action names (taken from the text of the clicked element) and the error messages are redacted
const longNumber = /\b\d{6,}\b/g;

// the data objects the app fetches at boot (see the data/fetch action)
const bootstrapData = ["config", "items", "stages", "zones", "globalMatrix", "globalPatternMatrix", "trends", "stats"];

// the custom timings of this page load, as epoch milliseconds keyed by their RUM name
const timings = {};
let rum = null;
// starts loading RUM, set by startRum (see there)
let beginStart = null;

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

// records a custom timing once per page load: as a performance mark for the lab scripts,
// and as a custom timing of the RUM view, now or as soon as RUM has started
function markTiming(name, mark) {
  if (name in timings) return;
  timings[name] = Date.now();
  if (window.performance && performance.mark) performance.mark(mark);
  if (rum) rum.addTiming(name, timings[name]);
}

/** marks the moment all the data fetched at boot has arrived and has been committed to the store */
export function trackBootstrapData() {
  const unwatch = store.watch(
    (state, getters) => bootstrapData.every((id) => getters["data/updated"]({ id })),
    (ready) => {
      if (!ready) return;
      unwatch();
      markTiming("bootstrap_data_ready", "pe:bootstrap-ready");
      if (beginStart) beginStart();
    }
  );
}

/** marks the first render of a data view (stats table, item grid...) for which rendersData() is true */
export function markFirstDataRender(rendersData) {
  if ("first_data_render" in timings || !rendersData()) return;
  markTiming("first_data_render", "pe:first-data-render");
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
    allowedTracingUrls: [{ match: isTracedRequest, propagatorTypes: ["tracecontext"] }],
    // the share of the sessions (all sampled by isSampled() already) whose API requests start a trace, which the backend
    // then keeps whatever its own sampling rate. Requests sent before RUM starts (the boot data) carry no trace context
    traceSampleRate: 100,
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

  // RUM starts late, thus its first view still begins at the navigation start:
  // the timings recorded so far belong to it
  rum = datadogRum;
  for (const [name, time] of Object.entries(timings)) rum.addTiming(name, time);
}

export function startRum() {
  if (!applicationId || !clientToken || !isSampled()) return;
  const run = () => {
    start().catch((err) => console.warn("RUM: failed to start", err));
  };
  // once the page has loaded or the boot data has arrived, whichever comes first: on slow devices
  // the load event can come long after the data, and sessions that end before RUM starts are lost
  let started = false;
  beginStart = () => {
    if (started) return;
    started = true;
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 2000 });
    else setTimeout(run, 0);
  };
  if (document.readyState === "complete" || "bootstrap_data_ready" in timings) beginStart();
  else window.addEventListener("load", beginStart, { once: true });
}
