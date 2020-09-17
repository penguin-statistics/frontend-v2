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
  get production () {return process.env.NODE_ENV === 'production'},
  get isTouchScreen () {
    if (window.matchMedia) return window.matchMedia("(pointer: coarse)").matches
    return "ontouchstart" in window || window.navigator.maxTouchPoints > 0
  },
  get canHover() {
    if (window.matchMedia) return window.matchMedia("(any-hover)").matches
    return !this.isTouchScreen
  },
  get isWindows () {return navigator.platform.indexOf('Win') > -1},
  debug: {
    get performance() {return boolean("performance")},
    get devtools() {return boolean("devtools")},
    get colorfulConsole() {return boolean("colorfulConsole")},
    get fullConsole() {return boolean("fullConsole")},
  }
}