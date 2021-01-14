import probe from "@/utils/probe";

console.log('imported ')

export default {
  watch: {
    $route (newValue) {
      probe.reportNavigated(newValue.path)
    }
  }
}
