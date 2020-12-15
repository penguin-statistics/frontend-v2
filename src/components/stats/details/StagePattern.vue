<template>
  <div>
    <v-card-title class="py-4 pl-0">
      <v-icon left>
        mdi-cube
      </v-icon>
      掉落组合
    </v-card-title>
    <div class="d-inline-flex flex-row align-start">
      <FactTableItem
        title="统计区间"
        content-class="monospace"
        :content="timeRange"
      />
      <FactTableItem
        title="样本数"
        content-class="monospace"
        :content="quantity"
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
import get from '@/utils/getters'
import StagePatternTable from "@/components/stats/details/StagePatternTable";
import StagePatternPieChart from "@/components/stats/details/StagePatternPieChart";
import StagePatternError from "@/components/stats/details/StagePatternError";
import timeFormatter from "@/utils/timeFormatter";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";

export default {
  name: "StagePattern",
  components: {FactTableItem, StagePatternError, StagePatternPieChart, StagePatternTable},
  props: {
    stageId: {
      type: String,
      default: () => null,
    },
  },
  data() {
    return {
      activeIndex: null,
      tabs: [
        {
          id: "pie",
          text: 'pattern.view.pie',
          icon: 'mdi-chart-pie'
        },
        {
          id: "table",
          text: 'pattern.view.table',
          icon: 'mdi-table'
        },
      ]
    }
  },
  computed: {
    patterns() {
      return [...get.patterns.byStageId(this.stageId)]
          .sort((a, b) => b.percentage - a.percentage)
          .map((el, i) => ({...el, i: i + 1}))
    },
    quantity() {
      return (this.patterns[0] || {}).times
    },
    timeRange() {
      const patterns = this.patterns
      if (!patterns || !patterns.length || !patterns[0]) return ''
      return timeFormatter.startEnd(patterns[0].start, patterns[0].end)
    }
  },
}
</script>

<style scoped>

</style>