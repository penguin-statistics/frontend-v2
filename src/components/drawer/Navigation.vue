<template>
  <v-list-item
    v-if="!route.children || route.meta.forceSingle"
    :key="route.name"
    v-haptic
    :class="route.path === $route.path ? activeClass : ''"
    :two-line="!!route.meta.twoLine"
    :color="`primary ${dark ? 'lighten-1' : 'darken-2'}`"
    v-bind="linkOf(route)"
    exact
  >
    <v-list-item-icon>
      <SeabornCreatureIcon
        :normal-icon="route.meta.icon"
        :creature="route.meta.creature"
      />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        {{ $t(route.meta.i18n) }} &nbsp;
        <v-icon
          v-if="!route.component && !route.meta.forceSingle"
          small
        >
          mdi-open-in-new
        </v-icon>
      </v-list-item-title>
      <v-list-item-subtitle
        v-if="!!route.meta.twoLine"
        class="overline"
      >
        {{ $t(route.meta.twoLine) }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
  <v-list-group
    v-else
    :key="route.name"
    v-haptic
    :value="route.meta.active"
    :color="`primary ${dark ? 'lighten-1' : 'darken-2'}`"
    no-action
  >
    <template #activator>
      <v-list-item-title>{{ $t(route.meta.i18n) }}</v-list-item-title>
    </template>

    <template #prependIcon>
      <SeabornCreatureIcon
        :normal-icon="route.meta.icon"
        :creature="route.meta.creature"
      />
    </template>

    <v-list-item
      v-for="child in route.children.filter(el => !el.meta.hide )"
      :key="child.name"
      v-haptic
      :class="isActiveChild(child) ? activeClass : ''"
      :color="`primary ${dark ? 'lighten-1' : 'darken-2'}`"
      v-bind="linkOf(child)"
    >
      <v-list-item-title>
        {{ $t(child.meta.i18n) }}
        <div
          v-if="child.meta.beta"
          class="chip-label ml-1"
        >
          <v-icon
            x-small
            class="mr-1"
          >
            mdi-beta
          </v-icon>
          {{ $t('menu._beta') }}
        </div>
      </v-list-item-title>

      <v-list-item-icon>
        <SeabornCreatureIcon
          :normal-icon="child.meta.icon"
          :creature="child.meta.creature"
        />
      </v-list-item-icon>
    </v-list-item>
  </v-list-group>
</template>

<script>
import Theme from '@/mixins/Theme'
import SeabornCreatureIcon from "@/components/themes/SeabornCreatureIcon.vue";

export default {
  name: 'Navigation',
  components: {SeabornCreatureIcon},
  mixins: [Theme],
  props: {
    route: {
      type: Object,
      required: true
    }
  },
  computed: {
    activeClass() {
      return {
        'v-list-item--active': true,
        'white--text': this.$vuetify.theme.dark
      }
    }
  },
  methods: {
    // the route to go to, or the external link (meta.link: its URL, or a function that returns it) to open in a new tab
    linkOf(route) {
      const link = route.meta.link
      if (!link) return {to: {name: route.name}}
      return {href: typeof link === 'function' ? link() : link, target: '_blank', rel: 'noopener'}
    },
    isActiveChild(child) {
      // resolve the child as its path may contain params (e.g. the stats routes)
      const path = this.$router.resolve({ name: child.name }).route.path
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },
    navigate(route) {
      if (route.meta && route.meta.externalRedirect) {
        if (route.meta.ga) {
          const ga = route.meta.ga
          this.$ga.event(
              ga.category || 'redirect',
              ga.action || 'links',
              ga.label || 'unknown',
              ga.value || 1,
              {
                transport: 'beacon'
              }
          )
        }
        if (route.meta.link) {
          window.open(route.meta.link)
        }
      } else {
        this.$router.push({
          name: route.name
        })
      }
    }
  }
}
</script>
