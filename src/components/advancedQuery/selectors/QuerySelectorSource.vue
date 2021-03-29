<template>
  <v-select
    :value="value"
    hide-details
    prepend-icon="mdi-database"

    :menu-props="{ offsetY: true }"
    filled
    :items="sources"
    :label="$t('dataSource.switch')"
    transition="slide-y-transition"
    @input="e => $emit('input', e)"
  >
    <template #item="{item}">
      {{ $t('dataSource.' + item) }}
      <span class="monospace ml-2">
        {{ item }}
      </span>
      <v-spacer />
      <v-icon v-if="item === value">
        mdi-check
      </v-icon>
    </template>

    <template #selection="{item}">
      {{ $t('dataSource.' + item) }}
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'QuerySelectorSource',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selected: this.$store.getters['dataSource/source'],
      sources: ['global', 'personal']
    }
  }
}
</script>

<style scoped>

</style>
