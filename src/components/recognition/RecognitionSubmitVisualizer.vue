<template>
  <v-card
    ref="cardWrapper"
    v-resize="setHeightResize"
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
        ref="cardInner"
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
              :value="(submittedTotal.total / total) * 100"
              stream
              height="28"
              striped
              rounded
            >
              {{ submittedTotal.total }} / {{ total }} ({{
                ((submittedTotal.total / total) * 100).toFixed(0)
              }}%)
            </v-progress-linear>
          </div>
        </div>
      </div>
      <div
        v-else
        ref="cardInner"
        key="uploaded"
        class="d-flex flex-column position-relative align-center justify-center"
      >
        <div class="py-8 px-6">
          <v-icon
            x-large
            :color="submittedTotal.failed ? 'warning' : 'green'"
          >
            {{ submittedTotal.failed ? 'mdi-progress-alert' : 'mdi-check' }}
          </v-icon>

          <h1 class="mt-3 mb-2 headline">
            {{ $t('report.recognition.report.' + (submittedTotal.failed ? 'partialSucceeded' : 'allSucceeded'), {count: submittedTotal.succeeded}) }}
          </h1>
          <span
            v-if="submittedTotal.failed"
            class="subtitle-1"
          >{{ $t('report.recognition.report.partialFailed', {count: submittedTotal.failed}) }}</span>
          <ul
            v-if="submittedTotal.failed"
            class="markdown-content my-2"
          >
            <li
              v-for="msg in $t('report.recognition.report.partialFailedDesc').split('\n')"
              :key="msg"
              v-marked
              v-text="msg"
            />
          </ul>
          <span
            v-if="submittedTotal.succeeded > 0"
            class="caption"
          >{{ $t('report.recognition.report.caption') }}</span>
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
      return {
        total: this.submitted.reduce((a, b) => a + Math.abs(b), 0) || 0,
        succeeded: this.submitted.filter(el => el > 0).reduce((a, b) => a + b, 0) || 0,
        failed: - this.submitted.filter(el => el < 0).reduce((a, b) => a + b, 0) || 0
      }
    }
  },
  methods: {
    setHeight(el) {
      if (!el) return
      this.$nextTick(() => {
        this.$refs.cardWrapper.$el.style.height = (el.getBoundingClientRect().height) + "px"
      })
    },
    setHeightResize() {
      const el = this.$refs.cardInner
      this.$nextTick(() => {
        this.$refs.cardWrapper.$el.style.height = (el.getBoundingClientRect().height) + "px"
      })
    }
  },
}
</script>

<style scoped>

</style>
