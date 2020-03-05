import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import zhHans from 'vuetify/es5/locale/zh-Hans'
import ja from 'vuetify/es5/locale/ja'
import ko from 'vuetify/es5/locale/ko'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  lang: {
    locales: { zh: zhHans, ja, ko, en }
  },
});