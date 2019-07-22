<template>
  <v-app>
    <v-navigation-drawer
        v-model="drawer"
        app
    >
      <div class="drawer-logo blue darken-4">
        <v-img :src="require('@/assets/logo.png')" aspect-ratio="1" height="192px" contain></v-img>
        <div class="white--text description">
          企鹅物流数据统计
        </div>
      </div>
      <v-list>
        <v-list-tile v-for="route in routes" :key="route.name" :to="{ 'name': route.name }">
          <v-list-tile-action>
            <v-icon>{{ route.meta.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t(route.meta.i18n) }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
        color="blue darken-3"
        dark
        fixed
        app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ $t($router.currentRoute.meta.i18n) }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
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
      <router-view />
    </v-content>
    <v-footer color="blue darken-3" class="white--text px-3" app>
      <v-spacer></v-spacer>
      <span>Penguin Statistics &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      routes: [],
      localizations: [{
        id: 'zh_CN',
        name: '简体中文'
      }, {
        id: 'zh_TW',
        name: '繁体中文'
      }, {
        id: 'en',
        name: 'English'
      }],
      drawer: true
    }
  },
  beforeMount() {
    this.routes = this.$router.options.routes
  },
  methods: {
    changeLocale (localeId) {
      this.$i18n.locale = localeId
    }
  }
}
</script>

<style>
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
</style>
