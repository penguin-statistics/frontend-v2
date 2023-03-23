<template>
  <v-card
    v-haptic
    class="mb-1"
    :to="{name: 'Search'}"
    :flat="searching"
    :disabled="searching"
    :class="searching ? activeClass : 'search-card transition-all'"
  >
    <v-card-title
      class="subtitle-2 pa-2 transition-all"
    >
      <v-slide-x-reverse-transition>
        <v-icon
          v-show="!searching"
          class="transition-all mr-8"
        >
          mdi-magnify
        </v-icon>
      </v-slide-x-reverse-transition>

      <div
        class="flex-grow-1 position-relative"
      >
        <span
          class="search-text"
          :class="{'search-text--right': searching}"
        >
          {{ $t('menu.search') }}
        </span>
      </div>
      <v-slide-x-transition>
        <v-icon
          v-show="searching"
          class="ml-2 transition-all"
        >
          mdi-chevron-right
        </v-icon>
      </v-slide-x-transition>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'GlobalSearchNavigation',
  computed: {
    searching () {
      return this.$route.name === 'Search'
    },
    activeClass () {
      return {
        'white--text': this.$vuetify.theme.dark,
        'list-active': true
      }
    }
  }
}
</script>

<style scoped>
.search-text {
  transition: width .525s cubic-bezier(0.165, 0.84, 0.44, 1), color .225s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  display: block;
  text-align: right;
  white-space: nowrap;
  width: 0
}
.search-card:hover {
  filter: brightness(1.25);
}
.search-text--right {
  width: 100%;
}
.hide {
  opacity: 0;
}
</style>

<style>
.theme--light .list-active {
  background: #e5e5e5 !important;
}
.theme--dark .list-active {
  background: #666666 !important;
  color: white
}
</style>
