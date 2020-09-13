<template>
  <v-card class="d-flex fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="pa-5 py-10 text-center"
      >
        <v-img
          :src="currentSrc"
          aspect-ratio="1"
          max-height="160"
          max-width="160"
          contain
          class="my-6 mx-auto"
        >
          <template v-slot:placeholder>
            <v-progress-circular
              indeterminate
              :size="48"
              :width="4"
            />
          </template>
        </v-img>

        <h1 class="overline">
          {{ overline }}
        </h1>
        <h1 class="title mb-6">
          {{ title }}
        </h1>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import randomUtils from "@/utils/randomUtils";
import CDN from "@/mixins/CDN";

export default {
  name: "Preloader",
  mixins: [CDN],
  props: {
    title: {
      type: String,
      required: true
    },
    overline: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      preloaders: [
        "croissant", "exusiai", "sora", "texas"
      ]
    }
  },
  computed: {
    currentPreloaderIndex () {
      return randomUtils.randomInt(this.preloaders.length - 1)
    },
    currentSrc() {
      return this.cdnDeliver(`/images/preloaders/${this.preloaders[this.currentPreloaderIndex]}.gif`)
    }
  }
}
</script>

<style scoped>

</style>