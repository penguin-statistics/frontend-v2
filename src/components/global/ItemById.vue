<template>
  <div class="d-flex align-center">
    <Item
      :ratio="0.4"
      :item="item"
      v-bind="$props"
      class="mr-2"
      disable-tooltip
      disable-link
    />
    {{ name }}
  </div>
</template>

<script>
  import get from "@/utils/getters"
  import strings from "@/utils/strings";
  import Item from "@/components/global/Item";

  export default {
    name: "ItemById",
    components: {Item},
    props: {
      id: {
        type: String,
        required: true
      },
    },
    computed: {
      item() {
        return get.items.byItemId(this.id) || {}
      },
      name () {
        return strings.translate(this.item, "name")
      }
    },
  }
</script>

<style scoped>

</style>