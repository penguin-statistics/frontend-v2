import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Report from './views/Report'
import StatsByChapter from './views/StatsByChapter'
import StatsByItem from './views/StatsByItem'
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
      path: '/stats/chapter',
      name: 'StatsByChapter',
      component: StatsByChapter,
      meta: {
        icon: 'mdi-chart-pie',
        i18n: 'menu.stats.stage'
      }
    },
    {
      path: '/stats/item',
      name: 'StatsByItem',
      component: StatsByItem,
      meta: {
        icon: 'mdi-chart-pie',
        i18n: 'menu.stats.item'
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
        i18n: 'menu.planner'
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
