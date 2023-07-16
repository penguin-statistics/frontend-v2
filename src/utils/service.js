import config from "@/config";
import i18n from "@/i18n";
import store from "@/store";
import Console from "@/utils/Console";
import mirror from "@/utils/mirror";
import axios from "axios";
import semver from "semver";
import Cookies from "js-cookie";

let baseURL;
if (mirror.global.isCurrent() || mirror.cn.isCurrent()) {
  // those are official mirrors. just use the relative path.
  baseURL = "/PenguinStats/api/v2";
} else if (import.meta.env.NODE_ENV === "development") {
  // developing at localhost.
  // also use the relative path, but we left the task to WebpackDevServer for proxying local API responses
  // so use relative path.
  baseURL = "/PenguinStats/api/v2";
} else if (PENGUIN_BUILDFROM === "docker") {
  // docker build
  // backend and frontend are on the same server
  // so use relative path.
  baseURL = "/PenguinStats/api/v2";
} else {
  // high chance of using a staging environment where api is not available with the frontend deployment.
  // use the absolute endpoint to get the juicy responses :)
  baseURL = "https://penguin-stats.io/PenguinStats/api/v2";
}

const service = axios.create({
  // baseURL: see rules above
  baseURL,
  withCredentials: true,
  timeout: 90 * 1000, // 1.5 minute
});

const deployingFlag =
  '<meta name="penguin:exception" content="type=deploying">';

function needsUpdate(response) {
  if ("x-penguin-upgrade" in response.headers) {
    // X-Penguin-Upgrade: Client version must be outdated due to
    // API *endpoint* changes or other changes that must be updated.
    return true;
  }
  if ("x-penguin-compatible" in response.headers) {
    const version = response.headers["x-penguin-compatible"]
      // replace prefix
      .replace(new RegExp("^" + config.project + "@"), "");

    const cleaned = semver.clean(version);

    if (cleaned === null) {
      // if still invalid, assume it is VALID then
      return false;
    } else {
      // cleaned successfully
      // if current one is smaller than expected, then it is INVALID
      return semver.lt(config.version, cleaned);
    }
  }
  return false;
}

service.interceptors.request.use(
  function(config) {
    if (
      ["/report", "/report/recall", "personal", "/result/advanced", "/recognition/defects/report"].some((el) =>
        config.url.includes(el)
      )
    ) {
      if (store.getters["auth/loggedIn"] && !config.headers["Authorization"])
        config.headers[
          "Authorization"
        ] = `PenguinID ${store.getters["auth/username"]}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
service.interceptors.response.use(
  function(response) {
    if (needsUpdate(response)) {
      store.commit("ui/setOutdated", true);
    }

    if ("x-penguin-set-penguinid" in response.headers) {
      const penguinId = response.headers["x-penguin-set-penguinid"];
      Console.info(
        "Account",
        "received set-penguinid header. setting active user as",
        penguinId
      );
      store.dispatch("auth/login", penguinId);

      // suppress cookie usage
      Cookies.remove("userID", {
        path: "/",
        domain: "." + window.location.hostname,
      });
    }

    return response;
  },
  function(error) {
    if (error.response) {
      if (needsUpdate(error.response)) {
        store.commit("ui/setOutdated", true);
      }

      // eliminate `user not found` errors (reports 404).
      if (error.response.status !== 404) {
        Console.error("Ajax", "failed", error.request, error.response, error);
      }

      let message;

      if (
        (error &&
          error.response &&
          error.response.data &&
          error.response.data.message &&
          typeof error.response.data.message === "string" &&
          !!~error.response.data.message.indexOf("unavailable")) ||
        (error &&
          error.response &&
          error.response.data &&
          typeof error.response.data === "string" &&
          !!~error.response.data.indexOf(deployingFlag))
      ) {
        message = i18n.t("fetch.failed.deploying");
      } else {
        message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.response.data ||
          error.message;
      }

      error.errorMessage = `(${error.response.status}) ${message}`;
      Console.info(
        "Ajax",
        "errorMessage",
        error.response.data.message,
        error.errorMessage
      );
    } else {
      error.errorMessage = `(!) ${error.message}`;
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

const externalService = axios.create({
  withCredentials: false,
});

export { service, externalService };
