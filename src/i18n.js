import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enMessages from '@/locales/en_US.json'
import zhMessages from '@/locales/zh_CN.json'
import jaMessages from '@/locales/ja_JP.json'
import koMessages from '@/locales/ko_KR.json'

import {transformMessages} from "@/utils/i18n";

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  messages: {
    en: transformMessages(enMessages),
    zh: transformMessages(zhMessages),
    ja: transformMessages(jaMessages),
    ko: transformMessages(koMessages)
  }
})

window.i18n = i18n
export default i18n
