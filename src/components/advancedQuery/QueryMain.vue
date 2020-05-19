<template>
  <v-row
    class="fill-height"
    :align="result ? 'start' : 'center'"
    justify="center"
    no-gutters
  >
    <v-col
      cols="12"
      :sm="result ? 6 : 9"
      :md="result ? 5 : 8"
      :lg="result ? 4 : 6"
      :xl="result ? 3 : 6"
    >
      <OffTitle :content="$t('query.panel.builder')" />
      <QueryBuilder
        v-model="queries"
        @result="updateResult"
      />
    </v-col>
    <v-col
      v-if="result"
      cols="12"
      sm="6"
      md="7"
      lg="8"
      xl="9"
      class="justify-start"
    >
      <OffTitle :content="$t('query.panel.results')" />
      <QueryResults :results="result" />
    </v-col>
    <!--    <v-col cols="12">-->
    <!--      <code>Queries: {{ queries }}</code>-->
    <!--      <code class="ml-1">Marshalled: {{ marshalled }}</code>-->
    <!--    </v-col>-->
  </v-row>
</template>

<script>
  import QueryResults from "@/components/advancedQuery/QueryResults";
  import QueryBuilder from "@/components/advancedQuery/QueryBuilder";
  import marshaller from "@/utils/marshaller";
  import OffTitle from "@/components/global/OffTitle";

  export default {
    name: "QueryMain",
    components: {OffTitle, QueryBuilder, QueryResults},
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
            type: "matrix",
            stage: null,
            item: [],
            timeRange: [],
            server: this.$store.getters["dataSource/server"],
            source: "global",
            interval: 24 * 60 * 60 * 1000,
          }
        ],
        result: null
      }
    },
    computed: {
      marshalled() {
        return marshaller.advancedQuery(this.queries);
      }
    },
    created () {
      // rehydrate preset settings
      if (this.preset) {
        if (this.preset.stage) this.queries[0].stage = this.preset.stage
        if (this.preset.item) this.queries[0].item = this.preset.item
      }
    },
    methods: {
      updateResult(data) {
        const results = []
        for (const [index, result] of Object.entries(data)) {
          results.push({
            type: this.queries[index]["type"],
            query: this.queries[index],
            result
          })
        }
        this.result = results
      }
    },
  }
</script>

<style>
  html {
    overscroll-behavior-x: none;
  }
</style>