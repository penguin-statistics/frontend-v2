import store from "@/store"

export default {
  existence (object, parseTime = false, server = store.getters["dataSource/server"]) {
    const ext = object["existence"]
    if (ext) {
      if (parseTime) {
        const now = Date.now();
        if (ext["openTime"] && ext["openTime"] > now) return false
        if (ext["closeTime"] && ext["closeTime"] < now) return false
      }

      if (!(server in ext)) return true
      return ext[server]["exist"]
    }
    return true
  }
}