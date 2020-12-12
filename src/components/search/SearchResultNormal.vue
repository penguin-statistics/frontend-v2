<template>
  <SearchResultItems
    v-if="result.type === 'items'"
    :result="result"
  />
  <SearchResultStages
    v-else-if="result.type === 'stages'"
    :result="result"
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
    }
  },
}
</script>

<style scoped>

</style>