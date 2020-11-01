<template>
  <div v-if="items">
    <div
      v-for="(category, name) in items"
      :key="name"
      class="d-flex flex-column"
    >
      <div class="ml-2 my-2">
        {{ $t(`items.categories.${name}`) }}
      </div>
      <div class="d-flex flex-wrap justify-start">
        <div
          v-for="item in category"
          :key="item.itemId"
          class="d-flex flex-column align-center item-list-item-wrapper"
        >
          <div
            class="item-list-item-avatar cursor-pointer"
            @click="$emit('select', item.itemId)"
          >
            <Item
              :item="item"
              disable-link
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import get from "@/utils/getters";
  import Item from "@/components/global/Item";

  export default {
    name: "ItemSelector",
    components: {Item},
    // props: {
    //   items: {
    //     type: Array,
    //     required: true
    //   }
    // },
    computed: {
      items () {
        const all = get.items.all();
        const categories = ["MATERIAL", "CARD_EXP", "CHIP", "FURN", "ACTIVITY_ITEM"];
        const results = {};
        let already = [];
        for (const category of categories) {
          // if (category === "OTHERS") {
          //   // "others"
          //   results[category] = all.filter(el => already.find(e => e.itemId === el.itemId));
          //   results[category].sort((a, b) => {
          //     return a.sortId - b.sortId
          //   });
          // } else {
            // literal types
            results[category] = all.filter(el => el.itemType === category);
            // move 3003 to the last member
            results[category].sort((a, b) => {
              if (a.itemId === "3003") return 1;
              if (b.itemId === "3003") return -1;
              return a.sortId - b.sortId;
            });
            already = [...already, ...results[category]]
          // }
        }
        return results;
      }
    }
  }
</script>

<style scoped>
  .item-list-item-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 62px;
    margin: 4px 0;
  }
  .item-list-wrapper {
    display: flex;
    flex-direction: column;
  }
  .item-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
</style>