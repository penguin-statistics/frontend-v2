import store from '@/store'

export default {
  existence (object, parseTime = false, server = store.getters['dataSource/server']) {
    let ext = object.existence
    if (ext && ext[server]) {
      ext = ext[server]
      if (parseTime) {
        const now = Date.now()
        // Console.debug("Existence", "justifying data", object, ext, ext["openTime"] && ext["openTime"] > now, ext["closeTime"] && ext["closeTime"] < now)
        if (ext.openTime && ext.openTime > now) return false
        if (ext.closeTime && ext.closeTime < now) return false
      }

      return ext.exist
    } else {
      // partially parsed data
      return true
    }
  }
}
