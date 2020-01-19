<template>
  <v-app
    id="__app_root"
    :dark="dark"
  >
    <RandomBackground />
    <v-navigation-drawer
      v-model="drawer"
      app
      width="300"
    >
      <div class="drawer-logo blue darken-4">
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
        <div
          v-for="route in routes"
          :key="route.name"
        >
          <v-list-item
            v-if="!route.children || route.meta.forceSingle"
            :key="route.name"
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
            :value="route.meta.active"
            :prepend-icon="route.meta.icon"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-title>{{ $t(route.meta.i18n) }}</v-list-item-title>
            </template>

            <v-list-item
              v-for="child in route.children.filter(el => !el.meta.hide)"
              :key="child.name"
              @click="onMenuItemClicked(child)"
            >
              <v-list-item-title>{{ $t(child.meta.i18n) }}</v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="child.meta.icon" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </div>

        <v-divider class="my-2" />

        <v-container>
          <v-row
            justify="end"
          >
            <v-btn
              icon
              class="mx-1"
              @click="refreshData"
            >
              <v-icon>mdi-database-refresh</v-icon>
            </v-btn>

            <v-btn
              icon
              class="mx-1"
              @click="dark = !dark"
            >
              <v-icon>mdi-invert-colors</v-icon>
            </v-btn>
            
            <v-menu
              bottom
              left
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
                <v-list-item
                  v-for="(locale, i) in localizations"
                  :key="i"
                  @click="changeLocale(locale.id)"
                >
                  <v-list-item-title>{{ locale.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-container>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      fixed
      dark
      color="blue darken-3"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title>
        <transition
          name="fade-transition"
          mode="out-in"
        >
          <v-avatar
            :size="32"
            class="mx-2"
          >
            <v-img
              :src="randomizedLogo"
              class="randomizedLogo"
            />
          </v-avatar>
        </transition>
        <span class="title">
          {{ $t($router.currentRoute.meta.i18n) }}
        </span>
      </v-toolbar-title>

      <v-spacer />

      <AccountManager />
    </v-app-bar>
    <v-content>
      <transition
        name="slide-fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </v-content>
    <v-footer
      app
      color="blue darken-3"
      class="white--text px-4 py-0"
    >
      <v-dialog
        v-model="showLicenseDialog"
        width="500"
        origin="bottom left"
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
            primary-title
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

          <v-card-text>
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
      <v-spacer />
      <NetworkStateIndicator />
    </v-footer>
  </v-app>
</template>

<script>
  import RandomBackground from '@/components/global/RandomBackground'
  import AccountManager from '@/components/toolbar/AccountManager'
  import NetworkStateIndicator from "@/components/toolbar/NetworkStateIndicator";
  import Console from "@/utils/Console";
  import strings from "@/utils/strings";

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
          id: 'zh-CN',
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
      showLicenseDialog: false
    }
  },
  computed: {
    dark: {
      get () {
        return this.$store.state.settings.dark
      },
      set (value) {
        this.$store.commit('switchDark', value)
        this.$vuetify.theme.dark = value
      }
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
    this.routes = this.$router.options.routes.filter(el => !(el.meta.hide))
    this.$store.dispatch("fetchData", false)
  },
  mounted () {
    this.randomizeLogo();
    this.onDarkChange(this.$store.state.settings.dark);

    if (this.$store.getters.language) {
      this.changeLocale(this.$store.getters.language, false)
    } else {
      let language = strings.getFirstBrowserLanguage();
      if (language) {
        // because this is a detection result, thus we are not storing it,
        // unless the user manually set one.
        this.changeLocale(language, false)
      }
    }

    if (this.$store.state.settings.dark) {
      this.$vuetify.theme.dark = this.$store.state.settings.dark
    }
  },
  methods: {
    async refreshData () {
      await this.$store.dispatch("fetchData", true);
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
      let random = Math.random();
      this.randomizedLogo = random < .25 ? "https://penguin-stats.s3.ap-southeast-1.amazonaws.com/logos/penguin_stats_logo_exia.png"
        : random < .5 ? "https://penguin-stats.s3.ap-southeast-1.amazonaws.com/logos/penguin_stats_logo_texas.png"
          : random < .75 ? "https://penguin-stats.s3.ap-southeast-1.amazonaws.com/logos/penguin_stats_logo_sora.png"
            : "https://penguin-stats.s3.ap-southeast-1.amazonaws.com/logos/penguin_stats_logo_croissant.png"
    },
    changeLocale (localeId, save=true) {
      Console.debug("changing locale to", localeId, ", save:", save)
      this.$i18n.locale = localeId;
      if (save) this.$store.commit("changeLocale", localeId);
      document.title = `${this.$t(this.$route.meta.i18n) + ' | ' || ''}${this.$t('app.name')}`;
    },
    logRouteEvent (newValue) {
      if (newValue.name === "StatsByStage_SelectedBoth") {
        Console.log(this.$store.state.dataSource, newValue.params.stageId);
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

  .v-toolbar {
    padding-top: env(safe-area-inset-top);
  }

  .v-footer {
    height: calc(32px + env(safe-area-inset-bottom)) !important;
    padding-bottom: calc(env(safe-area-inset-bottom));
  }

</style>
