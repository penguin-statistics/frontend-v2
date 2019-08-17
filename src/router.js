import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Report from './views/Report'

import StatsLayout from './layouts/StatsLayout'
import StatsByStage from './views/Stats/Stage'
import StatsByItem from './views/Stats/Item'

import AboutLayout from './layouts/AboutLayout'

import AboutMembers from './views/About/Members'
import AboutContribute from './views/About/Contribute'
import AboutChangelog from './views/About/Changelog'
import AboutContact from './views/About/Contact'
import AboutDonate from './views/About/Donate'
import AboutLinks from './views/About/Links'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
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
      },
      children: [{
          path: 'zone',
          name: 'ReportByZone',
          component: Report,
          props: true,
          meta: {
            icon: 'mdi-cube',
            i18n: 'menu.report'
          },
        },
        {
          path: 'zone/:zoneId',
          name: 'ReportByZone_SelectedZone',
          component: Report,
          props: true,
          meta: {
            hide: true,
            i18n: 'menu.report'
          },
        },
        {
          path: 'zone/:zoneId/:stageId',
          name: 'ReportByZone_SelectedStage',
          component: Report,
          props: true,
          meta: {
            hide: true,
            i18n: 'menu.report'
          },
        }
      ]
    },
    {
      path: '/result',
      name: 'Stats',
      component: StatsLayout,
      meta: {
        icon: 'mdi-chart-pie',
        i18n: 'menu.stats._name'
      },
      children: [{
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
      beforeEnter() {
        window.location.replace("https://planner.penguin-stats.io")
      },
      meta: {
        icon: 'mdi-floor-plan',
        i18n: 'menu.planner',
        externalRedirect: true
      }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutLayout,
      meta: {
        icon: 'mdi-account-group',
        i18n: 'menu.about._name'
      },
      children: [{
          path: 'members',
          name: 'AboutMembers',
          component: AboutMembers,
          props: true,
          meta: {
            icon: 'mdi-account-multiple',
            i18n: 'menu.about.members'
          },
        },
        {
          path: 'contribute',
          name: 'AboutContribute',
          component: AboutContribute,
          props: true,
          meta: {
            icon: 'mdi-hammer',
            i18n: 'menu.about.contribute'
          },
        },
        {
          path: 'changelog',
          name: 'AboutChangelog',
          component: AboutChangelog,
          props: true,
          meta: {
            icon: 'mdi-timeline',
            i18n: 'menu.about.changelog'
          },
        },
        {
          path: 'contact',
          name: 'AboutContact',
          component: AboutContact,
          props: true,
          meta: {
            icon: 'mdi-account-card-details',
            i18n: 'menu.about.contact'
          },
        },
        {
          path: 'donate',
          name: 'AboutDonate',
          component: AboutDonate,
          props: true,
          meta: {
            icon: 'mdi-gift',
            i18n: 'menu.about.donate'
          },
        },
        {
          path: 'links',
          name: 'AboutLinks',
          component: AboutLinks,
          props: true,
          meta: {
            icon: 'mdi-link-variant',
            i18n: 'menu.about.links'
          },
        },
      ]
    }
  ]
})