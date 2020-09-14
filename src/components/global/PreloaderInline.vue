<template>
  <v-img
    :src="currentSrc"
    :aspect-ratio="1"
    :height="size.image"
    :width="size.image"
    contain
  >
    <template v-slot:placeholder>
      <div class="d-flex fill-height align-center justify-center">
        <v-progress-circular
          indeterminate
          :size="size.pending"
          :width="5"
        />
      </div>
    </template>
  </v-img>
</template>

<script>
import randomUtils from "@/utils/randomUtils";
import CDN from "@/mixins/CDN";

export default {
  name: "PreloaderInline",
  mixins: [CDN],
  props: {
    small: {
      type: Boolean,
      default: false
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
    },
    size () {
      if (this.small) {
        return {
          image: 64,
          pending: 32
        }
      } else {
        return {
          image: 160,
          pending: 48
        }
      }
    }
  }
}
</script>

<style scoped>

</style>