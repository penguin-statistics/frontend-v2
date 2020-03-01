<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      width="300"
    >
      <div 
        :class="{
          'drawer-logo blue': true,
          'darken-4': appDark,
          'darken-3': !appDark,
          'drawer-logo--two-line': $t('app.name_line2') !== ''
        }"
      >
        <v-img
          :src="require('@/assets/logo.png')"
          aspect-ratio="1"
          height="192px"
          contain
        />
        <div class="white--text description">
          <v-row
            align="center"
            justify="center"
          >
            <span>{{ $t('app.name_line1') }}</span>
            <span>{{ $t('app.name_line2') }}</span>
          </v-row>
        </div>
      </div>
      <v-list
        dense
        nav
      >
        <template
          v-for="route in routes"
        >
          <v-list-item
            v-if="!route.children || route.meta.forceSingle"
            :key="route.name"
            :class="route.path === $route.path ? 'v-list-item--active' : ''"
            @click="onMenuItemClicked(route)"
          >
            <v-list-item-icon>
              <v-icon v-text="route.meta.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(route.meta.i18n) }} &nbsp; <v-icon
                  v-if="!route.component && !route.meta.forceSingle"
                  small
                >
                  mdi-open-in-new
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else
            :key="route.name"
            :value="route.meta.active"
            :prepend-icon="route.meta.icon"
            color="grey"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-title>{{ $t(route.meta.i18n) }}</v-list-item-title>
            </template>

            <v-list-item
              v-for="child in route.children.filter(el => !el.meta.hide)"
              :key="child.name"
              :class="child.path === $route.path.split('/')[2] ? 'v-list-item--active' : ''"
              @click="onMenuItemClicked(child)"
            >
              <v-list-item-title>{{ $t(child.meta.i18n) }}</v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="child.meta.icon" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </template>

        <v-divider class="my-2" />

        <v-container>
          <v-row
            justify="space-around"
          >
            <v-btn
              class="mx-1"
              text
              @click="refreshData"
            >
              <v-icon left>
                mdi-database-refresh
              </v-icon>
              {{ $t('menu.refreshData') }}
            </v-btn>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  class="mx-1"
                  v-on="on"
                  @click="appDark = !appDark"
                >
                  <v-icon>mdi-invert-colors</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('menu.invertColors') }}</span>
            </v-tooltip>

            <v-menu
              bottom
              left
              open-on-hover
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  class="mx-1"
                  v-on="on"
                >
                  <v-icon>mdi-translate</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-subheader style="height: 36px;">
                  <v-icon
                    small
                    color="grey lighten-1"
                    class="mr-1"
                  >
                    mdi-translate
                  </v-icon> {{ $t('menu.languages') }}
                </v-subheader>
                <v-list-item-group v-model="localizationMapper">
                  <v-list-item
                    v-for="(locale, i) in localizations"
                    :key="i"
                    @click="changeLocale(locale.id)"
                  >
                    <v-list-item-title>
                      {{ locale.name }}
                    </v-list-item-title>
                    <v-list-item-action v-if="locale.beta">
                      <v-icon small>
                        mdi-beta
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-action-text class="monospace">
                      {{ locale.id }}
                    </v-list-item-action-text>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-row>
        </v-container>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      color="blue darken-3"
      style="min-height: calc(56px + env(safe-area-inset-top)); padding-top: env(safe-area-inset-top)"
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      />

      <v-toolbar-title class="pl-2">
        <transition
          name="fade-transition"
          mode="out-in"
        >
          <v-avatar
            :size="32"
            class="mr-2"
          >
            <v-img
              :src="randomizedLogo"
              class="randomizedLogo"
            >
              <template v-slot:placeholder>
                <v-img
                  :src="require('@/assets/logo.png')"
                  aspect-ratio="1"
                  height="32px"
                  contain
                />
              </template>
            </v-img>
          </v-avatar>
        </transition>
        <span class="title">
          {{ $t($router.currentRoute.meta.i18n) }}
        </span>
      </v-toolbar-title>

      <v-spacer />

      <AccountManager />
    </v-app-bar>
    <RandomBackground />
    <v-content style="padding-top: calc(env(safe-area-inset-top) + 56px) !important;">
      <transition
        name="slide-fade"
        mode="out-in"
      >
        <router-view />
      </transition>
      <v-footer
        padless
        color="blue darken-3"
        class="white--text"
      >
        <v-card
          flat
          tile
          width="100%"
          class="blue darken-3 text-center footer--safe-area"
        >
          <v-dialog
            v-model="showLicenseDialog"
            width="500"
            origin="bottom center"
          >
            <template v-slot:activator="{ on }">
              <span
                class="cursor-pointer"
                v-on="on"
              >
                <v-avatar
                  size="24"
                  class="mr-1"
                >
                  <v-img
                    :src="require('@/assets/ccIcon/cc.svg')"
                    alt="Creative Commons - Logo"
                  />
                </v-avatar>
                <v-avatar
                  size="24"
                  class="mr-1"
                >
                  <v-img
                    :src="require('@/assets/ccIcon/by.svg')"
                    alt="Creative Commons - BY"
                  />
                </v-avatar>
                <v-avatar
                  size="24"
                >
                  <v-img
                    :src="require('@/assets/ccIcon/nc.svg')"
                    alt="Creative Commons - Non-commercial"
                  />
                </v-avatar>
              </span>
            </template>

            <v-card>
              <v-card-title
                class="headline primary lighten-1"
              >
                <v-avatar
                  size="24"
                  class="mr-2"
                >
                  <v-img
                    :src="require('@/assets/ccIcon/cc.svg')"
                    alt="Creative Commons - Logo"
                  />
                </v-avatar>
                {{ $t('meta.footer.copyright.title') }}
              </v-card-title>

              <v-card-text class="mt-2 body-1">
                {{ $t('meta.footer.copyright.content') }}
              </v-card-text>

              <v-divider />

              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  target="_blank"
                >
                  <v-icon left>
                    mdi-eye
                  </v-icon>
                  {{ $t('meta.details') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-card-text class="white--text d-inline py-0">
            <strong>Penguin Statistics</strong> — {{ new Date().getFullYear() }}
          </v-card-text>
        </v-card>
      </v-footer>
    </v-content>
    <NetworkStateIndicator />
  </v-app>
</template>

<script>
  import RandomBackground from '@/components/global/RandomBackground'
  import AccountManager from '@/components/toolbar/AccountManager'
  import NetworkStateIndicator from "@/components/toolbar/NetworkStateIndicator";
  import Console from "@/utils/Console";
  import strings from "@/utils/strings";
  import config from "@/config";
  import {mapGetters} from "vuex";

export default {
  name: 'App',
  components: {
    NetworkStateIndicator,
    RandomBackground,
    AccountManager
  },
  data () {
    return {
      routes: [],
      randomizedLogo: "",
      localizations: [
        {
          id: 'zh',
          name: '中文'
        }, {
          id: 'en',
          name: 'English'
        }, {
          id: 'ja',
          name: '日本語'
        }, {
          id: 'ko',
          name: '한국어',
          beta: true,
        }
      ],
      prefetchingResources: false,
      drawer: !this.$vuetify.breakpoint.xsOnly,
      showLicenseDialog: false
    }
  },
  computed: {
    ...mapGetters('settings', ['language', 'dark']),
    appDark: {
      get () {
        return this.dark
      },
      set (value) {
        this.$vuetify.theme.dark = value;
        this.$store.commit('settings/switchDark', value)
      }
    },
    localizationMapper: {
      get () {
        return this.localizations.indexOf(this.localizations.find(el => el.id === this.$i18n.locale))
      },
      set () {}
    }
  },
  watch: {
    '$route': [
      'randomizeLogo',
      'logRouteEvent'
    ],
    'dark': ['onDarkChange']
  },
  beforeMount() {
    this.routes = this.$router.options.routes.filter(el => !el.meta.hide);
    this.$store.dispatch("data/fetch", false)
  },
  created () {
    // this.randomizeLogo();
    this.onDarkChange(this.dark);

    if (this.language) {
      this.changeLocale(this.language, false)
    } else {
      const language = strings.getFirstBrowserLanguage();
      Console.debug("[i18n] detected language", language);
      if (language) {
        // because this is a detection result, thus we are not storing it,
        // unless the user manually set one.
        this.changeLocale(language, false)
      }
    }

    Console.debug("(before init) dark status", this.dark, this.$vuetify.theme.dark);
    if (typeof this.dark === "boolean") {
      this.$vuetify.theme.dark = this.dark
    }
    Console.debug("(after init) dark status", this.dark, this.$vuetify.theme.dark)
  },
  methods: {
    async refreshData () {
      await this.$store.dispatch("data/fetch", true);
    },
    onDarkChange (newValue) {
      if (newValue) {
        document.body.style.backgroundColor = "#303030"
      } else {
        document.body.style.backgroundColor = "#fafafa"
      }
    },

    onMenuItemClicked (route) {
      if (route.meta && route.meta.externalRedirect) {
        if (route.meta.ga) {
          let ga = route.meta.ga;
          this.$ga.event(
            ga.category || 'redirect',
            ga.action || 'links',
            ga.label || 'unknown',
            ga.value || 1);
        }
        if (route.meta.link) {
          window.open(route.meta.link);
        }
      } else {
        this.$router.push({'name': route.name})
      }
    },
    randomizeLogo () {
      const random = Math.random();
      function imageUrl (character) {
        return `${config.cdn.global}/logos/penguin_stats_logo_${character}.png`
      }
      this.randomizedLogo = random < .25 ? imageUrl("exia")
        : random < .5 ? imageUrl("texas")
          : random < .75 ? imageUrl("sora")
            : imageUrl("croissant")
    },
    changeLocale (localeId, save=true) {
      if (localeId !== this.$i18n.locale) {
        Console.debug("[i18n] locale changed to:", localeId, "| saving to vuex:", save);
        this.$i18n.locale = localeId;
        // this.$vuetify.lang.current = localeId;
        if (save) this.$store.commit("settings/changeLocale", localeId);
        document.title = `${this.$t(this.$route.meta.i18n) + ' | ' || ''}${this.$t('app.name')}`;
      } else {
        Console.debug("[i18n] Same locale");
      }
    },
    logRouteEvent (newValue) {
      if (newValue.name === "StatsByStage_Selected") {
        // Console.log(this.$store.state.dataSource, newValue.params.stageId);
        this.$ga.event('result', 'fetch_' + this.$store.getters['dataSource/source'], newValue.params.stageId, 1)
      } else if (newValue.name === "StatsByItem_Selected") {
        this.$ga.event('result', 'fetch_' + this.$store.getters['dataSource/source'], newValue.params.itemId, 1)
      }
    }
  }
}
</script>

<style>
  .slide-fade-enter-active {
    transition: all .225s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .slide-fade-leave-active {
    transition: all .125s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(1.5vh);
    opacity: 0;
  }

  .v-navigation-drawer {
    transition: all .3s cubic-bezier(.25,.8,.5,1) !important;
  }

  .drawer-logo {
    height: calc(256px + env(safe-area-inset-top));
    padding: calc(32px + env(safe-area-inset-top)) 32px 32px 32px;
    overflow: hidden;
    transition: all .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .drawer-logo:hover {
    height: calc(304px + env(safe-area-inset-top));
  }
  .drawer-logo--two-line:hover {
    height: calc(336px + env(safe-area-inset-top));
  }
  .drawer-logo > .description {
    margin-top: 16px;
    text-align: center;
    line-height: 36px;
    font-size: 24px;
    opacity: 0;
    transition: all .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .drawer-logo:hover > .description {
    opacity: 1;
  }

  .randomizedLogo > .v-image__image {
    transition: background .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .theme--light .bkop-light {
    background: rgba(255, 255, 255, .75) !important;
  }

  .theme--dark .bkop-light {
    background: rgba(66, 66, 66, .85) !important;
  }

  .theme--light .bkop-medium {
    background: rgba(255, 255, 255, .9) !important;
  }

  .theme--dark .bkop-medium {
    background: rgba(66, 66, 66, .9) !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .transparentTable > .v-table__overflow > .v-table {
    background: transparent;
  }

  .v-navigation-drawer::-webkit-scrollbar {
    width: 2px;
  }

  .v-navigation-drawer::-webkit-scrollbar-thumb {
    background-color: rgb(200, 200, 200);
  }

  /*.v-toolbar {*/
  /*  padding-top: env(safe-area-inset-top);*/
  /*}*/

  /*.v-footer {*/
  /*  height: calc(32px + env(safe-area-inset-bottom)) !important;*/
  /*  padding-bottom: calc(env(safe-area-inset-bottom));*/
  /*}*/

  .no-wrap--text {
    word-break: break-word;
  }

  .monospace {
    font-family: SF Mono, "Droid Sans Mono", Ubuntu Mono, Consolas, Courier New, Courier, monospace;
  }

  .footer--safe-area {
    padding-top: 8px !important;
    /*In case the old browsers doesn't support advanced CSS calculations*/
    padding-bottom: 8px !important;
    padding-bottom: calc(max(env(safe-area-inset-bottom), 8px)) !important;
  }

  .v-stepper__items, .v-stepper__wrapper {
    overflow: initial !important;
  }

</style>
