<template>
  <v-app
    :class="languageFont"
  >
    <v-overlay
      color="rgb(18, 18, 18)"
      :value="serverNotifyOverlay"
      :opacity="0.99"
      style="z-index:1000000"
    >
      <v-row class="justify-center text-center">
        <v-col cols="12">
          <v-icon :size="48">
            mdi-server
          </v-icon>
          <h1 class="heading mt-4 mb-6">
            服务器已切换至
          </h1>

          <h2
            class="monospace"
            style="font-size: 128px"
          >
            {{ $store.getters['dataSource/server'] }}
          </h2>
        </v-col>
      </v-row>
    </v-overlay>
    <UpgradeNotifier />
    <GlobalSnackbar />
    <MirrorSelector />
    <v-navigation-drawer
      v-model="drawer"
      app
      :style="{'filter': isInSpecialUI ? 'grayscale(1)' : ''}"
      class="safe-area--navigation-drawer"
      width="300px"
    >
      <Logo />
      <v-list
        dense
        nav
        class="safe-area--navigation"
      >
        <Navigation
          v-for="route in routes"
          :key="route.name"
          :route="route"
        />

        <v-divider class="mt-2 mb-1" />

        <!-- This is to fix that s**tty Safari doesn't allow me to scroll down as I want. 128px is just the right amount-->
        <v-container style="margin-bottom: 120px">
          <v-row
            justify="space-around"
          >
            <v-btn
              outlined
              text
              class="flex-grow-1 mr-1"
              :loading="pending"
              @click="refreshData"
            >
              <v-icon left>
                mdi-database-refresh
              </v-icon>
              {{ $t('menu.refreshData') }}
            </v-btn>

            <SettingsDialog />
          </v-row>
          <v-row
            justify="center"
            class="mt-2"
          >
            <v-expand-transition>
              <div
                v-if="lowData"
                class="text-center overline"
              >
                {{ $t('settings.optimization.lowData.active') }}
              </div>
            </v-expand-transition>
          </v-row>
        </v-container>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      :color="primaryColor"
      :style="{'filter': isInSpecialUI ? 'grayscale(1)' : ''}"
      class="x--safe-area toolbar--safe-area flex-column"
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

      <ServerSelector />

      <AccountManager />
    </v-app-bar>
    <RandomBackground />
    <v-content
      :style="{'filter': isInSpecialUI ? 'grayscale(1)' : ''}"
      class="safe-area--v-content"
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

  import GlobalEntry from "@/mixins/hooks/GlobalEntry";

  import './styles/global.css'
  import './styles/fonts.css'
  import Footer from "@/components/global/Footer";
  import CDN from "@/mixins/CDN";
  import Mirror from "@/mixins/Mirror";
  import SpecialUI from "@/mixins/SpecialUI";
  import SettingsDialog from "@/components/drawer/SettingsDialog";
  import MirrorSelector from "@/components/global/MirrorSelector";
  import Logo from "@/components/drawer/Logo";
  import {mapGetters} from "vuex";
  import UpgradeNotifier from "@/components/global/UpgradeNotifier";
  import ServerSelector from "@/components/toolbar/ServerSelector";

export default {
  name: 'App',
  components: {
    ServerSelector,
    UpgradeNotifier,
    Logo,
    MirrorSelector,
    SettingsDialog,
    Footer,
    Navigation,
    GlobalSnackbar,
    NetworkStateIndicator,
    RandomBackground,
    AccountManager
  },
  mixins: [GlobalEntry, CDN, Mirror, SpecialUI],
  data () {
    return {
      routes: [],
      drawer: !this.$vuetify.breakpoint.xsOnly,
      showLicenseDialog: false,
      serverNotifyOverlay: false
    }
  },
  computed: {
    ...mapGetters("settings", ["lowData"]),
    ...mapGetters("ajax", ["pending"]),
    ...mapGetters("dataSource", ["server"]),
  },
  watch: {
    server() {
      this.serverNotifyOverlay = true

      const self = this;
      setTimeout(function () {
        self.serverNotifyOverlay = false
      }, 2500)
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
  },
}
</script>
