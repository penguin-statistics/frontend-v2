<template>
  <div>
    <v-switch
      v-model="hideTime"
      v-haptic
      dense
      hide-details
      :label="$t('query.result.hideTime')"
      class="mx-2 mt-6 mb-0"
    />

    <v-card
      v-for="table in tables"
      :key="table.itemId"
      class="my-2"
    >
      <v-card-title>
        <ItemById :id="table.itemId" />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="table.data"
        :options="options.table"
        :footer-props="options.footer"

        must-sort
        sort-by="start"
        :sort-desc="false"
        :locale="$i18n.locale"
        :hide-default-footer="table.data.length <= 10"

        :mobile-breakpoint="1"

        class="elevation-0 transparentTable container--fluid px-2 font-weight-bold monospace trend-table"

        :class="{'pt-0': $vuetify.breakpoint.xsOnly}"
      >
        <template v-slot:item.start="{ item }">
          {{ item.timeRange }}
        </template>
        <template v-slot:item.percentage="{ item }">
          {{ item.percentageText }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import timeFormatter from '@/utils/timeFormatter'
import ItemById from '@/components/global/ItemById'

export default {
  name: 'QueryResultTrend',
  components: { ItemById },
  props: {
    data: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      options: {
        table: {
          itemsPerPage: 10
        },
        footer: {
          itemsPerPageOptions: [10, 20, 40, -1],
          showCurrentPage: true
        }
      },
      hideTime: false
    }
  },
  computed: {
    tables () {
      const { results, startTime } = this.data.trends
      const interval = this.data.query.interval
      const tables = []
      for (const [itemId, data] of Object.entries(results)) {
        const tableData = []
        for (let index in data.quantity) {
          index = parseInt(index)
          const quantity = data.quantity[index]
          const times = data.times[index]
          const percentage = quantity / times
          const percentageText = isNaN(percentage) ? '--%' : `${(percentage * 100).toFixed(2)}%`

          const start = startTime + (index * interval)
          const end = start + interval

          const timeRange = timeFormatter.dates([start, end], !this.hideTime).join(' ~ ')

          tableData.push({
            start,
            end,
            timeRange,
            quantity,
            times,
            percentage,
            percentageText
          })
        }
        tables.push({
          itemId,
          data: tableData
        })
      }
      return tables
    },
    headers () {
      return [
        {
          text: this.$t('stats.headers.timeRange'),
          value: 'start',
          align: 'left',
          sortable: true,
          width: '140px'
        },
        {
          text: this.$t('stats.headers.quantity'),
          value: 'quantity',
          align: 'left',
          sortable: true,
          width: '85px'
        },
        {
          text: this.$t('stats.headers.times'),
          value: 'times',
          align: 'left',
          sortable: true,
          width: '85px'
        },
        {
          text: this.$t('stats.headers.percentage'),
          value: 'percentage',
          align: 'left',
          sortable: true,
          width: '100px'
        }
      ]
    }
  },
  methods: {
    formatDate (item) {
      const start = item.start
      const end = item.end

      return timeFormatter.startEnd(start, end)
    }
  }
}
</script>

<style scoped>

</style>
