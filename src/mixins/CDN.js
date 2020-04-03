import config from "@/config"

export default {
  methods: {
    cdnResource (path) {
      return config.cdn.global + path
    }
  },
}