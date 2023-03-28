import CDN from '@/mixins/CDN'
import mirror from "@/utils/mirror";
import ThemeStyle from "@/mixins/ThemeStyle";
import randomUtils from "@/utils/randomUtils";
import Console from "@/utils/Console";

function normalImageUrl (character) {
  return mirror.deliver(`/logos/penguin_stats_logo_${character}.png`)
}

function seabornImageUrl (realm, index) {
  return mirror.deliver(`/logos/seaborn/cropped/${realm}/${index}.png`)
}

export default {
  data () {
    return {
      randomizedLogo: mirror.deliver(`/logos/penguin_stats_logo.png`),
      shownFirst: false
    }
  },
  mixins: [CDN, ThemeStyle],
  watch: {
    $route: {
      handler () {
        this.randomizeLogo()
      }
    },
    randomizedLogoListeningThemeStyle: {
      handler () {
        this.randomizeLogo()
      },
      immediate: true
    }
  },
  methods: {
    randomizeLogo () {
      Console.info('RandomizedLogo', 'randomizing logo')
      if (!this.shownFirst) {
        this.shownFirst = true
        this.randomizedLogo = this.currentLogoSrc
        return
      }
      this.randomizedLogo = (() => {
        if (this.$store.state.ui.activeThemeStyle === 'seaborn') {
          return seabornImageUrl(this.currentLogoName, randomUtils.randomFromArray([
            0, 1, 2, 3
          ]))
        } else {
          return randomUtils.randomFromArray([
            normalImageUrl('exia'),
            normalImageUrl('texas'),
            normalImageUrl('sora'),
            normalImageUrl('croissant')
          ])
        }
      })()
    }
  },
  computed: {
    randomizedLogoListeningThemeStyle() {
      return this.$store.state.ui.activeThemeStyle
    }
  }
}
