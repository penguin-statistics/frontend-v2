<template>
  <v-tooltip
    max-width="300"
    top
    transition="slide-y-reverse-transition"
  >
    <template #activator="{ on, attrs }">
      <span
        class="tooltip-header position-relative"
        v-bind="attrs"
        v-on="on"
      >
        {{ name }}
        <v-icon
          x-small
          class="tooltip-header-icon"
        >mdi-information</v-icon>
      </span>
    </template>
    <span
      v-marked
      class="no-paragraph-extra-margin"
    >
      <slot />
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'HeaderWithTooltip',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.tooltip-header-icon {
  opacity: .2;
  position: absolute !important;
  transform: translate(-4px, -9px) !important;
}
.tooltip-header:hover .tooltip-header-icon {
  opacity: .9
}
</style>
