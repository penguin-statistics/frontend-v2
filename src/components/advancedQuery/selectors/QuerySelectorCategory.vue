<template>
  <v-select
    :value="value"
    hide-details
    prepend-icon="mdi-filter-variant"

    :menu-props="{ offsetY: true }"
    filled
    :items="categories"
    :label="$t('matrixCategory.switch')"
    transition="slide-y-transition"
    @input="e => $emit('input', e)"
  >
    <template #item="{item}">
      {{ $t('matrixCategory.' + item + ".label") }}
      <v-tooltip
        v-if="item !== 'all'"
        right
        max-width="300"
      >
        <template #activator="{ on }">
          <v-icon
            class="ml-2 degraded-opacity"
            size="18"
            v-on="on"
          >
            mdi-information
          </v-icon>
        </template>
        <span>
          {{ $t('matrixCategory.' + item + ".tooltip") }}
        </span>
      </v-tooltip>
      <v-spacer />
      <v-icon v-if="item === value">
        mdi-check
      </v-icon>
    </template>

    <template #selection="{item}">
      {{ $t('matrixCategory.' + item + ".label") }}
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'QuerySelectorCategory',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selected: this.$store.getters['dataSource/category'],
      categories: ['all', 'automated', 'manual']
    }
  }
}
</script>

<style scoped>

</style>
