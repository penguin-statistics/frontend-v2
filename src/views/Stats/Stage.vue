<i18n>
  {
    "zh": {
      "opensAt": "开放时间：",
      "zone": {
        "name": "章节",
        "types": {
          "MAINLINE": "主线",
          "WEEKLY": "物资筹备",
          "ACTIVITY": "限时活动"
        }
      },
      "stage": {
        "name": "关卡",
        "apCost": "{apCost} 点理智",
        "loots": {
          "normal": "常规掉落",
          "extra": "额外物资",
          "special": "幸运掉落"
        }
      },
      "stats": {
        "name": "结果",
        "headers": {
          "item": "物品",
          "times": "样本数",
          "quantity": "掉落数",
          "percentage": "百分比",
          "apPPR": "单个掉落期望消耗理智"
        }
      }
    },
    "en": {
      "opensAt": "Opens At: ",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
          "ACTIVITY": "Activity"
        }
      },
      "stage": {
        "name": "Stage",
        "apCost": "{apCost} points of AP required",
        "loots": {
          "normal": "Normal",
          "extra": "Extra",
          "special": "Special"
        }
      },
      "stats": {
        "name": "Results",
        "headers": {
          "item": "Item",
          "times": "Samples",
          "quantity": "Loots",
          "percentage": "Percentage",
          "apPPR": "Expected AP required every 1 item"
        }
      }
    }
  }
</i18n>

<template>
  <v-stepper v-model="step" class="bkop-light transparent">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" :editable="step > 1" :step="1">{{ $t('zone.name') }}</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 2" :editable="step > 2" :step="2">{{ $t('stage.name') }}</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :step="3">{{ $t('stats.name') }}</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content :step="1">

        <v-container fluid grid-list-lg class="py-0">
          <v-list subheader v-for="zoneCategory in categorizedZones" :key="zoneCategory.id" class="transparent">
            <v-subheader inset>{{ $t(['zone.types', zoneCategory.id].join('.')) }}</v-subheader>

            <v-list-tile
                v-for="zone in zoneCategory.zones"
                :key="zone.zoneId"
                avatar
                @click="storeZoneSelection(zone.zoneId)"
                v-ripple
            >
              <v-list-tile-avatar>
                <v-icon>{{ zone.icon }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ zone.zoneName }}</v-list-tile-title>
                <v-list-tile-sub-title v-if="zone.isActivity">
                    <span
                        :class="{ 'text--darken-1 font-weight-bold': true, 'red--text': zone.isOutdated, 'green--text': !zone.isOutdated }">{{ zone.isOutdated ? "已结束" : "正在进行" }}</span>
                  {{ zone.activityActiveTimeText }}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-container>

      </v-stepper-content>

      <v-stepper-content :step="2" v-if="this.selected.zone">
        <v-fade-transition>
          <div class="zoneNameHighlight" v-if="selectedZone">
            {{ this.selectedZone.zoneName || '' }}
          </div>
        </v-fade-transition>

        <v-container fluid grid-list-lg class="py-0">
          <v-list subheader :three-line="$vuetify.breakpoint.smAndUp" class="transparent">
            <v-subheader inset v-if="selectedZone">{{ selectedZone.zoneName || '' }}</v-subheader>

            <v-list-tile
                v-for="stage in stages"
                :key="stage.stageId"
                avatar
                @click="storeStageSelection(stage.stageId)"
                v-ripple
            >
              <v-list-tile-avatar>
                <v-icon>{{ stage.icon }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ stage.code }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-layout align-center justify-start row wrap d-inline-flex class="overflow-hidden">
                    <v-flex :class="{ 'yellow--text font-weight-bold': true, 'amber--text text--darken-4': !$vuetify.dark }">
                      {{ $t('stage.apCost', {apCost: stage.apCost}) }}
                    </v-flex>

                    <v-divider vertical v-if="stage.normalDrop.length > 0" class="hidden-xs-only mx-1" />

                    <v-flex v-if="stage.normalDrop.length > 0" class="hidden-xs-only">
                      <div>{{ $t('stage.loots.normal') }}</div>
                      <Item v-for="item in stage.normalDrop" :key="item" :item="getItem(item)" :ratio="0.5" />
                    </v-flex>

                    <v-divider vertical v-if="stage.extraDrop.length > 0" class="hidden-sm-and-down mx-1" />

                    <v-flex v-if="stage.extraDrop.length > 0" class="hidden-sm-and-down">
                      <div>{{ $t('stage.loots.extra') }}</div>
                      <Item v-for="item in stage.extraDrop" :key="item*10" :item="getItem(item)" :ratio="0.5" />
                    </v-flex>

                    <v-divider vertical v-if="stage.specialDrop.length > 0" class="hidden-sm-and-down mx-1" />

                    <v-flex v-if="stage.specialDrop.length > 0" class="hidden-sm-and-down">
                      <div>{{ $t('stage.loots.special') }}</div>
                      <Item v-for="item in stage.specialDrop" :key="item*100" :item="getItem(item)" :ratio="0.5" />
                    </v-flex>
                  </v-layout>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-container>
      </v-stepper-content>

      <v-stepper-content :step="3">
        <v-data-table
            :headers="tableHeaders"
            :items="stageStats"
            :pagination.sync="tablePagination"

            must-sort
            hide-actions
            class="elevation-0 transparentTable"
        >
          <template v-slot:items="props">
            <td>
              <v-avatar :size="30" class="mr-1">
                <Item :item="props.item.item" :ratio="0.5" />
              </v-avatar>
              {{ props.item.item.name }}
            </td>
            <td class="text-xs-right">{{ props.item.times }}</td>
            <td class="text-xs-right">{{ props.item.quantity }}</td>
            <td class="text-xs-right">{{ props.item.percentageText }}</td>
            <td class="text-xs-right">{{ props.item.apPPR }}</td>
          </template>
        </v-data-table>
      </v-stepper-content>
    </v-stepper-items>

  </v-stepper>

