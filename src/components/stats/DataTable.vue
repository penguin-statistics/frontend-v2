<i18n>
{
	"en": {
		"scroll": "Scroll to view details"
	},
	"ja": {
		"scroll": "左右にスクロールでデータを表示"
	},
	"ko": {
		"scroll": "스크롤로 세부 사항을 볼 수 있습니다"
	},
	"zh": {
		"scroll": "左右滑动查看数据"
	}
}
</i18n>

<template>
  <!-- This `fix-position` thing is actually for preventing unauthorized usage of the devtools. -->
  <!-- Yeah I know this is not useful I know, but 99% of the time, that the one who do the copy/pastie jobs and not -->
  <!-- attributing us won't be clever to the point to disable this class. If they are clever like this, they would use -->
  <!-- our api to get clean and most up-to-date data instead of trying to sneak into our web page. ;) -->
  <div :class="{'stat-table-fix-position': !$store.getters['auth/loggedIn']}">
    <v-expansion-panels
      v-if="type === 'item'"
      focusable
      popout
    >
      <v-expansion-panel>
        <v-expansion-panel-header
          v-haptic
          color="background"
        >
          <template #default="{ open }">
            <v-icon
              left
              class="flex-grow-0"
            >
              mdi-filter
            </v-icon>
            {{ $t('stats.filter.title') }}
            <v-spacer />
            <v-fade-transition>
              <v-chip
                v-if="!open"
                small
                :color="filterCount ? 'warning' : 'secondary'"
                class="flex-grow-0 font-weight-bold mr-2 px-4 hidden-xxs-only"
              >
                {{ $tc('stats.filter.indicator', filterCount) }}
              </v-chip>
            </v-fade-transition>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="background">
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
            >
              <TitledRow
                reactive
                dense
                class="mt-3 mb-4 mx-0"
              >
                <template #header>
                  {{ $t('stats.filter.type._name') }}
                </template>
                <template #content>
                  <!--                  <v-checkbox-->
                  <!--                    v-model="dataTable.showMainline"-->
                  <!--                    hide-details-->
                  <!--                    :label="$t('stats.filter.type.showMainline')"-->
                  <!--                    class="mt-0 pt-0"-->
                  <!--                    :class="{'mr-2': $vuetify.breakpoint.smAndUp}"-->
                  <!--                  />-->
                  <v-checkbox
                    v-model="dataTable.showPermanent"
                    v-haptic
                    hide-details
                    :label="$t('stats.filter.type.showPermanent')"
                    class="mt-0 pt-0"
                    :class="{'mr-2': $vuetify.breakpoint.smAndUp}"
                  />
                  <v-checkbox
                    v-model="dataTable.showActivity"
                    v-haptic
                    hide-details
                    :label="$t('stats.filter.type.showActivity')"
                    class="pt-0"
                    :class="{'mt-0 mr-2': $vuetify.breakpoint.smAndUp}"
                  />
                </template>
              </TitledRow>
              <TitledRow
                reactive
                dense
                class="mx-0"
              >
                <template #header>
                  {{ $t('stats.filter.status._name') }}
                </template>
                <template #content>
                  <v-switch
                    v-model="dataTable.onlyOpen"
                    v-haptic
                    hide-details
                    :label="$t('stats.filter.status.onlyOpen')"
                    class="mt-0 pt-0"
                    :class="{'mr-2': $vuetify.breakpoint.smAndUp}"
                  />
                </template>
              </TitledRow>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
              :class="{'mt-2': $vuetify.breakpoint.mdAndUp}"
            >
              <h2 class="subtitle-1">
                {{ $t('stats.filter.overview') }}
              </h2>
              <v-progress-linear
                rounded
                striped
                :value="(filteredData.length / items.length) * 100"
                height="32"
                class="mt-1 elevation-2 font-weight-bold"
                dark
                color="primary accent-4"
              >
                <template #default>
                  {{ $t('stats.filter.stats', {filtered: filteredData.length, total: items.length}) }}
                </template>
              </v-progress-linear>
            </v-col>
          </v-row>
          <!--          <v-row-->
          <!--            align="center"-->
          <!--            justify="start"-->
          <!--          >-->
          <!--            <span class="title">-->
          <!--              数据-->
          <!--            </span>-->
          <!--            <v-divider-->
          <!--              vertical-->
          <!--              class="mx-4"-->
          <!--            />-->
          <!--            <v-text-field>-->
          <!--              <template #append-outer>-->
          <!--                <v-btn outlined>-->
          <!--                  <v-icon>-->
          <!--                    mdi-add-->
          <!--                  </v-icon>-->
          <!--                  添加过滤器-->
          <!--                </v-btn>-->
          <!--              </template>-->
          <!--            </v-text-field>-->
          <!--          </v-row>-->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row
      align="center"
      justify="center"
      class="mt-4 mb-1 hidden-lg-and-up"
    >
      <v-chip
        label
        class="d-flex align-center flex-row caption text--text"
      >
        <v-icon
          :size="20"
          color="text"
          class="scroll-chevron-left mr-1"
        >
          mdi-chevron-double-left
        </v-icon>

        <span
          class="scroll-keyword text--text"
        >{{ $t('scroll') }}</span>

        <v-icon
          :size="20"
          color="text"
          class="scroll-chevron-right ml-1"
        >
          mdi-chevron-double-right
        </v-icon>
      </v-chip>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredData"
      :search="search"
      :options="options.table"
      :footer-props="options.footer"

      must-sort
      sort-by="percentage"
      :sort-desc="true"
      :locale="$i18n.locale"
      :hide-default-footer="items.length <= 10"

      :mobile-breakpoint="0"
      :loading="matrixPending"

      class="elevation-0 transparentTable stat-table container--fluid position-relative"
      :class="{'pt-0': $vuetify.breakpoint.xsOnly}"
    >
      <template #header>
        <div class="stat-table-watermark d-flex align-center justify-start flex-column text-center px-4">
          <h1 :class="{'display-2 mb-4': !$vuetify.breakpoint.smAndUp, 'display-3 mb-6': $vuetify.breakpoint.smAndUp}">
            {{ currentMirrorHostname }}
          </h1>
          <span :class="{'display-1': !$vuetify.breakpoint.smAndUp, 'display-2': $vuetify.breakpoint.smAndUp}">
            {{ $t('app.name') }}
          </span>
        </div>
      </template>

      <template #header.stage.apCost="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.apCost') }}
        </HeaderWithTooltip>
      </template>

      <template #header.quantity="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.quantity') }}
        </HeaderWithTooltip>
      </template>

      <template #header.times="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.times') }}
        </HeaderWithTooltip>
      </template>

      <template #header.percentage="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.percentage') }}
        </HeaderWithTooltip>
      </template>

      <template #header.apPPR="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.apPPR') }}
        </HeaderWithTooltip>
      </template>

      <template #header.stage.minClearTime="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.clearTime') }}
        </HeaderWithTooltip>
      </template>

      <template #header.itemPerTime="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.itemPerTime') }}
        </HeaderWithTooltip>
      </template>

      <template #header.timeRange="{header}">
        <HeaderWithTooltip :name="header.text">
          {{ $t('stats.headerDesc.timeRange') }}
        </HeaderWithTooltip>
      </template>

      <template #item="props">
        <tr :class="{'stat-table__outdated-row': isTimeOutdatedRange(props.item.end)}">
          <template v-if="type === 'stage'">
            <td
              :class="{
                'item-name-td-xs': $vuetify.breakpoint.xsOnly,
                'item-name-td-sm': $vuetify.breakpoint.smOnly
              }"
            >
              <v-row
                align="center"
                class="cursor-pointer item-name pl-1"
                @click="redirectItem(props.item.item.itemId)"
              >
                <Item
                  :item="props.item.item"
                  :ratio="0.6"

                  content-class="item-icon"
                  right
                  :bottom="false"
                  :tooltip-nudge="-40"
                />
                <span
                  style="padding-left: 44px"
                  class="item-name--text"
                >
                  {{ strings.translate(props.item.item, "name") }}
                </span>
                <v-icon
                  x-small
                  class="ml-1 item-name--chevron"
                >
                  mdi-link
                </v-icon>
                <v-divider
                  class="mx-4 item-name--line"
                />
              </v-row>
            </td>
          </template>
          <template v-else>
            <td
              :class="{
                'item-name-td-xs': $vuetify.breakpoint.xsOnly,
                'item-name-td-sm': $vuetify.breakpoint.smOnly
              }"
            >
              <v-row
                align="center"
                class="cursor-pointer item-name"
                @click="redirectStage(props.item.stage.stageId)"
              >
                <v-icon>{{ props.item.zone.icon }}</v-icon>
                <span
                  class="d-flex flex-column ml-2"
                >
                  <span class="overline">
                    {{ getZoneName(props.item.stage) }}
                  </span>
                  <span>
                    {{ strings.translate(props.item.stage, "code") }}
                  </span>
                </span>
                <v-icon
                  x-small
                  class="ml-1 item-name--chevron"
                >
                  mdi-link
                </v-icon>
                <v-divider
                  class="mx-4 item-name--line"
                />
              </v-row>
            </td>
          </template>
          <td
            :class="tableCellClasses"
          >
            {{ props.item.quantity }}
          </td>
          <td
            :class="tableCellClasses"
          >
            {{ props.item.times }}
          </td>
          <td
            class="d-flex align-center justify-start fill-height"
            :class="tableCellClasses"
          >
            <span
              class="mr-2"
            >
              {{ props.item.percentageText }}
            </span>

            <Charts
              v-if="trends"
              :interval="trends && trends.interval"
              :x-start="trends && getTrendsData(props).startTime"
              :show-dialog="expandTrends"
              :data-keys="['quantity']"
              :data="getTrendsData(props).results"
              :charts-id="chartId(props)"
              sparkline-key="quantity"
              sparkline-sub-key="times"

              :meta="meta(props)"
            />
          </td>
          <NullableTableCell
            :value="props.item.apPPR"
            :class="tableCellClasses"
          />

          <template v-if="type === 'item'">
            <NullableTableCell
              :value="props.item.stage.apCost"
              :class="`${tableCellClasses} ${dark ? 'orange--text text--lighten-1' : 'deep-orange--text text--darken-3 font-weight-bold'}`"
            />
            <NullableTableCell
              :value="props.item.stage.minClearTime"
              :transformer="formatDuration"
              :class="tableCellClasses"
            />
          </template>

          <NullableTableCell
            :value="props.item.itemPerTime"
            :transformer="formatDuration"
            :class="tableCellClasses"
          />

          <td
            :class="tableCellClasses"
          >
            {{ formatDate(props.item) }}
          </td>
        </tr>
      </template>
      <!--          <template #item.percentage="{item}">-->
      <!--            <span class="px-0">-->
      <!--              {{ item.percentageText }}-->
      <!--            </span>-->
      <!--          </template>-->
    </v-data-table>
  </div>
