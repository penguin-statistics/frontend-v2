<!--suppress CssInvalidFunction -->
<template>
  <v-app :class="languageFont">
    <GlobalSnackbar />
    <PWAPopups />
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
          :src="cdnResource('/logos/penguin_stats_logo.png')"
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
      <Footer />
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

  import './styles/global.css'
  import {mapGetters} from "vuex";
  import PWAPopups from "@/components/global/PWAPopups";
  import Footer from "@/components/global/Footer";
  import CDN from "@/mixins/CDN";

export default {
  name: 'App',
  components: {
    Footer,
    PWAPopups,
    LocaleSwitcher,
    ThemeSwitcher,
    Navigation,
    GlobalSnackbar,
    NetworkStateIndicator,
    RandomBackground,
    AccountManager
  },
  mixins: [GlobalEntry, CDN],
  data () {
    return {
      routes: [],
      drawer: !this.$vuetify.breakpoint.xsOnly,
      showLicenseDialog: false
    }
  },
  computed: {
    ...mapGetters('settings', ['dark']),
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
