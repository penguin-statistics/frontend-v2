<template>
  <v-card
    class="bkop-light radius-2 cursor-pointer"
    ripple
    hover

    :to="{ name: 'StatsByItem_SelectedItem', params: { itemId: item.itemId } }"
  >
    <v-card-text class="d-flex flex-row align-center">
      <Item
        :item="item"
      />
      <div class="ml-4">
        <h2 class="headline">
          {{ name }}
        </h2>
        <span class="monospace grey--text mt-1">
          #{{ item.itemId }}
        </span>
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

<style scoped>

</style>