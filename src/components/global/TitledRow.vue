<template>
  <v-row
    class="d-flex flex-row"
    :class="{'my-3 mx-6': !dense}"
    align="center"
    :justify="header ? 'end' : null"
  >
    <div :class="{'title': !dense, 'subtitle-2': dense}">
      <slot name="header" />
    </div>
    <v-divider
      vertical
      :class="header ? 'mx-1' : 'mx-4'"
    />
    <div
      class="d-flex flex-wrap"
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
      header: {
        type: Boolean,
        default: () => false,
      }
    },
  }
</script>

<style scoped>

</style>