import I18n from '@/mixins/I18n'
import strings from '@/utils/strings'
import {statsRouteParams} from '@/router'

// keeps the UI language and the server in sync with the path of the stats routes
export default {
  mixins: [I18n],
  computed: {
    statsRouteParams () {
      return statsRouteParams()
    }
  },
  watch: {
    $route (route) {
      this.syncStateFromRoute(route)
    },
    statsRouteParams: 'syncRouteFromState'
  },
  created () {
    // the initial route has been resolved and the locale applied by now. App fetches the data
    // right after this hook, so leave fetching the data of the new server to it
    this.syncStateFromRoute(this.$route, false)
  },
  methods: {
    isStatsRoute (route) {
      return route.matched.some(el => el.name === 'Stats')
    },
    syncStateFromRoute (route, fetch = true) {
      if (!this.isStatsRoute(route)) return

      const server = route.params.server.toUpperCase()
      if (server !== this.$store.getters['dataSource/server']) {
        this.$store.dispatch('dataSource/switchServer', {server, fetch})
      }

      const language = route.params.lang.toLowerCase()
      if (language !== statsRouteParams().lang) {
        // stay with the themed variant of the language, if any
        const seaborn = this.$store.state.ui.activeThemeStyle === 'seaborn'
        this.changeLocale(seaborn ? strings.seabornLocaleMappings[language] : language, true)
      }

      // the path matches case-insensitively (e.g. /ZH/result/CN/...): keep the URL canonical
      this.syncRouteFromState(statsRouteParams())
    },
    syncRouteFromState (params) {
      const route = this.$route
      if (!this.isStatsRoute(route)) return
      if (route.params.lang === params.lang && route.params.server === params.server) return

      this.$router.replace({
        name: route.name,
        params: {...route.params, ...params},
        query: route.query,
        hash: route.hash
      })
    }
  }
}
