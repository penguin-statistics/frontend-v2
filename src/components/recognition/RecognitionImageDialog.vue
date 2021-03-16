<template>
  <v-dialog
    v-model="dialog"
    max-width="1800px"
    max-height="80vh"
    :overlay-opacity="0.8"
    overlay-color="rgba(0, 0, 0, 1)"
  >
    <v-card
      v-ripple="false"
      style="cursor: zoom-out"
      @click="dialog = false"
    >
      <img
        :src="internalSrc"
        alt="enlarged"
        class="mx-auto d-block"
        style="max-width: 100%; max-height: 80vh"
      >
      <v-card-subtitle class="text-center mt-4">
        {{ $t("report.recognition.tips.copyImage") }}
      </v-card-subtitle>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RecognitionImageDialog",
  props: {
    src: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      dialog: false,
      internalSrc: ''
    }
  },
  watch: {
    src(val) {
      if (val !== '') {
        this.dialog = true
        this.internalSrc = val
      }
    },
    dialog(val) {
      if (!val) {
        this.internalSrc = ''
        this.$emit('close')
      }
    }
  },
}
</script>

<style scoped>

</style>