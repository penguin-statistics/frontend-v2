<template>
  <v-card
    ref="cardWrapper"
    outlined
    class="background-transparent"
    style="transition: all .225s cubic-bezier(0.165, 0.84, 0.44, 1);"
  >
    <transition
      class="fade-transition"
      @before-enter="setHeight"
    >
      <div
        v-if="state === 'uploading'"
        key="uploading"
        class="d-flex flex-column py-10"
      >
        <div class="d-flex flex-column flex-md-row flex-lg-row flex-xl-row justify-center align-center">
          <PreloaderInline :size="120" />
          <div class="d-flex flex-column py-4 ml-4">
            <h2 class="headline mb-2">
              {{ $t('report.recognition.report.reporting') }}
            </h2>

            <v-progress-linear
              class="quick-transition"
              :value="(submittedTotal / total) * 100"
              stream
              height="28"
              striped
              rounded
            >
              {{ submittedTotal }} / {{ total }} ({{
                ((submittedTotal / total) * 100).toFixed(0)
              }}%)
            </v-progress-linear>
          </div>
        </div>
      </div>
      <div
        v-else
        key="uploaded"
        class="d-flex flex-column position-relative align-center justify-center"
      >
        <div class="py-8 px-6">
          <v-icon
            x-large
            color="green"
          >
            mdi-check
          </v-icon>

          <h1 class="mt-2 mb-1 headline">
            {{ $t('report.recognition.report.stats', {count: total}) }}
          </h1>
          <span class="caption">{{ $t('report.recognition.report.caption') }}</span>
        </div>
      </div>
    </transition>
  </v-card>
</template>

<script>
import PreloaderInline from "@/components/global/PreloaderInline";
export default {
  name: "RecognitionSubmitVisualizer",
  components: {PreloaderInline},
  props: {
    state: {
      type: String,
      default: () => 'pending'
    },
    submitted: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: () => -1
    }
  },
  computed: {
    submittedTotal() {
      return this.submitted.reduce((a, b) => a + b, 0) || -1;
    }
  },
  methods: {
    setHeight(el) {
      if (!el) return
      this.$nextTick(() => {
        this.$refs.cardWrapper.$el.style.height = (el.getBoundingClientRect().height) + "px"
      })
    }
  },
}
</script>

<style scoped>

</style>