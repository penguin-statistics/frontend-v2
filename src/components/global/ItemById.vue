<template>
  <div class="d-flex align-center">
    <Item
      :ratio="ratio"
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
import get from '@/utils/getters'
import strings from '@/utils/strings'
import Item from '@/components/global/Item'

export default {
  name: 'ItemById',
  components: { Item },
  props: {
    id: {
      type: String,
      required: true
    },
    ratio: {
      type: Number,
      default () {
        return 0.4
      }
    }
  },
  computed: {
    item () {
      return get.items.byItemId(this.id, false, false) || {}
    },
    name () {
      return strings.translate(this.item, 'name')
    }
  }
}
</script>

<style scoped>

</style>
