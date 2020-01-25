import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key)
    }
  });
  return messages
}

export default new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  // dateTimeFormats: {
  //   'en': {
  //     short: {
  //       month: 'short', day: 'numeric',
  //       weekday: 'short', hour: 'numeric', minute: 'numeric'
  //     },
  //     long: {
  //       year: 'numeric', month: 'short', day: 'numeric',
  //       hour: 'numeric', minute: 'numeric'
  //     }
  //   },
  //   'zh': {
  //     short: {
  //       month: 'short', day: 'numeric',
  //       weekday: 'short', hour: 'numeric', minute: 'numeric'
  //     },
  //     long: {
  //       year: 'numeric', month: 'short', day: 'numeric',
  //       hour: 'numeric', minute: 'numeric'
  //     }
  //   },
  //   'ja': {
  //     short: {
  //       month: 'short', day: 'numeric',
  //       weekday: 'short', hour: 'numeric', minute: 'numeric'
  //     },
  //     long: {
  //       year: 'numeric', month: 'short', day: 'numeric',
  //       hour: 'numeric', minute: 'numeric'
  //     }
  //   }
  // },
  messages: loadLocaleMessages()
})
