import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enMessages from '@/locales/en_US.json'
import zhMessages from '@/locales/zh_CN.json'
import zhSeabornMessages from '@/locales/zh_CN_x_seaborn.json'
import jaMessages from '@/locales/ja_JP.json'
import koMessages from '@/locales/ko_KR.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  messages: {
    en: enMessages,
    zh: zhMessages,
    zh_CN_x_seaborn: zhSeabornMessages,
    ja: jaMessages,
    ko: koMessages
  }
})

export default i18n
