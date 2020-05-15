export default {
  existence (object) {
    const ext = object["existence"]
    if (ext) {
      const now = Date.now();
      if (ext["openTime"]) {
        if (!(ext["openTime"] > now)) return false
      }
      if (ext["closeTime"]) {
        if (!(ext["closeTime"] < now)) return false
      }
    }
    return true
  }
}