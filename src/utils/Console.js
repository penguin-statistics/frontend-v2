import * as Sentry from "@sentry/browser";

class Console {
  static debug (...content) {
    this._render("debug", ...content)
  }
  static info (...content) {
    this._render("info", ...content)
  }
  static warn (...content) {
    this._render("warn", ...content)
  }
  static error (component, ...content) {
    const contents = [`[${component}]`, ...content];
    this._render("error", ...contents);
    Sentry.withScope(scope => {
      scope.setFingerprint([component]);
      Sentry.captureMessage(contents.join(" "), "error")
    })
  }
  static log (...content) {
    this._render("log", ...content)
  }
  /**
   * @static
   * @private
   */
  static _render (level, ...content) {
    const PROD_IGNORE = ["debug"];
    if (process.env.NODE_ENV === "production" && !(level in PROD_IGNORE)) return;
    const now = new Date();
    const date = `${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    let prefix = `(${date})`;

    if (console[level]) {
      console[level](prefix, ...content)
    } else {
      console.log(prefix, ...content)
    }
  }
}

export default Console