<template>
  <SearchResultItems
    v-if="result.type === 'items'"
    :result="result"
    :index="index"
    @click="sendProbe"
  />
  <SearchResultStages
    v-else-if="result.type === 'stages'"
    :result="result"
    :index="index"
    @click="sendProbe"
  />
  <div v-else>
    unknown type of result {{ result.type }}
  </div>
</template>

<script>
import SearchResultItems from "@/components/search/SearchResultItems";
import SearchResultStages from "@/components/search/SearchResultStages";
import probe from "@/utils/probe";
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
      probe.reportEnteredSearchResult({
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