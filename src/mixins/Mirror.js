import extractDomain from 'extract-domain';

export default {
  methods: {
    isCNMirror() {
      return extractDomain(window.location.href) === "penguin-stats.cn"
    }
  },
}