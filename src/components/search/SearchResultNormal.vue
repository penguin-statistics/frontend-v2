<template>
  <SearchResultItems
    v-if="result.type === 'items'"
    :result="result"
    :index="index"
    @click.native="sendProbe"
  />
  <SearchResultStages
    v-else-if="result.type === 'stages'"
    :result="result"
    :index="index"
    @click.native="sendProbe"
  />
  <div v-else>
    unknown type of result {{ result.type }}
  </div>
</template>

<script>
import SearchResultItems from "@/components/search/SearchResultItems";
import SearchResultStages from "@/components/search/SearchResultStages";
export default {
  name: "SearchResultNormal",
  components: {SearchResultItems, SearchResultStages},
  props: {
    result: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    query: {
      type: String,
      required: true
    }
  },
  methods: {
    sendProbe() {
      this.$probe.reportEnteredSearchResult({
        stageId: this.result.stageId,
        itemId: this.result.itemId,
        query: this.query,
        position: this.index
      })
    }
  },
}
</script>

<style scoped>

</style>