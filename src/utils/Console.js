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
  static error (...content) {
    this._render("error", ...content)
  }
  static log (...content) {
    this._render("log", ...content)
  }

  /**
   * @static
   * @private
   */
  static _render (level, ...content) {
    const PROD_IGNORE = ["debug", "info"]
    if (process.env.NODE_ENV === "production" && !(level in PROD_IGNORE)) return false
    const now = new Date()
    const date = `${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`
    let prefix = [`(${date})`]
    if (!(level in console)) prefix.push(`[${level}]`)

    if (console[level]) {
      console[level](...prefix, ...content)
    } else {
      console.log(...prefix, ...content)
    }
  }
}

export default Console