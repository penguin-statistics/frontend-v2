import store from "../store";
import haptics from "@/utils/native/haptics";

function getDefaultIcon (type) {
  const MAP = {
    "success": "mdi-check-circle",
    "error": "mdi-close-circle",
  };
  return MAP[type]
}

export default {
  launch (type, timeout, text, extra, icon) {
    if (type === "error") haptics.error()
    if (type === "success") haptics.success()

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