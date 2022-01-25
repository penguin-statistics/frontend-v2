<template>
  <v-dialog
    persistent
    :value="value"
    max-width="500"
    @input="e => $emit('input', e)"
  >
    <v-card>
      <v-card-title class="title pa-4 slash-strip--warning-transparent d-flex flex-column text-left align-start">
        <v-icon>mdi-alert</v-icon>
        <span class="mt-2">{{ $t('report.specialSideStory.dialog.title') }}</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <h3 class="title mb-2">
          <i18n path="report.dossolesHoliday.title.tmpl">
            <strong class="text-glow">{{ $t('report.dossolesHoliday.title.inner') }}</strong>
          </i18n>
        </h3>
        <p>{{ $t('report.dossolesHoliday.content') }}</p>
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