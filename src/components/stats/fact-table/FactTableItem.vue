<template>
  <div class="d-block mr-5">
    <div class="subtitle-2 grey--text mb-1">
      <slot
        v-if="!!$slots.title"
        name="title"
      />
      <template
        v-else
      >
        {{ title }}
      </template>
    </div>
    <div class="headline mt-n1">
      <slot
        v-if="!!$slots.content"
        name="content"
      />
      <span
        v-else
        :class="contentClass"
      >
        {{ content }}
      </span>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */

export default {
  name: "FactTableItem",
  props: {
    title: {
      default: () => ""
    },
    content: {
      default: () => ""
    },
    contentClass: {
      type: String,
      default: () => ""
    }
  }
}
</script>

<style scoped>

</style>