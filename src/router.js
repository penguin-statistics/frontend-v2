import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home'
import ReportLayout from './layouts/ReportLayout'
import Report from './views/Report/Report'
import StatsLayout from './layouts/StatsLayout'
import StatsByStage from './views/Stats/Stage'
import StatsByItem from './views/Stats/Item'

import AboutLayout from './layouts/AboutLayout'
import AboutContribute from './views/About/Contribute'
import AboutContact from './views/About/Contact'
import AboutDonate from './views/About/Donate'
import AboutLinks from './views/About/Links'

import NotFound from '@/views/NotFound'
import SiteStats from '@/views/SiteStats'
import Planner from '@/views/Planner'
import Search from '@/views/Search'
import store from '@/store'
import helmet from "@/utils/helmet";
import i18n from '@/i18n'
import strings from '@/utils/strings'
import supports from '@/models/supports'
import {activeLocale, changePageIndexable} from '@/mixins/I18n'

// import DataDebugger from "@/components/debug/DataDebugger";

// this is to fix error named something like DuplicatedRoute
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const routerChildrenNull = {
  path: '',
  name: 'RouterChildrenNull',
  meta: {
    icon: 'mdi-close',
    i18n: 'meta.notfound',
    hide: true
  },
  beforeEnter(to, from, next) {
    return next({
      name: "Home",
      replace: true
    })
  }
}

// the stats routes carry the UI language and the game server in their path, e.g. /en/result/us/stage.
// values other than these do not match, thus fall through to ErrorNotFound
const statsLanguages = ['zh', 'en', 'ja', 'ko']

// the stats route params of the current UI language and server
export function statsRouteParams() {
  const language = strings.mapLocale(activeLocale()).split('-')[0]
  return {
    lang: statsLanguages.includes(language) ? language : i18n.fallbackLocale,
    server: store.getters['dataSource/server'].toLowerCase()
  }
}

// the stats routes before the language and the server were in their path. external sites
// (widgets, bots, bookmarks) link to them, so keep redirecting them to the current ones
function legacyStatsRoute(path, name) {
  return {
    path,
    meta: {
      hide: true
    },
    redirect: to => ({
      name,
      params: {...to.params, ...statsRouteParams()}
    })
  }
}

