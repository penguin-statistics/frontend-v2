const debugKey = "PENGUIN_STATS_DEBUG";

function getConfig() {
  return window && window[debugKey] || {}
}

function boolean(key) {
  // development: force true
  // otherwise if specifically specified, use that value
  // otherwise fallback to false
  return process.env.NODE_ENV !== "production" || getConfig()[key] || false
}

export default {
  get performance() {return boolean("performance")},
  get devtools() {return boolean("devtools")},
  get colorfulConsole() {return boolean("colorfulConsole")},
  get fullConsole() {return boolean("fullConsole")},
  get disableSentry() {return boolean("disableSentry")}
}