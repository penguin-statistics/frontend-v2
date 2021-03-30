<template>
  <span
    v-if="!$vuetify.breakpoint.xs"
    class="backdrop-name font-weight-black display-4 px-12 py-6"
  >
    {{ content }}
  </span>
</template>

<script>
export default {
  name: 'BackdropName',
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.backdrop-name {
  position: absolute;
  bottom: 0;
  right: 0;
  color: rgba(255, 255, 255, .1);
  user-select: none;
  z-index: 0;
  letter-spacing: -.10em !important;
  word-break: break-all;
  overflow: hidden;
  pointer-events: none;
  text-align: right;
}
.theme--light .backdrop-name {
  color: rgba(0, 0, 0, .1);
}
</style>
