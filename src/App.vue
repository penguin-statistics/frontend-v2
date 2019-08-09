<template>
  <v-app
    id="__app_root"
    :dark="dark"
  >
    <RandomBackground :interval="30" />
    <v-dialog
      :value="nowBuildNotice && nowBuildNoticeNotClosed"
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
      v-model="prefetchingResources"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ $t('meta.loading') }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
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
          {{ $t('menu.logo') }}
        </div>
      </div>
      <v-list>
        <div
          v-for="route in routes"
          :key="route.name"
        >
          <v-list-tile
            v-if="!route.children"
            :key="route.name"
            :to="{ 'name': route.name }"
          >
            <v-list-tile-action>
              <v-icon>{{ route.meta.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ $t(route.meta.i18n) }} &nbsp; <v-icon
                  v-if="!route.component"
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
          name="fade"
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
      <v-btn
        dark
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
            dark
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
              <v-avatar size="32">
                <svg
                  version="1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="5.5 -3.5 64 64"
                ><circle
                  fill="#FFF"
                  cx="37.6"
                  cy="28.8"
                  r="28.3"
                /><path d="M37.4-3.5c9 0 16.6 3 22.8 9.3a31 31 0 0 1 9.3 22.7c0 9-3 16.5-9.1 22.5a31.6 31.6 0 0 1-23 9.5A31 31 0 0 1 15 51.1a30.8 30.8 0 0 1-9.4-22.6c0-8.8 3.1-16.3 9.4-22.7a30.6 30.6 0 0 1 22.5-9.3zm.2 5.8A25 25 0 0 0 19 9.9a25.7 25.7 0 0 0 0 37 25.3 25.3 0 0 0 18.5 7.8c7 0 13.3-2.6 18.6-7.9 5-4.8 7.5-11 7.5-18.3 0-7.3-2.5-13.5-7.6-18.6a25.2 25.2 0 0 0-18.5-7.6zM46 20.6v13h-3.6v15.6h-10V33.6H29v-13c0-.6.2-1.1.6-1.5a2 2 0 0 1 1.4-.6h13.2c.5 0 1 .2 1.4.6.4.4.6.9.6 1.5zm-13-8.3c0-3 1.4-4.5 4.4-4.5S42 9.3 42 12.3s-1.5 4.5-4.5 4.5-4.5-1.5-4.5-4.5z" /></svg>
              </v-avatar>
              <v-avatar size="32">
                <svg
                  version="1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="5.5 -3.5 64 64"
                ><circle
                  fill="#FFF"
                  cx="37.5"
                  cy="28.7"
                  r="29.5"
                /><path d="M37.4-3.5c9 0 16.6 3 22.8 9.3a30.8 30.8 0 0 1 9.3 22.7c0 9-3 16.5-9.1 22.5a31.6 31.6 0 0 1-45.5 0 30.7 30.7 0 0 1-9.4-22.5c0-8.8 3.1-16.3 9.4-22.7a30.6 30.6 0 0 1 22.5-9.3zM12.7 19.9c-1 2.6-1.4 5.5-1.4 8.6 0 7 2.6 13.2 7.7 18.4a25.5 25.5 0 0 0 18.6 7.7c7.2 0 13.4-2.6 18.6-7.8 1.9-1.8 3.3-3.7 4.4-5.6l-12-5.4c-.5 2-1.5 3.7-3.1 5-1.7 1.2-3.6 2-5.8 2.2v4.9H36v-5c-3.5 0-6.8-1.3-9.7-3.8l4.4-4.4c2 2 4.5 2.9 7.1 2.9 1.1 0 2-.3 2.9-.8.8-.5 1.1-1.3 1.1-2.4 0-.8-.2-1.5-.8-2l-3.1-1.3-3.8-1.7-5-2.2-16.4-7.3zM37.6 2.2C30.3 2.2 24 4.8 19 10a30.6 30.6 0 0 0-3.5 4.3l12.2 5.5c.5-1.7 1.5-3 3-4S34 14 36 14V9h3.7v5c3 .1 5.6 1.1 8 3l-4.1 4.2a9.5 9.5 0 0 0-5.5-1.8 6 6 0 0 0-2.7.5c-.8.4-1.2 1-1.2 2l.3.8 4 1.8 2.9 1.3 5.1 2.2L63 35.4c.6-2.3.8-4.6.8-6.9a25 25 0 0 0-7.6-18.6 25 25 0 0 0-18.5-7.7z" /></svg>
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
      <v-avatar size="32">
        <svg
          version="1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="5.5 -3.5 64 64"
        ><circle
          fill="#FFF"
          cx="37.78"
          cy="28.5"
          r="28.84"
        /><path d="M37.44-3.5c8.95 0 16.57 3.13 22.86 9.37 3 3.01 5.3 6.45 6.86 10.32A32.58 32.58 0 0 1 69.5 28.5c0 4.38-.77 8.49-2.32 12.31a29.38 29.38 0 0 1-6.82 10.15 32.89 32.89 0 0 1-10.63 7.08 31.86 31.86 0 0 1-24.43.03 32.19 32.19 0 0 1-10.4-7.03A31.39 31.39 0 0 1 5.5 28.5c0-4.23.8-8.3 2.43-12.2 1.62-3.9 3.97-7.4 7.06-10.49C21.07-.39 28.56-3.5 37.44-3.5zm.12 5.77c-7.32 0-13.47 2.56-18.46 7.66a27.51 27.51 0 0 0-5.8 8.6 25.2 25.2 0 0 0-2.03 9.97c0 3.43.68 6.73 2.03 9.91a26.5 26.5 0 0 0 5.8 8.52c2.51 2.5 5.35 4.4 8.51 5.71a25.83 25.83 0 0 0 19.92-.03 27.64 27.64 0 0 0 8.71-5.76c5-4.88 7.49-11 7.49-18.35 0-3.54-.65-6.9-1.95-10.06A25.59 25.59 0 0 0 56.13 10a25.32 25.32 0 0 0-18.57-7.72zm-.4 20.92l-4.3 2.23a4.4 4.4 0 0 0-1.68-2 3.8 3.8 0 0 0-1.85-.58c-2.86 0-4.29 1.89-4.29 5.66 0 1.72.36 3.09 1.08 4.11a3.66 3.66 0 0 0 3.2 1.55c1.87 0 3.19-.92 3.95-2.74l3.94 2a9.4 9.4 0 0 1-8.4 5.02c-2.85 0-5.16-.87-6.91-2.62-1.75-1.76-2.63-4.2-2.63-7.32 0-3.05.89-5.46 2.66-7.25a9.05 9.05 0 0 1 6.71-2.69c3.96 0 6.8 1.54 8.52 4.63zm18.45 0l-4.23 2.23a4.4 4.4 0 0 0-1.68-2 3.89 3.89 0 0 0-1.92-.58c-2.85 0-4.28 1.89-4.28 5.66 0 1.72.36 3.09 1.08 4.11a3.66 3.66 0 0 0 3.2 1.55c1.87 0 3.18-.92 3.94-2.74l4 2a9.82 9.82 0 0 1-3.54 3.68 9.23 9.23 0 0 1-4.85 1.34c-2.9 0-5.21-.87-6.94-2.62-1.74-1.76-2.6-4.2-2.6-7.32 0-3.05.88-5.46 2.65-7.25a9.05 9.05 0 0 1 6.72-2.69c3.96 0 6.78 1.54 8.45 4.63z" /></svg>
      </v-avatar>
      <span>{{ $t('meta.footer.credit', {date: new Date().getFullYear()}) }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import service from '@/utils/service'
  import axios from 'axios'
  import RandomBackground from '@/components/RandomBackground'
export default {
  name: 'App',
  components: {
    RandomBackground
  },
  data () {
    return {
      routes: [],
      randomizedLogo: "",
      localizations: [{
        id: 'zh_CN',
        name: '简体中文'
      }, {
        id: 'en',
        name: 'English'
      }, {
        id: 'jp',
        name: '日本語'
      }],
      prefetchingResources: false,
      drawer: true,
      dark: true,
      nowBuildNoticeNotClosed: true
    }
  },
  computed: {
    nowBuildNotice () {
      return process.env.NOW_GITHUB_DEPLOYMENT
    }
  },
  watch: {
    '$route': ['randomizeLogo'],
    dark: (newValue) => {
      this.$store.commit('switchDark', newValue)
    }
  },
  beforeMount() {
    this.routes = this.$router.options.routes
  },
  mounted () {
    this.randomizeLogo();
    this.fetchData()
  },
  methods: {
    randomizeLogo () {
      let random = Math.random();
      this.randomizedLogo = random < .25 ? "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_exia.png"
        : random < .5 ? "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_texas.png"
          : random < .75 ? "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_sora.png"
            : "https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_croissant.png"
    },
    fetchData () {
      this.prefetchingResources = true;
      let startAjaxAt = new Date().getTime();
      axios.all([
        service.get("/items"),
        service.get("/limitations"),
        service.get("/result/matrix"),
        service.get("/stages"),
        service.get("/zones")
      ])
        .then(([items, limitations, resultMatrix, stages, zones]) => {
          this.$ga.time('all data', 'fetched', new Date().getTime() - startAjaxAt);
          this.$store.commit("store", {
            items: items.data,
            limitations: limitations.data,
            resultMatrix: resultMatrix.data,
            stages: stages.data,
            zones: zones.data
          })
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.prefetchingResources = false
        })
    },
    changeLocale (localeId) {
      this.$i18n.locale = localeId
    }
  }
}
</script>

<style>
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(5px);
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
    line-height: 48px;
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
