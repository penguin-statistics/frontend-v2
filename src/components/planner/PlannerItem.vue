<template>
  <div
    class="d-flex align-center planner-item"
    :class="{'planner-item--dense': $vuetify.breakpoint.smAndDown}"
  >
    <Item
      :ratio="ratio"
      :item="item"
      v-bind="$props"
      class="planner-item__item"
      disable-tooltip
      disable-link
    />
    <span class="planner-item__name">
      {{ name }}
    </span>
  </div>
</template>

<script>
  import get from "@/utils/getters"
  import strings from "@/utils/strings";
  import Item from "@/components/global/Item";

  export default {
    name: "PlannerItem",
    components: {Item},
    props: {
      id: {
        type: String,
        required: true
      },
      ratio: {
        type: Number,
        default () {
          return 0.7
        }
      }
    },
    computed: {
      item() {
        return get.items.byItemId(this.id, false, false) || {}
      },
      name () {
        return strings.translate(this.item, "name")
      }
    },
  }
</script>

<style scoped lang="scss">
.planner-item {
  &--dense {
    flex-direction: column !important;
    .planner-item__item {
      margin-bottom: 4px;
      margin-right: 0;
    }
  }
  &__item {
    margin-bottom: 0;
    margin-right: 8px;
  }
}
</style>