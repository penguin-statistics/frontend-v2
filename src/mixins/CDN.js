import config from "@/config"
import Mirror from "@/mixins/Mirror";

export default {
  mixins: [Mirror],
  methods: {
    cdnResource (path) {
      if (this.isCNMirror) {
        return config.cdn.cn + path
      } else {
        return config.cdn.global + path
      }
    }
  },
}