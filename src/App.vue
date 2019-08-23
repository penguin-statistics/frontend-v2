<template>
  <v-app
    id="__app_root"
    :dark="dark"
  >
    <RandomBackground :interval="30" />
    <v-dialog
      :value="buildNotice && buildNoticeNotClosed"
      max-width="600"
      persistent
    >
      <v-card
        class="white--text pa-4"
        style="background: repeating-linear-gradient(-45deg, rgba(168, 128, 36, .6), rgba(168, 128, 36, .6) 45px, rgba(0, 0, 0, .8) 45px, rgba(0, 0, 0, .8) 90px)"
      >
        <v-card-title class="headline font-weight-black">
          <v-icon left>
            mdi-hammer
          </v-icon> {{ $t('builds.development.title') }}
        </v-card-title>

        <v-card-text>
          <p class="subheading font-weight-bold">
            {{ $t('builds.development.description') }}
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            @click="nowBuildNoticeNotClosed = false"
          >
            {{ $t('builds.development.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="$store.getters.ajaxErrors.length"
      persistent
      width="600"
    >
      <v-card>
        <v-card-title
          class="headline red"
          primary-title
        >
          <v-icon>mdi-alert</v-icon>
          <span class="ml-2">{{ $t('fetch.failed.title') }}</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <span class="subheading">
            {{ $t('fetch.failed.subtitle') }}
          </span>
          <v-divider class="my-4" />
          <v-expansion-panel>
            <v-expansion-panel-content>
              <template v-slot:header>
                <div>{{ $t('meta.details') }}</div>
              </template>
              <v-list two-line>
                <v-list-tile
                  v-for="error in $store.getters.ajaxErrors"
                  :key="error.id"
                  avatar
                >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ error.id }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ error.error }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-progress-circular
                      v-if="error.pending"
                      indeterminate
                    />
                    <v-icon v-else>
                      mdi-alert-circle-outline
                    </v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            :loading="$store.getters.ajaxPending"
            @click="refreshData"
          >
            <v-icon left>
              mdi-database-refresh
            </v-icon>
            {{ $t('fetch.failed.retry') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <div class="drawer-logo blue darken-4">
        <v-img
          :src="require('@/assets/logo.png')"
          aspect-ratio="1"
          height="192px"
          contain
        />
        <div class="white--text description">
          <v-layout
            column
            align-center
            justify-center
            wrap
          >
            <span>{{ $t('app.name_line1') }}</span>
            <span>{{ $t('app.name_line2') }}</span>
          </v-layout>
        </div>
      </div>
      <v-list>
        <div
          v-for="route in routes"
          :key="route.name"
        >
          <v-list-tile
            v-if="!route.children || route.meta.forceSingle"
            :key="route.name"
            :to="route.path"
          >
            <v-list-tile-action>
              <v-icon>{{ route.meta.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ $t(route.meta.i18n) }} &nbsp; <v-icon
                  v-if="!route.component && !route.meta.forceSingle"
                  small
                >
                  mdi-open-in-new
                </v-icon>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group
            v-else
            v-model="route.meta.active"
            :prepend-icon="route.meta.icon"
            no-action
            mandatory
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{ $t(route.meta.i18n) }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile
              v-for="child in route.children.filter(el => !(el.meta.hide))"
              :key="child.name"
              :to="{ 'name': child.name }"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ $t(child.meta.i18n) }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon>{{ child.meta.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </div>

        <v-divider class="my-2" />

        <v-layout
          justify-end
          row
          wrap
        >
          <v-btn
            icon
            @click="refreshData"
          >
            <v-icon>mdi-database-refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="dark = !dark"
          >
            <v-icon>mdi-invert-colors</v-icon>
          </v-btn>
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
              >
                <v-icon>mdi-translate</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile
                v-for="(locale, i) in localizations"
                :key="i"
                @click="changeLocale(locale.id)"
              >
                <v-list-tile-title>{{ locale.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-layout>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      fixed
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <transition
          name="fade-transition"
          mode="out-in"
        >
          <v-avatar
            :size="32"
            class="mr-3"
          >
            <v-img
              :src="randomizedLogo"
              class="randomizedLogo"
            />
          </v-avatar>
        </transition>{{ $t($router.currentRoute.meta.i18n) }}
      </v-toolbar-title>
      <v-spacer />

      <AccountManager />
    </v-toolbar>
    <v-content>
      <transition
        name="slide-fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </v-content>
    <v-footer
      color="blue darken-3"
      class="white--text px-3"
      app
    >
      <a
        href="https://creativecommons.org/licenses/by-nc/4.0/"
        target="_blank"
      >
        <v-tooltip
          top
          content-class="transparent elevation-0 pa-0"
          lazy
        >
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <v-avatar
                size="24"
              >
                <v-img
                  :src="require('@/assets/ccIcon/cc.svg')"
                  alt="Creative Commons - Logo"
                />
              </v-avatar>
              <v-avatar
                size="24"
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

          <v-card
            max-width="300"
            color="accent"
            class="black--text body-2 pa-3"
          >
            <v-card-title>
              <span>{{ $t('meta.footer.copyright') }}</span>
            </v-card-title>
          </v-card>
        </v-tooltip>
      </a>
      <v-spacer />
      <v-fade-transition>
        <span
          v-if="$store.getters.ajaxPending"
        >
          <v-progress-circular
            indeterminate
            color="accent"
            class="mr-2"
            :size="16"
            :width="3"
          />
          <span>
            {{ $t('meta.loading') }}
          </span>
        </span>
      </v-fade-transition>
    </v-footer>
  </v-app>
</template>

<script>
  import RandomBackground from '@/components/RandomBackground'
  import AccountManager from '@/components/AccountManager'

export default {
  name: 'App',
  components: {
    RandomBackground,
    AccountManager
  },
  data () {
    return {
      routes: [],
      randomizedLogo: "",
      localizations: [
        {
          id: 'zh_CN',
          name: '简体中文'
        }, {
          id: 'en',
          name: 'English'
        }, {
          id: 'ja',
          name: '日本語'
        }
      ],
      prefetchingResources: false,
      drawer: !this.$vuetify.breakpoint.xsOnly,
      buildNoticeNotClosed: true
    }
  },
  computed: {
    buildNotice () {
      return process.env.NOW_GITHUB_DEPLOYMENT || process.env.CI_BUILD === "TRAVIS-CI"
    },
    dark: {
      get () {
        return this.$store.state.settings.dark
      },
      set (value) {
        this.$store.commit('switchDark', value)
      }
    }
  },
  watch: {
    '$route': [
      'randomizeLogo',
      'logRouteEvent'
    ]
  },
  beforeMount() {
    this.routes = this.$router.options.routes
  },
  mounted () {
    this.randomizeLogo();
  },
  methods: {
    async refreshData () {
      await this.$store.dispatch("fetchData", true);
    },
    randomizeLogo () {
      let random = Math.random();
      this.randomizedLogo = random < .25 ? "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_exia.png"
        : random < .5 ? "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_texas.png"
          : random < .75 ? "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_sora.png"
            : "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_croissant.png"
    },
    changeLocale (localeId) {
      this.$i18n.locale = localeId
    },
    logRouteEvent (newValue) {
      if (newValue.name === "StatsByStage_SelectedBoth") {
        console.log(this.$store.state.dataSource, newValue.params.stageId);
        this.$ga.event('result', 'fetch_' + this.$store.state.dataSource, newValue.params.stageId, 1)
      } else if (newValue.name === "StatsByItem_SelectedItem") {
        this.$ga.event('result', 'fetch_' + this.$store.state.dataSource, newValue.params.itemId, 1)
      }
    }
  }
}
</script>

<style>
  .slide-fade-enter-active {
    transition: all .325s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .slide-fade-leave-active {
    transition: all .175s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(2vh);
    opacity: 0;
  }

  .theme--dark, .theme--light {
    transition: all .3s cubic-bezier(.25,.8,.5,1) !important;
  }

  .drawer-logo {
    height: 256px;
    padding: 32px;
    overflow: hidden;
    transition: all .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .drawer-logo:hover {
    height: 320px;
    padding: 32px;
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
    background: rgba(255, 255, 255, .65) !important;
  }

  .theme--dark .bkop-light {
    background: rgba(66, 66, 66, .75) !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .transparentTable > .v-table__overflow > .v-table {
    background: transparent;
  }
</style>
