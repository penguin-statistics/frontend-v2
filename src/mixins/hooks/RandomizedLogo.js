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
      const base = `/images/themes/2021-april-fools/${this.aprilFools ? 'past' : 'current'}`
      let candidates = ['crownslayer', 'faustus', 'frostnova', 'mephisto', 'patriot', 'skullshatterer', 'talulah']

      const imageUrl = character => {
        return this.cdnDeliver(base + `/logo_${character}.png`)
      }

      const rand = items => items[items.length * Math.random() | 0];

      if (this.aprilFools) {
        candidates = ['alina', 'faustus', 'frostnova', 'mephisto']
      }

      this.randomizedLogo = imageUrl(rand(candidates))
    }
  },
  computed: {
    ...mapGetters('ui', ['aprilFools'])
  },
}
