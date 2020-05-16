import store from "@/store"

export default {
  existence (object) {
    const ext = object["existence"]
    if (ext) {
      // const now = Date.now();
      // if (ext["openTime"]) {
      //   if (!(ext["openTime"] > now)) return false
      // }
      // if (ext["closeTime"]) {
      //   if (!(ext["closeTime"] < now)) return false
      // }
      const server = store.getters["dataSource/server"]
      if (!(server in ext)) return true
      return ext[server]["exist"]
    }
    return true
  }
}