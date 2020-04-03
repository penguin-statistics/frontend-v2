import extractDomain from 'extract-domain';

export default {
  computed: {
    isCNMirror () {
      return extractDomain(window.location.href) === "penguin-stats.cn"
    },
    isZeitNow () {
      return extractDomain(window.location.href) === "now.sh"
    },
    primaryColor () {
      if (this.isZeitNow) {
        return "orange darken-4"
      } else {
        return "blue darken-3"
      }
    }
  },
}