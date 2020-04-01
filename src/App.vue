<!--suppress CssInvalidFunction -->
<template>
  <v-app :class="languageFont">
    <GlobalSnackbar />
    <v-navigation-drawer
      v-model="drawer"
      app
      width="calc(env(safe-area-inset-left) + 300px)"
    >
      <div 
        :class="{
          'drawer-logo blue': true,
          'darken-4': dark,
          'darken-3': !dark,
          'drawer-logo--two-line': $t('app.name_line2') !== ''
        }"
        style="padding-left: calc(max(env(safe-area-inset-left), 32px))"
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
        style="padding-left: calc(max(env(safe-area-inset-left), 8px))"
      >
        <Navigation
          v-for="route in routes"
          :key="route.name"
          :route="route"
        />

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

            <ThemeSwitcher />

            <LocaleSwitcher />
          </v-row>
        </v-container>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      color="blue darken-3"
      style="min-height: calc(56px + env(safe-area-inset-top)); padding-top: env(safe-area-inset-top)"
      class="x--safe-area toolbar--safe-area"
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
            />
          </v-avatar>
        </transition>
        <span class="title force-lang-font">
          {{ $t($router.currentRoute.meta.i18n) }}
        </span>
      </v-toolbar-title>

      <v-spacer />

      <AccountManager />
    </v-app-bar>
    <RandomBackground />
    <v-content
      style="padding-top: calc(env(safe-area-inset-top) + 56px) !important;"
    >
      <transition
        name="slide-fade"
        mode="out-in"
      >
        <router-view class="x--safe-area" />
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

          <v-card-text class="white--text d-inline">
            <strong>Penguin Statistics</strong> — {{ new Date().getFullYear() }}
          </v-card-text>

          <v-card-text class="white--text d-block pt-2 pb-0">
            <strong>{{ version.VERSION }}</strong>&nbsp;
            <span class="overline monospace">{{ version.GIT_COMMIT }}-{{ version.ENV }}</span>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-content>
    <NetworkStateIndicator />
  </v-app>
</template>

<script>
  import RandomBackground from '@/components/global/RandomBackground'
  import GlobalSnackbar from "@/components/global/GlobalSnackbar";

  import AccountManager from '@/components/toolbar/AccountManager'
  import NetworkStateIndicator from "@/components/toolbar/NetworkStateIndicator";

  import Navigation from "@/components/drawer/Navigation";
  import LocaleSwitcher from "@/components/drawer/LocaleSwitcher";
  import ThemeSwitcher from "@/components/drawer/ThemeSwitcher";

  import GlobalEntry from "@/mixins/hooks/GlobalEntry";

  import config from "@/config";
  import './styles/global.css'
  import {mapGetters} from "vuex";

export default {
  name: 'App',
  components: {
    LocaleSwitcher,
    ThemeSwitcher,
    Navigation,
    GlobalSnackbar,
    NetworkStateIndicator,
    RandomBackground,
    AccountManager
  },
  mixins: [GlobalEntry],
  data () {
    return {
      routes: [],
      drawer: !this.$vuetify.breakpoint.xsOnly,
      showLicenseDialog: false
    }
  },
  computed: {
    ...mapGetters('settings', ['dark']),
    version () {
      return {
        VERSION: config.version || "v0.0.0",
        GIT_COMMIT: GIT_COMMIT.trim(),
        ENV: process.env.NODE_ENV === 'production' ? "prod" : "dev"
      }
    }
  },
  created () {
    this.routes = this.$router.options.routes.filter(el => !el.meta.hide);
    this.$store.dispatch("data/fetch", false);
  },
  methods: {
    async refreshData () {
      await this.$store.dispatch("data/fetch", true);
    },
  }
}
</script>
