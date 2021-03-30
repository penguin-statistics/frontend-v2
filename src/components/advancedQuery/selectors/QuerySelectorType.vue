<template>
  <div class="d-flex mx-auto justify-center align-center">
    <v-btn-toggle
      class="text-center justify-center"
      :value="value"
      mandatory
      @change="e => $emit('input', e)"
    >
      <v-btn
        v-haptic
        value="matrix"
        small
      >
        <v-icon
          left
          small
        >
          mdi-table
        </v-icon>
        {{ $t('query.type.matrix') }}
      </v-btn>

      <v-btn
        v-haptic
        value="trend"
        small
      >
        <v-icon
          left
          small
        >
          mdi-chart-areaspline
        </v-icon>
        {{ $t('query.type.trend') }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
export default {
  name: 'QuerySelectorType',
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
