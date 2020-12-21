<template>
  <div v-if="items">
    <div
      v-for="(category, name) in items"
      :key="name"
      class="d-flex flex-column"
    >
      <div class="ml-2 my-2">
        {{ $t(`item.categories.${name}`) }}
      </div>
      <div class="d-flex flex-wrap justify-start">
        <div
          v-for="item in category"
          :key="item.itemId"
          class="d-flex flex-column align-center item-list-item-wrapper"
        >
          <v-badge
            bordered
            bottom
            overlap

            :offset-x="16"
            :offset-y="20"
            :color="states[item.itemId] ? 'green darken-1' : 'red darken-1'"
            :icon="states[item.itemId] ? 'mdi-check' : 'mdi-close'"
            :value="states[item.itemId]"
            class="item-list-item-avatar"
          >
            <span
              class="transition-all cursor-pointer"
              :style="{'filter': states[item.itemId] ? 'drop-shadow(0 0 5px rgba(255, 255, 255, .7))' : 'none'}"
              @click.left="select(item.itemId)"
              @click.right.prevent="select(item.itemId, true)"
            >
              <Item
                :item="item"
                disable-link
              />
            </span>
          </v-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import get from "@/utils/getters";
  import Item from "@/components/global/Item";

  export default {
    name: "MultiItemSelector",
    components: {Item},
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    computed: {
      states () {
        const states = {};
        for (const item of get.items.all(false, false)) {
          // have item or not = has been selected or not
          this.$set(states, item.itemId, !!~this.value.indexOf(item.itemId))
        }
        return states
      },

      items () {
        const all = get.items.all(false, false);
        const categories = ["MATERIAL", "CARD_EXP", "FURN", "ACTIVITY_ITEM"];
        const results = {};
        for (const category of categories) {
          results[category] = all.filter(el => el.itemType === category);
          // move 3003 to the last member
          results[category].sort((a, b) => {
            if (a.itemId === "3003") return 1;
            if (b.itemId === "3003") return -1;
            return a.sortId - b.sortId;
          });
        }
        return results;
      }
    },
    methods: {
      select (itemId, forceFalse = false) {
        if (~this.value.indexOf(itemId) || forceFalse) {
          this.$emit('input', this.value.filter(el => el !== itemId))
        } else {
          this.$emit('input', [...this.value, itemId])
        }
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