import mirror from "@/utils/mirror";

export default {
  computed: {
    isCNMirror () {
      return mirror.cn.isCurrent()
    },
    isZeitNow () {
      return mirror.zeitNow.isCurrent()
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