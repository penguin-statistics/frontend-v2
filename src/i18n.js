import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enMessages from '@/locales/en.json'
import zhMessages from '@/locales/zh.json'
import jaMessages from '@/locales/ja.json'
import koMessages from '@/locales/ko.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  messages: {
    en: enMessages,
    zh: zhMessages,
    ja: jaMessages,
    ko: koMessages
  }
})

window.i18n = i18n
export default i18n
