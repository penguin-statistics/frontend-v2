import config from "@/config"
import mirror from "@/utils/mirror";

export default {
  methods: {
    cdnResource (path) {
      if (mirror.cn.isCurrent()) {
        return config.cdn.cn + path
      } else {
        return config.cdn.global + path
      }
    }
  },
}