</template>

<script>
  import get from '@/utils/getters'
  import formatter from '@/utils/timeFormatter'
  import Item from "@/components/Item";

  export default {
    name: "StatsByItem",
    components: {Item},
    data: () => ({
      step: 1,
      selected: {
        zone: null,
        stage: null
      },
      tablePagination: {
        rowsPerPage: -1,
        sortBy: "percentage",
        descending: true
      }
    }),
    methods: {
      getImage(id) {
        try {
          return require(`../../assets/zonePageBackgrounds/${id}.png`)
        } catch {
          return 'http://unsplash.it/512/512?image=' + id
        }
      },
      storeZoneSelection(zoneId) {
        this.step += 1;
        this.selected.zone = zoneId
      },
      storeStageSelection(stageId) {
        this.step += 1;
        this.selected.stage = stageId
      },
      getZones(type) {
        let zones = get.zones.all();
        if (!zones) return [];
        zones = zones.filter(el => {
          return el.type === type
        });

        zones.forEach((object) => {
          const ICON_MAP = {
            "MAINLINE": "mdi-checkerboard",
            "WEEKLY": "mdi-treasure-chest",
            "ACTIVITY": "mdi-sack"
          };
          object.icon = ICON_MAP[object.type];

          object.isActivity = object.type === "ACTIVITY"
          if (object.isActivity) {
            let dates = formatter.dates([object.openTime, object.closeTime]);
            object.activityActiveTimeText = `${this.$t('opensAt')}${dates[0]} - ${dates[1]}`

            object.isOutdated = formatter.isOutdated(object.closeTime)
          }
        });
        return zones
      },
      getItem(itemId) {
        return get.item.byItemId(itemId)
      }
    },
    computed: {
      categorizedZones() {
        const CATEGORIES = ["MAINLINE", "WEEKLY", "ACTIVITY"];
        let result = [];
        for (let category of CATEGORIES) {
          result.push({
            id: category,
            zones: this.getZones(category)
          })
        }
        return result
      },
      selectedZone() {
        if (!this.selected.zone) return {zoneName: ''}
        return get.zones.byZoneId(this.selected.zone)
      },
      selectedStage () {
        return get.stages.byStageId(this.selected.stage)
      },
      stages() {
        return get.stages.byParentZoneId(this.selected.zone)
      },
      stageStats() {
        if (!this.selected.stage) return []
        return get.statistics.byStageId(this.selected.stage)
      },
      tableHeaders () {
        return [
          {
            text: this.$t('stats.headers.item'),
            value: "icon",
            align: "center",
            sortable: false,
            width: 200
          },
          {
            text: this.$t('stats.headers.times'),
            value: "times",
            align: "center",
            sortable: true,
            width: 50,
          },
          {
            text: this.$t('stats.headers.quantity'),
            value: "quantity",
            align: "center",
            sortable: true,
            width: 50,
          },
          {
            text: this.$t('stats.headers.percentage'),
            value: "percentage",
            align: "center",
            sortable: true,
            width: 80
          },
          {
            text: this.$t('stats.headers.apPPR'),
            value: "apPPR",
            align: "center",
            sortable: true,
            width: 80
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .zoneTitle {
    position: absolute;
    top: -15px;
    left: 2em;
    background: #000000;
    padding: 4px 2em;
    font-size: 16px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, .75)
  }

  .theme--light .zoneTitle {
    color: #fff;
  }

  .zoneNameHighlight {
    position: absolute;
    right: .5em;
    top: -1.5em;
    font-size: 32px;
    color: rgba(100, 100, 100, 0.9);
    user-select: none;
  }

  .v-table {
    background: transparent !important;
  }
</style>
