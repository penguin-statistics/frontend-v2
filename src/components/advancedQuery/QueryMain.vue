<template>
  <v-row
    class="fill-height"
    align="start"
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
  import validator from "@/utils/validator";
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
            item: undefined,
            timeRange: undefined,
            server: undefined,
          }
        ]
      }
    },
    computed: {
      builderProps() {
        return {
          queries: this.queries
        }
      }
    },
    created () {
      // rehydrate preset settings
      if (this.preset && validator.exclusive(this.preset.stage, this.preset.item)) {
        if (this.preset.stage) return this.queries[0].stage = this.preset.stage
        if (this.preset.item) return this.queries[0].item = this.preset.item
      }
    },
  }
</script>

<style scoped>

</style>