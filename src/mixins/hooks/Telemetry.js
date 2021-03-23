import * as Sentry from '@sentry/browser'
import store from '@/store'
import i18n from '@/i18n'
import config from '@/config'
import Console from '@/utils/Console'

class SessionData {
  constructor () {
    this.data = {
      LoggedIn: store.getters['auth/loggedIn'],
      Username: store.getters['auth/username'] || '(null)',
      LanguageActive: i18n.locale || '(null)',
      LanguagePersisted: store.getters['settings/language'] || '(null)',
      Theme: store.getters['settings/dark'],
      OptimizeLowData: store.getters['settings/lowData']
    }
  }

  get normal () {
    return this.data
  }

  get crisp () {
    return [[
      ...Object.entries(this.data),
      ['Version', config.version]
    ]]
  }
}

export default {
  created () {
    this.updateTelemetryData()
  },
  watch: {
    watchDataCollection () {
      this.updateTelemetryData()
    }
  },
  methods: {
    updateTelemetryData () {
      const sessionData = new SessionData()
      Console.info('Telemetry', 'updating telemetry data')

      // set crisp session data
      window.$crisp.push(['set', 'session:data', sessionData.crisp])
      window.$crisp.push(['safe', true])

      // set sentry tags
      Sentry.configureScope(scope => scope.setTags(sessionData.normal))
    }
  },
  computed: {
    watchDataCollection () {
      return {
        LoggedIn: store.getters['auth/loggedIn'],
        Username: store.getters['auth/username'] || '(null)',
        LanguageActive: i18n.locale || '(null)',
        LanguagePersisted: store.getters['settings/language'] || '(null)',
        Theme: store.getters['settings/dark'],
        OptimizeLowData: store.getters['settings/lowData']
      }
    }
  }
}
