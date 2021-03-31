import CDN from '@/mixins/CDN'
import config from '@/config'
import {mapGetters} from "vuex";

export default {
  data () {
    return {
      randomizedLogo: `${config.cdn.cn}/logos/penguin_stats_logo.png`
    }
  },
  mixins: [CDN],
  watch: {
    $route: [
      'randomizeLogo'
    ],
    aprilFools: [
      'randomizeLogo'
    ]
  },
  methods: {
    randomizeLogo () {
      let base = '/logos'
      let candidates = ['exia', 'texas', 'sora', 'croissant']

      const imageUrl = character => {
        return this.cdnDeliver(base + `/penguin_stats_logo_${character}.png`)
      }

      const rand = items => items[items.length * Math.random() | 0];

      if (this.aprilFools) {
        base = '/logos/20210401'
        candidates = ['exia', 'texas', 'sora', 'croissant']
      }

      this.randomizedLogo = imageUrl(rand(candidates))
    }
  },
  computed: {
    ...mapGetters('ui', ['aprilFools'])
  },
}
