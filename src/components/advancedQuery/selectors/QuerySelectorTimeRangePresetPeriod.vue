<template>
  <div class="mx-1">
    <v-card
      v-for="(card, i) in cards"
      :key="i"
      v-haptic
      class="d-flex flex-column cursor-pointer time-range-card"
      :elevation="0"
      :class="{'time-range--left': i === 0 && cards.length !== 1, 'time-range--right': i === 1}"
      ripple
      @click="$emit('update:selection', card[card.type])"
    >
      <v-card-title class="subtitle-2 px-3 pa-2">
        {{ label(card) }}
        <span class="overline ml-1">{{ $t('query.selector.timeRange.presets.' + card.type) }}</span>
      </v-card-title>
      <v-card-subtitle class="px-3 pa-2">
        {{ time(card) }}
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
  import strings from "@/utils/strings";
  import timeFormatter from "@/utils/timeFormatter";
  import Theme from "@/mixins/Theme";

  export default {
    name: "QuerySelectorTimeRangePresetPeriod",
    mixins: [Theme],
    props: {
      period: {
        type: Object,
        required: true
      },
    },
    computed: {
      cards () {
        const period = this.period
        if (period.start && period.end) {
          const start = Object.assign({type: "start"}, period)
          const end = Object.assign({type: "end"}, period)
          return [start, end]
        } else {
          return [Object.assign({type: "start"}, period)]
        }
      }
    },
    methods: {
      label (card) {
        return strings.translate(card, "label");
      },
      time (card) {
        return timeFormatter.date(card[card.type], true, false)
      },
    },
  }
</script>

<style scoped>
.theme--light .time-range-card {
  background-color: #bbdefb !important
}
.theme--dark .time-range-card {
  background-color: #0d47a1 !important
}
.time-range--left {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-right: 1px solid rgba(255, 255, 255, .1) !important;
}
.theme--light .time-range--left {
  border-right: 1px solid rgba(0, 0, 0, .1) !important;
}
.time-range--right {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>