<template>
  <v-card
    class="d-flex flex-row align-start flex-wrap pa-3"
  >
    <div
      class="d-inline-flex flex-column align-start flex-wrap justify-start"
      style="max-height: calc((66px + 16px) * 3 + 12px * 2 ); overflow-x: auto; width: 100%;"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="align-start justify-start ma-2"
      >
        <v-badge
          bottom
          overlap
          bordered
          label
          color="indigo"
          :offset-x="24"
          :offset-y="24"
          :content="`×${item.have}`"
        >
          <ItemIcon
            disable-tooltip
            :ratio="1.0"
            :item="getItem(item.id)"
          />
        </v-badge>
      </div>
    </div>
  </v-card>
</template>

<script>
import get from "@/utils/getters";
import ItemIcon from "@/components/global/ItemIcon";
import Theme from "@/mixins/Theme";

export default {
  name: "DepotResult",
  components: {ItemIcon},
  mixins: [Theme],
  props: {
    items: {
      type: Array,
      required: true
    },
  },
  computed: {
  },
  methods: {
    getItem(itemId) {
      return get.items.byItemId(itemId, false, false) || {}
    }
  },
}
</script>

<style scoped lang="scss">

</style>