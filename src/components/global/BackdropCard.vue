<template>
  <v-card
    :hover="hover"
    class="text-center backdrop-card transition-all"
    :class="{'backdrop-card--hoverable': hover, 'backdrop-card--darken': darken, 'pa-4': !dense}"
    v-bind="$attrs"
  >
    <div class="backdrop-icon transition-all">
      <slot name="backdrop" />
    </div>

    <slot />
  </v-card>
</template>

<script>
  export default {
    name: "BackdropCard",
    props: {
      hover: {
        type: Boolean,
        default () {
          return false
        }
      },
      darken: {
        type: Boolean,
        default () {
          return false
        }
      },
      dense: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
  }
</script>

<style scoped>
  .backdrop-card {
    overflow: hidden;
  }
  .backdrop-icon {
    position: absolute;
    bottom: -2rem;
    right: 0;
    user-select: none;
    z-index: 0;
    opacity: 0.05;
  }
  .backdrop-card--hoverable:hover .backdrop-icon {
    opacity: 0.125;
    bottom: -1.7rem;
  }

  .backdrop-card--darken .backdrop-icon {
    opacity: 0.1;
  }
  .backdrop-card--hoverable.backdrop-card--darken:hover .backdrop-icon {
    opacity: 0.2;
  }

  ::v-deep .backdrop-icon > * {
    font-size: 8rem;
  }
</style>