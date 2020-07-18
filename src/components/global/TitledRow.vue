<template>
  <v-row
    class="flex-row"
    :class="{'my-3 mx-6': !dense}"
    align="center"
  >
    <span :class="{'title': !dense, 'subtitle-2': dense}">
      <slot name="header" />
    </span>
    <v-divider
      vertical
      class="mx-4"
    />
    <div
      class="d-flex flex-grow-1 flex-wrap"
      :class="{'flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row': reactive}"
    >
      <slot name="content" />
    </div>
  </v-row>
</template>

<script>
  export default {
    name: "TitledRow",
    props: {
      dense: {
        type: Boolean,
        default () {
          return false
        }
      },
      reactive: {
        type: Boolean,
        default () {
          return false
        }
      },
    },
  }
</script>

<style scoped>

</style>