Vue.use(Router)
const router = new Router({
  mode: 'history',
  scrollBehavior() { // params: (to, from, savedPosition)
    return {x: 0, y: 0}
  },
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'mdi-home',
      creature: 0,
      i18n: 'menu.home'
    }
  },
    {
      path: '/report',
      name: 'Report',
      component: ReportLayout,
      meta: {
        icon: 'mdi-upload',
        creature: 1,
        i18n: 'menu.report._name',
        active: true,
        // the upload forms are of no use as a search result. noindex applies to the child routes as well
        noindex: true
      },
      children: [
        {
          path: '',
          name: 'RouterChildrenNull',
          meta: {
            icon: 'mdi-close',
            i18n: 'meta.notfound',
            hide: true
          },
          beforeEnter(to, from, next) {
            return next({
              name: "ReportByZone",
              replace: true
            })
          }
        },
        {
          path: 'stage',
          name: 'ReportByZone',
          component: Report,
          meta: {
            icon: 'mdi-cursor-default-click',
            creature: 2,
            i18n: 'menu.report.stage'
          },
          children: [
            {
              path: ':zoneId/:stageId',
              name: 'ReportByZone_Selected',
              component: Report,
              props: true,
              meta: {
                i18n: 'menu.report.stage'
              }
            }
          ]
        },
        {
          path: 'recognition',
          name: 'RecognitionReport',
          component: () => import(/* webpackChunkName: "recognition" */ './views/Report/RecognitionReport'),
          meta: {
            async: true,
            icon: 'mdi-image-filter-center-focus',
            creature: 3,
            i18n: 'menu.report.recognition',
            // beta: true
          }
        },
        {
          path: ':zoneId/:stageId',
          name: 'ReportByZoneLegacy',
          meta: {
            hide: true,
            icon: 'mdi-cursor-default-click',
            i18n: 'menu.report.stage'
          },
          beforeEnter(to, from, next) {
            if (to.params.zoneId && to.params.stageId) {
              return next({
                name: "ReportByZone_Selected",
                params: to.params,
                replace: true
              })
            } else {
              return next({
                name: "ReportByZone",
                replace: true
              })
            }
          }
        },
      ]
    },
    {
      path: `/:lang(${statsLanguages.join('|')})/result/:server(${supports.servers.join('|').toLowerCase()})`,
      name: 'Stats',
      component: StatsLayout,
      meta: {
        icon: 'mdi-chart-pie',
        creature: 4,
        i18n: 'menu.stats._name',
        active: true
      },
      children: [
        routerChildrenNull,
        {
          path: 'stage',
          name: 'StatsByStage',
          component: StatsByStage,
          meta: {
            icon: 'mdi-cube',
            creature: 5,
            i18n: 'menu.stats.stage'
          }
        },
        {
          path: 'stage/:zoneId/:stageId',
          name: 'StatsByStage_Selected',
          component: StatsByStage,
          meta: {
            hide: true,
            i18n: 'menu.stats.stage'
          }
        },
        {
          path: 'item',
          name: 'StatsByItem',
          component: StatsByItem,
          meta: {
            icon: 'mdi-treasure-chest',
            creature: 6,
            i18n: 'menu.stats.item'
          }
        },
        {
          path: 'item/:itemId',
          name: 'StatsByItem_SelectedItem',
          component: StatsByItem,
          meta: {
            hide: true,
            i18n: 'menu.stats.item'
          }
        }
      ]
    },
    {
      // same as the empty child of the stats route
      path: '/result',
      meta: {
        hide: true
      },
      redirect: {
        name: 'Home'
      }
    },
    legacyStatsRoute('/result/stage', 'StatsByStage'),
    legacyStatsRoute('/result/stage/:zoneId/:stageId', 'StatsByStage_Selected'),
    legacyStatsRoute('/result/item', 'StatsByItem'),
    legacyStatsRoute('/result/item/:itemId', 'StatsByItem_SelectedItem'),
    {
      path: '/planner',
      name: 'Planner',
      component: Planner,
      meta: {
        icon: 'mdi-directions-fork',
        creature: 7,
        i18n: 'menu.planner',
        twoLine: 'menu.overline.planner'
      }
    },
    {
      path: '/advanced',
      name: 'AdvancedQuery',
      component: () => import(/* webpackChunkName: "advancedQuery" */ './views/AdvancedQuery'),
      props: route => ({stage: route.query.stage, items: route.query.items}),
      meta: {
        async: true,
        icon: 'mdi-database-search',
        creature: 8,
        i18n: 'menu.stats.advanced',
        // query results, which the stats pages already have
        noindex: true
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      props: route => ({query: route.query.q}),
      meta: {
        icon: 'mdi-magnify',
        creature: 9,
        i18n: 'menu.search',
        hide: true,
        noindex: true
      }
    },
    {
      path: '/statistics',
      name: 'SiteStats',
      component: SiteStats,
      meta: {
        icon: 'mdi-poll-box',
        creature: 10,
        i18n: 'menu.siteStats'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutLayout,
      meta: {
        icon: 'mdi-account-group',
        creature: 11,
        i18n: 'menu.about._name',
        active: true
      },
      children: [
        routerChildrenNull,
        {
          path: 'members',
          name: 'AboutMembers',
          component: () => import(/* webpackChunkName: "about" */ './views/About/Members'),
          props: true,
          meta: {
            async: true,
            icon: 'mdi-account-multiple',
            creature: 12,
            i18n: 'menu.about.members'
          }
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
          }
        },
        {
          path: 'changelog',
          name: 'AboutChangelog',
          component: () => import(/* webpackChunkName: "about" */ './views/About/Changelog'),
          props: true,
          meta: {
            async: true,
            icon: 'mdi-timeline',
            creature: 13,
            i18n: 'menu.about.changelog'
          }
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
          }
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
          }
        },
        {
          path: 'links',
          name: 'AboutLinks',
          component: AboutLinks,
          props: true,
          meta: {
            icon: 'mdi-link-variant',
            creature: 14,
            i18n: 'menu.about.links'
          }
        },
        {
          path: 'credits',
          name: 'AboutCredits',
          component: () => import(/* webpackChunkName: "about" */ './views/About/Credits'),
          props: true,
          meta: {
            async: true,
            icon: 'mdi-license',
            creature: 15,
            i18n: 'menu.about.credits'
          }
        }
      ]
    },
    {
      path: '*',
      name: 'ErrorNotFound',
      component: NotFound,
      meta: {
        i18n: 'meta.notfound',
        hide: true,
        // the server answers 200 for any path: keep these out of the index (a "soft 404")
        noindex: true
      }
    }
  ]
})

// named locations of the stats routes (router-link to, $router.push) may leave out the language
// and the server: fill them in from the current state. this covers both resolving and navigating
const statsRouteNames = router.options.routes.find(el => el.name === 'Stats').children.map(el => el.name)
const match = router.match
router.match = function (raw, current, redirectedFrom) {
  if (raw && statsRouteNames.includes(raw.name)) {
    raw = {...raw, params: {...statsRouteParams(), ...raw.params}}
  }
  return match.call(this, raw, current, redirectedFrom)
}

router.beforeEach((to, from, next) => {
  // If this isn't an initial page load and is an async route
  if (to.meta.async && to.name) store.commit('ui/setLoadingRoute', true)
  return next()
})

// the path of the route as its route record spells it. paths match regardless of case and to.path keeps the case of
// the URL, so /PLANNER would otherwise be canonical for itself. the language and server of a stats route are lower
// case in the URLs the server renders; item and stage ids keep theirs
function canonicalPath(to) {
  if (!to.name) return to.path
  const params = {...to.params}
  if (params.lang) params.lang = params.lang.toLowerCase()
  if (params.server) params.server = params.server.toLowerCase()
  return router.resolve({name: to.name, params}).route.path
}

router.afterEach((to) => {
  helmet.update(to, canonicalPath(to))
  changePageIndexable(to)
  store.commit('ui/setLoadingRoute', false)
})

export default router
