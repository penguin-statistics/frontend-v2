<template>
  <div class="mb-5">
    <v-card-title class="py-4 pl-0">
      <v-icon left>
        mdi-lock-pattern
      </v-icon>
      {{ $t('pattern.name') }}
    </v-card-title>
    <div class="d-inline-flex flex-row align-start">
      <FactTableItem
        :title="$t('stats.headers.timeRange')"
        content-class="monospace"
        :content="timeRange"
      />
      <FactTableItem
        :title="$t('stats.headers.times')"
        content-class="monospace"
        :content="times"
      />
    </div>

    <StagePatternError v-if="patterns && patterns.length === 0" />
    <v-row v-else>
      <v-col
        cols="12"
        md="6"
      >
        <StagePatternPieChart
          :patterns="patterns"
          :active.sync="activeIndex"
          :is-recruit="stageId === 'recruit'"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <StagePatternTable
          :patterns="patterns"
          :active.sync="activeIndex"
        />
      </v-col>
    </v-row>

    <!--    <v-tabs-->
    <!--      v-else-->
    <!--      v-model="tab"-->
    <!--      grow-->
    <!--      centered-->
    <!--      class="elevated-tab"-->
    <!--    >-->
    <!--      <v-tabs-slider />-->
    <!--      <v-tab-->
    <!--        v-for="t in tabs"-->
    <!--        :key="t.id"-->
    <!--      >-->
    <!--        <v-icon left>-->
    <!--          {{ t.icon }}-->
    <!--        </v-icon>-->
    <!--        {{ $t(t.text) }}-->
    <!--      </v-tab>-->
    <!--      <v-tab-item>-->
    <!--        <v-row>-->
    <!--          <v-col cols="6">-->
    <!--            <StagePatternPieChart :patterns="patterns" />-->
    <!--          </v-col>-->
    <!--          <v-col cols="6">-->
    <!--            <StagePatternTable :patterns="patterns" />-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--      </v-tab-item>-->
    <!--      <v-tab-item>-->
    <!--        <StagePatternTable :patterns="patterns" />-->
    <!--      </v-tab-item>-->
    <!--    </v-tabs>-->
  </div>
</template>

<script>
import StagePatternError from '@/components/stats/details/StagePatternError'
import StagePatternPieChart from '@/components/stats/details/StagePatternPieChart'
import StagePatternTable from '@/components/stats/details/StagePatternTable'
import FactTableItem from '@/components/stats/fact-table/FactTableItem'
import get from '@/utils/getters'
import timeFormatter from '@/utils/timeFormatter'

export default {
  name: 'StagePattern',
  components: {FactTableItem, StagePatternError, StagePatternPieChart, StagePatternTable},
  props: {
    stageId: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      activeIndex: null
    }
  },
  computed: {
    patterns() {
      const patterns = [...get.patterns.byStageId(this.stageId)]
          .sort((a, b) => b.percentage - a.percentage)
          .map((el, i) => ({
            ...el,
            pattern: (el.pattern && el.pattern.drops)
                ? el.pattern.drops.map(ell => ({
                  ...ell,
                  item: get.items.byItemId(ell.itemId)
                }))
                : el.pattern,
            i: i + 1
          }))

      const totalQuantity = patterns.reduce((acc, el) => acc + el.quantity, 0)
      const totalTimes = patterns.length ? patterns[0].times : 0
      const othersPercentage = (totalTimes - totalQuantity) / totalTimes * 100

      // add others
      if (totalQuantity >= totalTimes) {
        return patterns
      }

      patterns.push({
        i: patterns.length + 1,
        pattern: '__others__',
        quantity: totalTimes - totalQuantity,
        times: totalTimes,
        percentage: othersPercentage,
        percentageText: `${othersPercentage.toFixed(2)}%`
      })

      return patterns
    },
    times() {
      return (this.patterns[0] || {}).times
    },
    timeRange() {
      const patterns = this.patterns
      if (!patterns || !patterns.length || !patterns[0]) return ''
      return timeFormatter.startEnd(patterns[0].start, patterns[0].end)
    }
  }
}
</script>

<style scoped>

</style>
