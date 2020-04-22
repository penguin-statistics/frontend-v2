<!--suppress CssInvalidFunction -->
<template>
  <v-app
    :class="languageFont"
  >
    <!--    <v-overlay-->
    <!--      :opacity="0.97"-->
    <!--      style="z-index:99999999999"-->
    <!--    >-->
    <!--      <v-row class="justify-center">-->
    <!--        <v-col-->
    <!--          cols="10"-->
    <!--          sm="10"-->
    <!--          md="12"-->
    <!--          lg="12"-->
    <!--          xl="12"-->
    <!--        >-->
    <!--          <h1>-->
    <!--            截断型信息标题-->
    <!--          </h1>-->
    <!--          <p class="subtitle-1 mb-9">-->
    <!--            截断型信息内容-->
    <!--          </p>-->

    <!--          <h2 class="display-4">-->
    <!--            00<span class="display-3">:00</span>-->
    <!--          </h2>-->
    <!--        </v-col>-->
    <!--      </v-row>-->
    <!--    </v-overlay>-->
    <GlobalSnackbar />
    <PWAPopups />
    <v-navigation-drawer
      v-model="drawer"
      app
      :style="{'filter': isInSpecialUI ? 'grayscale(1)' : ''}"
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
            class="flex-column"
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

        <v-divider class="mt-2 mb-1" />

        <v-container>
          <v-row
            justify="space-around"
          >
            <v-btn
              outlined
              text
              class="flex-grow-1 mr-1"
              @click="refreshData"
            >
              <v-icon left>
                mdi-database-refresh
              </v-icon>
              {{ $t('menu.refreshData') }}
            </v-btn>

            <SettingsDialog />
          </v-row>
        </v-container>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      :color="primaryColor"
      style="min-height: calc(56px + env(safe-area-inset-top)); padding-top: env(safe-area-inset-top)"
      :style="{'filter': isInSpecialUI ? 'grayscale(1)' : ''}"
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
      :style="{'filter': isInSpecialUI ? 'grayscale(1)' : ''}"
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

  import GlobalEntry from "@/mixins/hooks/GlobalEntry";

  import './styles/global.css'
  import {mapGetters} from "vuex";
  import PWAPopups from "@/components/global/PWAPopups";
  import Footer from "@/components/global/Footer";
  import CDN from "@/mixins/CDN";
  import Mirror from "@/mixins/Mirror";
  import SpecialUI from "@/mixins/SpecialUI";
  import SettingsDialog from "@/components/drawer/SettingsDialog";

export default {
  name: 'App',
  components: {
    SettingsDialog,
    Footer,
    PWAPopups,
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
  },
}
</script>
