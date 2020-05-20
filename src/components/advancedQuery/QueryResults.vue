<template>
  <v-card
    outlined
    class="d-flex bkop-light flex-column mx-2"
  >
    <template v-if="results">
      <QueryResult
        v-for="({type, query, result}, index) in results"
        :key="index"
        :result="{result, query}"
        :index="index"
        class="my-4"
        :type="type"
      />
    </template>
  </v-card>
</template>

<script>
  import QueryResult from "@/components/advancedQuery/QueryResult";
  export default {
    name: "QueryResults",
    components: {QueryResult},
    props: {
      results: {
        type: Array,
        default () {
          return []
        }
      },
    },
  }
</script>

<style scoped>

</style>