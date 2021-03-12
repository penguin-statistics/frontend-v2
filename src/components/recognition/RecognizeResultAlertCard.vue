<template>
  <div>
    <v-card
      v-for="(alert, index) in alertsWithMessage"
      :key="`alert-${index}`"
      dark
      :class="`pa-2 pl-8 ${color} mt-2 position-relative overflow-hidden`"
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
        style="font-size: 10px; line-height: 1.5"
      >
        <span class="monospace-pure degraded-opacity">
          {{ alert.count > 1 ? Array(alert.count).fill(alert.type).join('; ') : alert.type }}
        </span>
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
    color: {
      type: String,
      default: () => ("red darken-3")
    },
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    alertsWithMessage() {
      const map = {}
      const deduplicated = []
      for (const alert of this.alerts) map[alert.type] ? map[alert.type] += 1 : map[alert.type] = 1
      for (const [type, val] of Object.entries(map)) deduplicated.push({
        type,
        count: val
      })
      return deduplicated.map(el => ({...el, ...this.message(el.type)}));
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