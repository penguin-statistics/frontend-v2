import CDN from "@/mixins/CDN";
import config from "@/config"

export default {
  data() {
    return {
      randomizedLogo: `${config.cdn.cn}/logos/penguin_stats_logo.png`
    }
  },
  mixins: [CDN],
  watch: {
    '$route': [
      'randomizeLogo',
    ]
  },
  methods: {
    randomizeLogo () {
      const random = Math.random();
      const self = this;
      function imageUrl (character) {
        return self.cdnDeliver(`/logos/penguin_stats_logo_${character}.png`)
      }
      this.randomizedLogo = random < .25 ? imageUrl("exia")
        : random < .5 ? imageUrl("texas")
          : random < .75 ? imageUrl("sora")
            : imageUrl("croissant")
    },
  },
}