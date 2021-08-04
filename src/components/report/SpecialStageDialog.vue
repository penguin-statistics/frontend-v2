<template>
  <v-dialog
    persistent
    :value="value"
    max-width="500"
    @input="e => $emit('input', e)"
  >
    <v-card>
      <v-card-title class="title pa-4 slash-strip--warning">
        <v-icon>mdi-alert</v-icon>
        <span class="mt-2">{{ $t('report.specialSideStory.dialog.title') }}</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <h3 class="title mb-2">
          请<strong class="text-glow">确保集齐所有标志物</strong>后再进行汇报
        </h3>
        <p>根据初步数据统计推测，标志物掉率计算事件可能不满足独立前提，即：在所有标志物被集齐前、其掉率可能会产生动态变化。因此，我们决定仅收集集齐所有标志物后的掉率数据</p>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-haptic
          color="error"
          text
          @click="$emit('cancel')"
        >
          {{ $t('report.specialSideStory.dialog.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          v-haptic
          color="primary"
          depressed
          :disabled="timerValue > 0"
          @click="$emit('confirm')"
        >
          {{ timerValue > 0
            ? $t('report.specialSideStory.dialog.confirmTimerPending', {timer: timerValue})
            : $t('report.specialSideStory.dialog.confirmTimerDone')
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
name: "SpecialStageDialog",
  props: {
    value: Boolean
  },
  data() {
    return {
      timer: null,
      timerValue: 10
    }
  },
  watch: {
    value(val) {
      if (val) this.start()
      else this.stop()
    }
  },
  methods: {
    start() {
      this.timerValue = 10
      this.timer = setInterval(() => {
        if (this.timerValue > 0) this.timerValue -= 1
        else this.stop()
      }, 1000)
    },
    stop () {
      clearInterval(this.timer)
      this.timer = null
    }
  },
}
</script>

<style scoped>

</style>