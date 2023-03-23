import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enMessages from '@/locales/en_US.json'
import enSeabornMessages from '@/locales/en_US_x_seaborn.json'
import zhMessages from '@/locales/zh_CN.json'
import zhSeabornMessages from '@/locales/zh_CN_x_seaborn.json'
import jaMessages from '@/locales/ja_JP.json'
import jaSeabornMessages from '@/locales/ja_JP_x_seaborn.json'
import koMessages from '@/locales/ko_KR.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  messages: {
    en: enMessages,
    en_US_x_seaborn: enSeabornMessages,
    zh: zhMessages,
    zh_CN_x_seaborn: zhSeabornMessages,
    ja: jaMessages,
    ja_JP_x_seaborn: jaSeabornMessages,
    ko: koMessages
  }
})

export default i18n
