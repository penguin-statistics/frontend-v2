<template>
  <td
    v-bind="$attrs"
    :class="cellValue.class"
    v-on="$listeners"
  >
    {{ cellValue.value }}
  </td>
</template>

<script>
export default {
name: "NullableTableCell",
  // reason to disable prop type check is that `value` could be any type that's `toString()`-able
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'transformer'],
  computed: {
    cellValue () {
      if (
          !this.transformed ||
          this.transformed === 99 ||
          ['NaN', 'Infinity'].includes(this.transformed)
      ) return {
        class: 'grey--text',
        value: '——'
      }
      return {
        value: this.transformed
      }
    },
    transformed() {
      if (this.transformer) return this.transformer.call(null, this.value)
      return this.value
    }
  },
}
</script>
