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
import NotFound from "@/views/NotFound";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() { // params: (to, from, savedPosition)
    return { x: 0, y: 0 }
  },
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
    name: 'ReportByZone',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    component: Report,
    meta: {
      icon: 'mdi-upload',
      i18n: 'menu.report',
      forceSingle: true
    },
    children: [
      {
        path: ':zoneId/:stageId',
        name: 'ReportByZone_Selected',
        component: Report,
        props: true,
        meta: {
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
      i18n: 'menu.stats._name',
      active: true
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
      path: 'stage/:zoneId/:stageId',
      name: 'StatsByStage_Selected',
      component: StatsByStage,
      props: true,
      meta: {
        hide: true,
        i18n: 'menu.stats.stage'
      }
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
    path: '/_redirect/planner',
    name: 'Planner',
    meta: {
      ga: {
        category: 'redirect',
        action: 'links',
        label: 'ArkPlanner',
        value: 1
      },
      link: "https://planner.penguin-stats.io",
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
        i18n: 'menu.about.contribute',
        hide: true
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
        i18n: 'menu.about.contact',
        hide: true
      },
    },
    {
      path: 'donate',
      name: 'AboutDonate',
      component: AboutDonate,
      props: true,
      meta: {
        icon: 'mdi-gift',
        i18n: 'menu.about.donate',
        hide: true
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
  },
  {
    path: '/_redirect/v1',
    name: 'OldVersion',
    meta: {
      ga: {
        category: 'redirect',
        action: 'links',
        label: 'OldVersion',
        value: 1
      },
      link: "https://v1.penguin-stats.io",
      icon: 'mdi-penguin',
      i18n: 'menu.v1',
      externalRedirect: true
    }
  },
  {
    path: '*',
    name: 'ErrorNotFound',
    component: NotFound,
    meta: {
      i18n: 'meta.notfound',
      hide: true
    }
  },
  ]
});

export default router
