import mirror from "@/utils/mirror";

export default {
  computed: {
    isCNMirror () {
      return mirror.cn.isCurrent()
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
    },
    currentMirrorHostname () {
      return mirror.cn.isCurrent() ? mirror.cn.identifier : mirror.global.identifier
    }
  },
}