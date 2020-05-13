import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

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
  theme: {
    themes: {
      light: {
        accent1: colors.indigo.darken4,
        accent2: colors.orange.darken4,
        accent3: colors.blue.darken4,

        background: "#fff",
        text: "#0e0e0e"
      },
      dark: {
        accent1: colors.indigo.lighten4,
        accent2: colors.orange.lighten4,
        accent3: colors.blue.lighten4,

        background: colors.blueGrey.darken4,
        text: "#f0f0f0"
      },
    },
  },
});