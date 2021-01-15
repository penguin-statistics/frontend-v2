export default {
  watch: {
    $route (newValue) {
      this.$probe.reportNavigated(newValue.path)
    }
  }
}
