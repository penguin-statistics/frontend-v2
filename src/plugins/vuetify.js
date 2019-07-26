import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify, { VLayout } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  components: {
    VLayout
  }
})
