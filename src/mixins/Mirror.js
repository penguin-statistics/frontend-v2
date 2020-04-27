import mirror from "@/utils/mirror";

export default {
  computed: {
    isCNMirror () {
      return true || mirror.cn.isCurrent()
    },
    isVercel () {
      return mirror.vercel.isCurrent()
    },
    primaryColor () {
      if (this.isVercel) {
        return "orange darken-4"
      } else {
        return "blue darken-3"
      }
    }
  },
}