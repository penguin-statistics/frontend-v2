import '@mdi/font/css/materialdesignicons.min.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

import zhHans from 'vuetify/es5/locale/zh-Hans'
import ja from 'vuetify/es5/locale/ja'
import ko from 'vuetify/es5/locale/ko'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    locales: { zh: zhHans, ja, ko, en }
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        // primary: '#C03443',
        accent1: colors.indigo.darken4,
        accent2: colors.orange.darken4,
        accent3: colors.blue.darken4,

        background: '#fff',
        lightenedBackground: '#d9d9d9',
        indigoBackground: '#fff',
        text: '#0e0e0e',
        textDarken: colors.grey.darken4
      },
      dark: {
        // primary: '#C03443',
        accent1: colors.indigo.lighten3,
        accent2: colors.orange.lighten3,
        accent3: colors.blue.lighten3,

        background: colors.blueGrey.darken4,
        lightenedBackground: colors.blueGrey.darken3,
        indigoBackground: '#191d37',
        text: '#f0f0f0',
        textDarken: colors.grey.lighten3
      }
    }
  }
})
