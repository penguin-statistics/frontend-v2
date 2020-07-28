import config from "@/config"
import mirror from "@/utils/mirror";

export default {
  methods: {
    cdnDeliver (path) {
      if (mirror.global.isCurrent()) {
        return config.cdn.global + path
      } else {
        return config.cdn.cn + path
      }
    }
  },
}