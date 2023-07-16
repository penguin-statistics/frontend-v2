// import FakeTimers from "@sinonjs/fake-timers"
// window.FakeTimers = FakeTimers.install({
//   now: new Date("2023-04-01T23:59:50.000"),
//   shouldAdvanceTime: true,
// })
//
// setInterval(() => {
//   console.log("tick: ", new Date())
// }, 1000)

import './workers/register'
import 'regenerator-runtime/runtime'

import App from './App.vue'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import store from './store'
import router from './router'
import i18n from '@/i18n'
import '@/components/functional'
import environment from '@/utils/environment'

import './assets/fonts/roboto/roboto.css'

import './injections'
import PenguinProbe from '@/utils/probe'

if (!window.Intl) require('intl-collator')

Vue.config.productionTip = false

Vue.config.performance = environment.debug.performance
Vue.config.devtools = environment.debug.devtools

async function bootstrap () {
  Vue.prototype.$probe = new PenguinProbe()
  Vue.prototype.$env = environment

  new Vue({
    vuetify,
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}

bootstrap()
