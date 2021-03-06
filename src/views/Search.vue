<template>
  <v-container
    class="fill-height align-start px-6 max-md-container"
  >
    <v-row class="mt-search">
      <v-col
        cols="12"
        class="d-flex flex-column align-center"
      >
        <GlobalSearch
          :query="query"
          @update:query="changeUrl"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GlobalSearch from '@/components/search/GlobalSearch'
export default {
  name: 'Search',
  components: { GlobalSearch },
  props: {
    query: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    changeUrl (query) {
      // console.log(query)
      const url = new URL(window.location.href)
      if (query === '') url.searchParams.delete('q')
      if (query) url.searchParams.set('q', query)
      window.history.replaceState(null, '', url.pathname + url.search)
    }
  }
}
</script>

<style scoped lang="scss">
.mt-search {
  margin-top: 10vh
}

@media (min-width: 1264px) {
  .max-md-container {
    max-width: 1185px
  }
}
</style>
