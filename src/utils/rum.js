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

// the PenguinID is the credential of the account: elements showing it carry a data-dd-action-name,
// and the action names (taken from the text of the clicked element) and the error messages are redacted
const longNumber = /\b\d{6,}\b/g;

// the data objects the app fetches at boot (see the data/fetch action)
const bootstrapData = ["config", "items", "stages", "zones", "globalMatrix", "globalPatternMatrix", "trends", "stats"];

// the custom timings of this page load, as epoch milliseconds keyed by their RUM name
const timings = {};
let rum = null;
// whether this page load sends RUM data: RUM is configured and the session sampled (set by startRum)
let enabled = false;
// the calls waiting for RUM to start, see withRum
const queued = [];
// the app's router, to name the views after their route (see viewName)
let appRouter = null;
// the view names by view URL
const viewNames = new Map();
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

// the view name of a page URL: the path of its route without the parameter patterns, such as
// /:lang/result/:server/stage/:zoneId/:stageId, so that the pages of a route make one view in RUM whatever the
// language, the server, the stage or the item (the SDK's default names keep them apart, e.g. /zh/result/cn/stage/?/?)
function viewName(url) {
  let name = viewNames.get(url);
  if (name !== undefined) return name;
  name = null;
  try {
    const { matched } = appRouter.match(new URL(url).pathname);
    const route = matched[matched.length - 1];
    if (route && route.path === "*") name = "/(not found)";
    else if (route) name = route.path.replace(/\([^)]*\)/g, "").replace(/\/+$/, "") || "/";
  } catch (e) {
    // keep the SDK's name
  }
  if (viewNames.size >= 1000) viewNames.clear();
  viewNames.set(url, name);
  return name;
}

// runs fn with the RUM SDK now, or once RUM has started; not at all when this page load sends no RUM data
function withRum(fn) {
  if (rum) fn(rum);
  else if (enabled && queued.length < 100) queued.push(fn);
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
    beforeSend(event, context) {
      if (appRouter && event.view && event.view.url) {
        const name = viewName(event.view.url);
        if (name) event.view.name = name;
      }
      if (event.type === "action" && event.action.target && typeof event.action.target.name === "string") {
        event.action.target.name = redact(event.action.target.name);
      }
      if (event.type === "error") {
        // a failed API request reported by reportApiError already, which the app did not catch
        if (context && context.error && context.error.rumReported && event.error.source !== "custom") return false;
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
  // whether the visitor has a PenguinID, never the PenguinID itself (a credential)
  store.watch(
    (state, getters) => getters["auth/loggedIn"],
    (loggedIn) => datadogRum.setGlobalContextProperty("logged_in", loggedIn),
    { immediate: true }
  );
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
  for (const fn of queued.splice(0)) fn(rum);
}

/** starts RUM in the sampled sessions (see isSampled), naming the views after their route in router */
export function startRum(router) {
  appRouter = router || null;
  if (!applicationId || !clientToken || !isSampled()) return;
  enabled = true;
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

/**
 * reports a failed request to the API (from the response interceptor of its client) as a RUM error of type ApiError
 * named after the request, e.g. "GET /stages failed: 503", with its method, path, status and message in the context
 * (api.*), grouped by them in Error Tracking. RUM keeps API requests as resources only, and the errors the app does
 * not catch only as "Request failed with status code 503", with no request; their unhandled rejection is left out.
 * 404 is an answer of the API (no such account and the like), and cancelled requests are no failure: not reported
 */
export function reportApiError(error) {
  if (!enabled || !error || !error.config || error.__CANCEL__) return;
  const status = error.response ? error.response.status : 0;
  if (status === 404) return;
  const method = (error.config.method || "get").toUpperCase();
  const path = redact((error.config.url || "").split("?")[0]);
  const failure = status ? String(status) : error.code || "network error";
  const data = error.response && error.response.data;
  const message = data && typeof data.message === "string" ? redact(data.message.slice(0, 200)) : null;

  const apiError = new Error(`${method} ${path} failed: ${failure}`);
  apiError.name = "ApiError";
  apiError.dd_fingerprint = `api ${method} ${path} ${failure}`;
  error.rumReported = true;
  withRum((r) => r.addError(apiError, { api: { method, path, status, code: error.code || null, message } }));
}

// the context of a failed request in a flow (see startFlow)
function failureOf(error) {
  if (!error) return {};
  return { status: error.response ? error.response.status : 0, code: error.code || null };
}

/**
 * starts timing one run of a key user flow (a report submission, a recognition, a plan...), and returns the function
 * that ends it: end(outcome, context). The run is a RUM duration vital (@type:vital @vital.name:<name>, with
 * @vital.duration) with the outcome ("success", "failure"...) and the context under context.flow
 */
export function startFlow(name, context) {
  if (!enabled) return () => {};
  const startTime = Date.now();
  let ended = false;
  return (outcome, more) => {
    if (ended) return;
    ended = true;
    const flow = { outcome, ...context, ...more };
    withRum((r) => r.addDurationVital(name, { startTime, duration: Date.now() - startTime, context: { flow } }));
  };
}

/**
 * times the request as the flow name (see startFlow), and returns it: a success once it resolves (or the outcome
 * outcomeOf gives for its response), a failure with the status and error code once it fails
 */
export function timeFlow(name, request, context, outcomeOf) {
  const end = startFlow(name, context);
  request.then(
    (response) => end(outcomeOf ? outcomeOf(response) : "success"),
    (error) => end("failure", failureOf(error))
  );
  return request;
}
