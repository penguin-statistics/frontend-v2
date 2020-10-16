import store from "../store";

function getDefaultIcon (type) {
  const MAP = {
    "success": "mdi-check-circle",
    "error": "mdi-close-circle",
  };
  return MAP[type]
}

export default {
  launch (type, timeout, text, extra, icon) {
    return store.commit("ui/setSnackbar", {
      color: type,
      timeout,
      text,
      extra,
      icon: icon || getDefaultIcon(type) || "mdi-alert-circle"
    })
  },
  networkError () {
    this.launch("error", 0, "network.error")
  }
}