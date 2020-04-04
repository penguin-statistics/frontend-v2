import * as Sentry from "@sentry/browser";

function reportSentry(severity, component, contents) {
  Sentry.withScope(scope => {
    scope.setFingerprint([component]);
    Sentry.captureMessage(contents.join(" "), severity)
  })
}

class Console {
  static debug (component, ...content) {
    this._render("debug", ...content)
  }
  static info (component, ...content) {
    this._render("info", ...content)
  }
  static warn (component, ...content) {
    this._render("warn", ...content);
    reportSentry("warning", component, content)
  }
  static error (component, ...content) {
    this._render("error", ...content);
    reportSentry("error", component, content)
  }
  static fatal (component, ...content) {
    this._render("error", ...content);
    reportSentry("fatal", component, content)
  }
  static log (component, ...content) {
    this._render("log", ...content)
  }
  /**
   * @static
   * @private
   */
  static _render (level, ...content) {
    const PROD_IGNORE = ["debug"];
    if (process.env.NODE_ENV === "production" && (PROD_IGNORE.includes(level))) return;
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