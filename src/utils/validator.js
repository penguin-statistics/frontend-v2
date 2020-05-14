export default {
  exclusive (a, b) {
    if (a && !b) return true
    if (!a && b) return true
    return false
  }
}