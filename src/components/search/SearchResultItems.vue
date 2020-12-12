<template>
  <v-card
    class="orange-card radius-2 cursor-pointer search-result-card transition-all--fast ma-2"
    ripple
    hover

    :to="{ name: 'StatsByItem_SelectedItem', params: { itemId: item.itemId } }"
  >
    <v-card-text class="d-flex flex-row align-center">
      <div
        class="d-flex justify-center text-center"
        style="min-width: 48px !important"
      >
        <Item
          :item="item"
        />
      </div>
      <div class="ml-4">
        <span class="monospace grey--text mb-1">
          {{ $t('item.name') }}
        </span>
        <h2 class="headline">
          {{ name }}
        </h2>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import get from "@/utils/getters"
import Item from "@/components/global/Item";
import strings from "@/utils/strings";

export default {
  name: "SearchResultItems",
  components: {Item},
  props: {
    result: {
      type: Object,
      required: true
    },
  },
  computed: {
    name() {
      return strings.translate(this.item, "name")
    },
    item() {
      return get.items.byItemId(this.result.itemId);
    }
  },
}
</script>

<style scoped lang="scss">
.orange-card {
  .theme--light & {
    background: rgb(255, 235, 204);
  }

  .theme--dark & {
    background: rgba(77, 47, 31, 0.9)
  }
}
</style>