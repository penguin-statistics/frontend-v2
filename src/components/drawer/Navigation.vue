<template>
  <v-list-item
    v-if="!route.children || route.meta.forceSingle"
    :key="route.name"
    :class="route.path === $route.path ? activeClass : ''"
    @click="navigate(route)"
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
    :color="`blue ${dark ? 'lighten-1' : 'darken-2'}`"
    no-action
  >
    <template v-slot:activator>
      <v-list-item-title>{{ $t(route.meta.i18n) }}</v-list-item-title>
    </template>

    <v-list-item
      v-for="child in route.children.filter(el => !el.meta.hide)"
      :key="child.name"
      :class="child.path === $route.path.split('/')[2] ? activeClass : ''"
      @click="navigate(child)"
    >
      <v-list-item-title>{{ $t(child.meta.i18n) }}</v-list-item-title>

      <v-list-item-icon>
        <v-icon v-text="child.meta.icon" />
      </v-list-item-icon>
    </v-list-item>
  </v-list-group>
</template>

<script>
  import Theme from "@/mixins/Theme";

  export default {
    name: "Navigation",
    mixins: [Theme],
    props: {
      route: {
        type: Object,
        required: true
      },
    },
    computed: {
      activeClass() {
        return {
          "v-list-item--active": true,
          "white--text": this.$vuetify.theme.dark
        }
      }
    },
    methods: {
      navigate (route) {
        if (route.meta && route.meta.externalRedirect) {
          if (route.meta.ga) {
            let ga = route.meta.ga;
            this.$ga.event(
              ga.category || 'redirect',
              ga.action || 'links',
              ga.label || 'unknown',
              ga.value || 1,
              {
                transport: 'beacon'
              }
            );
          }
          if (route.meta.link) {
            window.open(route.meta.link);
          }
        } else {
          this.$router.push({
            name: route.name
          })
        }
      },
    },
  }
</script>