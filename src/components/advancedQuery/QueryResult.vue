<template>
  <div class="mx-2">
    <OffTitle
      :content="title"
      small
    />
    <v-card
      class="pa-2"
      :class="{'bkop-light': !isTrend, 'background-transparent': isTrend}"
      :outlined="isTrend"
    >
      <v-card-text v-if="!data">
        <v-alert
          type="info"
          outlined
          border="left"
          class="mb-0"
        >
          {{ $t('query.result.empty') }}
        </v-alert>
      </v-card-text>
      <DataTable
        v-else-if="type === 'matrix'"
        :items="data"
        type="stage"
      />
      <QueryResultTrend
        v-else-if="type === 'trend'"
        :data="data"
      />
    </v-card>
  </div>
</template>

<script>
import DataTable from '@/components/stats/DataTable'
import get from '@/utils/getters'
import OffTitle from '@/components/global/OffTitle'
import QueryResultTrend from '@/components/advancedQuery/QueryResultTrend'

const calculateMatrix = el => {
  const stage = get.stages.byStageId(el.stageId)
  el.stage = stage
  el.zone = get.zones.byZoneId(el.stage.zoneId, false)

  el.item = get.items.byItemId(el.itemId, false, false)

  el.percentage = (el.quantity / el.times)
  el.percentageText = `${(el.percentage * 100).toFixed(2)}%`

  el.apPPR = (stage.apCost / el.percentage).toFixed(2)
  return el
}

export default {
  name: 'QueryResult',
  components: { QueryResultTrend, OffTitle, DataTable },
  props: {
    result: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    isTrend () {
      return this.type === 'trend'
    },
    data () {
      if (this.type === 'matrix') {
        return this.result.result.matrix.map(calculateMatrix)
      } else if (this.type === 'trend') {
        const stageId = this.result.query.stage
        if (!(this.result.result.trend && this.result.result.trend[stageId])) return null
        const data = this.result.result.trend[stageId]

        return {
          trends: data,
          query: this.result.query
        }
      } else {
        return null
      }
    },
    title () {
      if (this.index === 0) {
        return this.$t('query.result.main')
      } else {
        return this.$t('query.result.comparison', { index: this.index })
      }
    }
  }
}
</script>

<style scoped>

</style>
