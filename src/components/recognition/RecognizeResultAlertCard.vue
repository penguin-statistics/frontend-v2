<template>
  <div>
    <v-card
      v-for="(alert, index) in alertsWithMessage"
      :key="`alert-${index}`"
      dark
      :class="`pa-2 pl-8 ${alert.color} mt-2 position-relative overflow-hidden`"
    >
      <v-icon
        x-large
        style="position: absolute; left: -10px; top: -6px; opacity: .4"
      >
        {{ icon }}
      </v-icon>
      <div class="text-break">
        {{ alert.title }}
        <span
          v-if="alert.count > 1"
          class="ml-1 font-weight-bold"
        >
          ×{{ alert.count }}
        </span>
      </div>
      <div
        v-if="alert.subtitle"
        class="subtitle-2 degraded-opacity"
      >
        {{ alert.subtitle }}
      </div>
      <div
        class="monospace-pure degraded-opacity"
        style="font-size: 10px; line-height: 1.5"
      >
        {{ alert.what }}
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "RecognizeResultAlertCard",
  props: {
    alerts: {
      type: Array,
      default: () => ([])
    },
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    alertsWithMessage() {
      const deduplicated = []
      for (const alert of this.alerts) {
        const found = deduplicated.find(el => el.what === alert.what)
        if (found) {
          found.count += 1
          continue
        }
        deduplicated.push({
          count: 1,
          color: alert.type === 'WARNING' ? 'warning darken-2' : 'red darken-3',
          ...alert
        })
      }
      return deduplicated.map(el => ({...el, ...this.message(el.what)}));
    }
  },
  methods: {
    message(alertType) {
      const m = this.$t('report.recognition.exceptions.' + alertType);
      if (typeof m === 'object') return m
      return {
        title: m
      }
    }
  },
}
</script>

<style scoped>

</style>