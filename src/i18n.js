import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enMessages from '@/locales/en'
import zhMessages from '@/locales/zh'
import jaMessages from '@/locales/ja'
import koMessages from '@/locales/ko'

Vue.use(VueI18n)

export default new VueI18n({
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