</template>

<script>
import strings from '@/utils/strings'
import get from '@/utils/getters'
import Item from '@/components/global/Item'
import { mapGetters, mapState } from 'vuex'
import Theme from '@/mixins/Theme'
import Charts from '@/components/stats/Charts'
import timeFormatter from '@/utils/timeFormatter'
import CDN from '@/mixins/CDN'
import Mirror from '@/mixins/Mirror'
import TitledRow from '@/components/global/TitledRow'
import existUtils from '@/utils/existUtils'
import validator from '@/utils/validator'
import HeaderWithTooltip from '@/components/stats/HeaderWithTooltip'
import NullableTableCell from '@/components/stats/NullableTableCell'

export default {
  name: 'DataTable',
  components: { NullableTableCell, HeaderWithTooltip, TitledRow, Item, Charts },
  mixins: [Theme, CDN, Mirror],
  props: {
    items: {
      type: Array,
      required: true
    },
    search: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type: String,
      required: true,
      validator (val) {
        return ['item', 'stage'].includes(val)
      }
    },
    trends: {
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
      tableCellClasses: 'px-2 font-weight-bold monospace',
      hideItemName: false,
      expandTrends: false
    }
  },
  computed: {
    ...mapGetters('ajax', ['matrixPending']),
    ...mapState('options', ['dataTable']),
    headers () {
      const headers = [
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
        },
        {
          text: this.$t('stats.headers.apPPR'),
          value: 'apPPR',
          align: 'left',
          sortable: true,
          width: '110px'
        },
        {
          text: this.$t('stats.headers.itemPerTime'),
          value: 'itemPerTime',
          align: 'left',
          sortable: true,
          width: '110px'
        },
        {
          text: this.$t('stats.headers.timeRange'),
          value: 'timeRange',
          align: 'left',
          sortable: false,
          width: '140px'
        }
      ]

      if (this.type === 'stage') {
        headers.unshift({
          text: this.$t('stats.headers.item'),
          value: 'icon',
          align: 'left',
          sortable: false,
          width: '250px'
        })
      } else {
        headers.unshift({
          text: this.$t('stats.headers.stage'),
          value: 'stage',
          align: 'left',
          sortable: false,
          width: '230px'
        })
        headers.splice(5, 0, {
          text: this.$t('stats.headers.apCost'),
          value: 'stage.apCost',
          align: 'left',
          sortable: true,
          width: '70px'
        }, {
          text: this.$t('stats.headers.clearTime'),
          value: 'stage.minClearTime',
          align: 'left',
          sortable: true,
          width: '110px'
        })
      }

      return headers
    },
    strings () {
      return strings
    },
    filteredData () {
      let data = this.items
      if (this.type === 'item') {
        if (this.dataTable.onlyOpen) data = data.filter(el => existUtils.existence(el.stage, true))
        if (!this.dataTable.showPermanent) data = data.filter(el => el.stage.stageType !== 'MAIN' && el.stage.stageType !== 'SUB' && el.stage.stageType !== 'DAILY')
        if (!this.dataTable.showActivity) data = data.filter(el => el.stage.stageType !== 'ACTIVITY')
      }
      return data
    },
    filterCount () {
      let counter = 0
      if (this.dataTable.onlyOpen) counter++
      if (!this.dataTable.showPermanent || !this.dataTable.showActivity) counter++
      return counter
    }
  },
  watch: {
    dataTable: {
      handler: function (newValue) {
        this.$store.commit('options/changeDataTable', newValue)
      },
      deep: true
    }
  },
  created () {
    document.addEventListener('copy', this.manipulateCopy)
  },
  beforeDestroy () {
    document.removeEventListener('copy', this.manipulateCopy)
  },
  methods: {
    manipulateCopy (event) {
      const extra = this.$t('meta.copyWarning', { site: document.location.href })
      event.clipboardData.setData('text', document.getSelection() + extra)
      event.preventDefault()
    },
    getTrendsData (props) {
      if (this.type === 'stage') {
        if (this.trends && this.trends.results && this.trends.results[props.item.item.itemId]) {
          return {
            results: this.trends.results[props.item.item.itemId],
            startTime: this.trends.startTime
          }
        }
      } else {
        if (this.trends && validator.have(this.trends, props.item.stage.stageId)) {
          return this.trends[props.item.stage.stageId]
        }
      }
      return false
    },
    redirectItem (itemId) {
      this.$router.push({
        name: 'StatsByItem_SelectedItem',
        params: {
          itemId
        }
      })
    },
    redirectStage (stageId) {
      const got = get.stages.byStageId(stageId)
      this.$router.push({
        name: 'StatsByStage_Selected',
        params: {
          zoneId: got.zoneId,
          stageId
        }
      })
    },
    chartId (rowProps) {
      if (this.type === 'stage') {
        return rowProps.item.item.itemId
      } else {
        return rowProps.item.stage.stageId
      }
    },
    meta (rowProps) {
      if (this.type === 'stage') {
        return {
          name: strings.translate(rowProps.item.item, 'name')
        }
      } else {
        return {
          name: strings.translate(rowProps.item.stage, 'code')
        }
      }
    },
    formatDate (item) {
      const start = item.start
      const end = item.end

      return timeFormatter.startEnd(start, end)
    },
    formatDuration (duration) {
      return timeFormatter.duration(duration, 's', 0)
    },
    isTimeOutdatedRange (time) {
      if (!time) return false
      return time < Date.now()
    },
    getZoneName (stage) {
      return strings.translate(get.zones.byZoneId(stage.zoneId, false), 'zoneName')
    }
  }
}
</script>

<style>
.stat-table__outdated-row {
  /*opacity: 0.6;*/
  transition: opacity .225s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.stat-table__outdated-row:hover {
  opacity: 1
}

</style>
