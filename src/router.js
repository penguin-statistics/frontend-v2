import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Report from './views/Report'
import Stats from './views/Stats'
import ChangeLog from './views/ChangeLog'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        icon: 'mdi-home',
        i18n: 'menu.home'
      }
    },
    {
      path: '/report',
      name: 'Report',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      component: Report,
      meta: {
        icon: 'mdi-upload',
        i18n: 'menu.report'
      }
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats,
      meta: {
        icon: 'mdi-chart-pie',
        i18n: 'menu.stats'
      }
    },
    {
      path: '/planner',
      name: 'Planner',
      beforeEnter () {
        window.location = "https://planner.penguin-stats.io"
      },
      meta: {
        icon: 'mdi-floor-plan',
        i18n: 'menu.planner',
        externalRedirect: true
      }
    },
    {
      path: '/changelog',
      name: 'ChangeLog',
      component: ChangeLog,
      meta: {
        icon: 'mdi-clipboard-text',
        i18n: 'menu.changelog'
      }
    }
  ]
})
