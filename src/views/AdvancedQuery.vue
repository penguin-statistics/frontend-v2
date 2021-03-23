<template>
  <v-container
    class="fill-height"
    fluid
  >
    <QueryMain
      cache
      :preset="preset"
    />
  </v-container>
</template>

<script>
import get from '@/utils/getters'
import QueryMain from '@/components/advancedQuery/QueryMain'
export default {
  name: 'AdvancedQuery',
  components: { QueryMain },
  props: {
    stage: {
      type: String,
      default: () => ''
    },
    items: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    preset () {
      const preset = {}
      if (this.stage && get.stages.byStageId(this.stage).stageId) preset.stage = this.stage
      if (this.items && typeof this.items === 'string') {
        const splitted = this.items.split(',')
        const filtered = []

        // for safety precautions we limited the amount that preset items could possibly have to
        // (so the one may not possibly jam the client with query `items=${",".repeat(1e5)}` )
        if (splitted.length < get.items.all().length) {
          for (const s of splitted) {
            // if the item id is non-empty, exists in local database, and doesn't have duplicate, use it
            if (s && get.items.byItemId(s).itemId && !filtered.includes(s)) filtered.push(s)
          }

          preset.item = filtered
        }
      }

      if (preset !== {}) return preset
      return null
    }
  }
}
</script>

<style scoped>

</style>
