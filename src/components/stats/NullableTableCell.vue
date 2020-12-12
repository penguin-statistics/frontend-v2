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
