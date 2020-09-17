<template>
  <v-card class="d-flex fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="px-6 py-12 text-center"
      >
        <PreloaderInline class="mx-auto mb-6" />

        <h1 class="overline">
          {{ overline }}
        </h1>
        <h1 class="title">
          {{ title }}
        </h1>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PreloaderInline from "@/components/global/PreloaderInline";

export default {
  name: "PreloaderCard",
  components: {PreloaderInline},
  props: {
    title: {
      type: String,
      required: true
    },
    overline: {
      type: String,
      required: true
    },
  }
}
</script>

<style scoped>

</style>