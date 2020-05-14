<template>
  <v-row
    class="overflow-y-auto flex-nowrap"
    :class="{'flex-column': $vuetify.breakpoint.xs}"
  >
    <v-col cols="3">
      <QueryResult />
    </v-col>
    <v-col cols="3">
      <QueryResult />
    </v-col>
    <v-col cols="3">
      <QueryResult />
    </v-col>
    <v-col cols="3">
      <QueryResult />
    </v-col>
  </v-row>
</template>

<script>
  import QueryResult from "@/components/advancedQuery/QueryResult";
  export default {
    name: "QueryResults",
    components: {QueryResult}
  }
</script>

<style scoped>

</style>