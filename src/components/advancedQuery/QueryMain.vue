<template>
  <v-row
    class="fill-height"
    align="start"
    no-gutters
  >
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <QueryBuilder v-model="queries" />
    </v-col>
    <v-col
      cols="12"
      sm="6"
      md="8"
      lg="9"
    >
      <QueryResults />
    </v-col>
    <v-col cols="12">
      <ul>
        <li>
          <code>Queries: {{ queries }}</code>
        </li>
      </ul>
    </v-col>
  </v-row>
</template>

<script>
  import QueryResults from "@/components/advancedQuery/QueryResults";
  import QueryBuilder from "@/components/advancedQuery/QueryBuilder";

  export default {
    name: "QueryMain",
    components: {QueryBuilder, QueryResults},
    props: {
      preset: {
        type: Object,
        default: function () {
          return null
        }
      },
    },
    data() {
      return {
        queries: [
          {
            stage: undefined,
            item: [],
            timeRange: undefined,
            server: this.$store.getters["dataSource/server"],
            source: "global",
          }
        ]
      }
    },
    created () {
      // rehydrate preset settings
      if (this.preset) {
        if (this.preset.stage) this.queries[0].stage = this.preset.stage
        if (this.preset.item) this.queries[0].item = this.preset.item
      }
    },
  }
</script>

<style scoped>

</style>