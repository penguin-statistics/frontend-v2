import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Report from './views/Report'
import StatsByStage from './views/Stats/Stage'
import StatsByItem from './views/Stats/Item'
import StatsLayout from './layouts/StatsLayout'
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
      path: '/results',
      name: 'Stats',
      component: StatsLayout,
      meta: {
        icon: 'mdi-chart-pie',
        i18n: 'menu.stats._name'
      },
      children: [
        {
          path: 'stage',
          name: 'StatsByStage',
          component: StatsByStage,
          props: true,
          meta: {
            icon: 'mdi-cube',
            i18n: 'menu.stats.stage'
          },
        },
        {
          path: 'stage/:zoneId',
          name: 'StatsByStage_SelectedZone',
          component: StatsByStage,
          props: true,
          meta: {
            hide: true,
            i18n: 'menu.stats.stage'
          },
        },
        {
          path: 'stage/:zoneId/:stageId',
          name: 'StatsByStage_SelectedBoth',
          component: StatsByStage,
          props: true,
          meta: {
            hide: true,
            i18n: 'menu.stats.stage'
          },
        },
        {
          path: 'item',
          name: 'StatsByItem',
          component: StatsByItem,
          props: true,
          meta: {
            icon: 'mdi-treasure-chest',
            i18n: 'menu.stats.item'
          },
        },
        {
          path: 'item/:itemId',
          name: 'StatsByItem_SelectedItem',
          component: StatsByItem,
          props: true,
          meta: {
            hide: true,
            i18n: 'menu.stats.item'
          },
        }
      ]
    },
    {
      path: '/planner',
      name: 'Planner',
      beforeEnter () {
        window.location.replace("https://planner.penguin-stats.io")
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
