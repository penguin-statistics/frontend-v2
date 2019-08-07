<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} ~ {1}",
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
        "name": "统计结果",
        "title": "{stage} 统计结果"
      }
    },
    "en": {
      "opensAt": "Opens At: {0} ~ {1}",
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
        "name": "Statistics",
        "title": "Statistics of {stage}"
      }
    }
  }
</i18n>

<template>
  <v-stepper
    v-model="step"
    class="bkop-light transparent"
    alt-labels
  >
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        {{ $t('zone.name') }}
        <small v-if="step > 1">{{ selectedZone.zoneName }}</small>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 2"
        :editable="step > 2"
        :step="2"
      >
        {{ $t('stage.name') }}
        <small v-if="step > 2">{{ selectedStage.code }}</small>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step === 3"
        :step="3"
      >
        {{ $t('stats.name') }}
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content :step="1">
        <v-container
          fluid
          grid-list-lg
          class="py-0"
        >
          <v-list
            v-for="zoneCategory in categorizedZones"
            :key="zoneCategory.id"
            subheader
            class="transparent"
          >
            <v-subheader inset>
              {{ $t(['zone.types', zoneCategory.id].join('.')) }}
            </v-subheader>

            <v-list-tile
              v-for="zone in zoneCategory.zones"
              :key="zone.zoneId"
              v-ripple
              avatar
              @click="storeZoneSelection(zone.zoneId)"
            >
              <v-list-tile-avatar>
                <v-icon>{{ zone.icon }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ zone.zoneName }}</v-list-tile-title>
                <v-list-tile-sub-title v-if="zone.isActivity">
                  <span
                    :class="{ 'text--darken-1 font-weight-bold': true, 'red--text': zone.isOutdated, 'green--text': !zone.isOutdated }"
                  >{{ zone.isOutdated ? "已结束" : "正在进行" }}</span>
                  {{ $t('opensAt', zone.activityActiveTime) }}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon color="grey lighten-1">
                  mdi-chevron-right
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-container>
      </v-stepper-content>

      <v-stepper-content
        v-if="selected.zone"
        :step="2"
      >
        <v-container
          fluid
          grid-list-lg
          class="py-0"
        >
          <v-list
            subheader
            :three-line="$vuetify.breakpoint.smAndUp"
            class="transparent"
          >
            <v-subheader
              v-if="selectedZone"
              inset
            >
              {{ selectedZone.zoneName || '' }}
            </v-subheader>

            <v-list-tile
              v-for="stage in stages"
              :key="stage.stageId"
              v-ripple
              avatar
              @click="storeStageSelection(stage.stageId)"
            >
              <v-list-tile-avatar>
                <v-icon>mdi-cube-outline</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ stage.code }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-layout
                    align-center
                    justify-start
                    row
                    wrap
                    d-inline-flex
                  >
                    <v-flex :class="{ 'yellow--text font-weight-bold': true, 'amber--text text--darken-4': !$vuetify.dark }">
                      {{ $t('stage.apCost', {apCost: stage.apCost}) }}
                    </v-flex>

                    <v-divider
                      v-if="stage.normalDrop.length > 0"
                      vertical
                      class="hidden-xs-only mx-1"
                    />

                    <v-flex
                      v-if="stage.normalDrop.length > 0"
                      class="hidden-xs-only"
                    >
                      <div>{{ $t('stage.loots.normal') }}</div>
                      <Item
                        v-for="item in stage.normalDrop"
                        :key="item"
                        :item="getItem(item)"
                        :ratio="0.5"
                        disable-link
                      />
                    </v-flex>

                    <v-divider
                      v-if="stage.extraDrop.length > 0"
                      vertical
                      class="hidden-sm-and-down mx-1"
                    />

                    <v-flex
                      v-if="stage.extraDrop.length > 0"
                      class="hidden-sm-and-down"
                    >
                      <div>{{ $t('stage.loots.extra') }}</div>
                      <Item
                        v-for="item in stage.extraDrop"
                        :key="item*10"
                        :item="getItem(item)"
                        :ratio="0.5"
                        disable-link
                      />
                    </v-flex>

                    <v-divider
                      v-if="stage.specialDrop.length > 0"
                      vertical
                      class="hidden-sm-and-down mx-1"
                    />

                    <v-flex
                      v-if="stage.specialDrop.length > 0"
                      class="hidden-sm-and-down"
                    >
                      <div>{{ $t('stage.loots.special') }}</div>
                      <Item
                        v-for="item in stage.specialDrop"
                        :key="item*100"
                        :item="getItem(item)"
                        :ratio="0.5"
                        disable-link
                      />
                    </v-flex>
                  </v-layout>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon color="grey lighten-1">
                  mdi-chevron-right
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-container>
      </v-stepper-content>

      <v-stepper-content :step="3">
        <h1 class="title ma-3">{{ $t('stats.title', {stage: selectedStage.code}) }}</h1>
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
              <v-avatar
                :size="30"
                class="mr-1"
              >
                <Item
                  :item="props.item.item"
                  :ratio="0.5"
                  disable-tooltip
                />
              </v-avatar>
              {{ props.item.item.name }}
            </td>
            <td class="text-xs-right">
              {{ props.item.times }}
            </td>
            <td class="text-xs-right">
              {{ props.item.quantity }}
            </td>
            <td class="text-xs-right">
              {{ props.item.percentageText }}
            </td>
            <td class="text-xs-right">
              {{ props.item.apPPR }}
            </td>
          </template>
        </v-data-table>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import get from '@/utils/getters'
  import Item from "@/components/Item";

  export default {
    name: "StatsByStage",
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
    computed: {
      categorizedZones() {
        const categories = ["MAINLINE", "WEEKLY", "ACTIVITY"];
        let result = [];
        for (let category of categories) {
          result.push({
            id: category,
            zones: get.zones.byType(category)
          })
        }
        return result
      },
      selectedZone() {
        if (!this.selected.zone) return {zoneName: ''};
        return get.zones.byZoneId(this.selected.zone)
      },
      selectedStage() {
        if (!this.selected.stage) return {};
        return get.stages.byStageId(this.selected.stage)
      },
      stages() {
        return get.stages.byParentZoneId(this.selected.zone)
      },
      stageStats() {
        if (!this.selected.stage) return [];
        return get.statistics.byStageId(this.selected.stage)
      },
      tableHeaders () {
        return [
          {
            text: this.$t('stats.headers.item'),
            value: "icon",
            align: "center",
            sortable: false,
            width: 300
          },
          {
            text: this.$t('stats.headers.times'),
            value: "times",
            align: "center",
            sortable: true,
            width: 40,
          },
          {
            text: this.$t('stats.headers.quantity'),
            value: "quantity",
            align: "center",
            sortable: true,
            width: 40,
          },
          {
            text: this.$t('stats.headers.percentage'),
            value: "percentage",
            align: "center",
            sortable: true,
            width: 65
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
    },
    watch: {
      '$route': function (to, from) {
        console.log("step route changed from", from.path, "to", to.path);
        if (to.name === 'StatsByStage') {
          this.step = 1;
        }
        if (to.name === 'StatsByStage_SelectedZone') {
          this.step = 2;
        }
        if (to.name === 'StatsByStage_SelectedBoth') {
          this.step = 3;
        }
      },
      step: function(newValue, oldValue) {
        console.log("step changed from", oldValue, "to", newValue);
        switch (newValue) {
          case 1:
            console.log("- [router go] index");
            this.$router.push({name: "StatsByStage"});
            break;
          case 2:
            console.log("- [router go] zone", this.selected.zone);
            this.$router.push({name: "StatsByStage_SelectedZone", params: {zoneId: this.selected.zone}});
            break;
          case 3:
            console.log("- [router go] stage", this.selected);
            this.$router.push({
              name: "StatsByStage_SelectedBoth",
              params: {
                zoneId: this.selected.zone,
                stageId: this.selected.stage
              }
            });
            break;
          default:
            console.error("unexpected step number", newValue, "with [newStep, oldStep]", [newValue, oldValue])
        }
      }
    },
    beforeMount() {
      (this.$route.params.zoneId) && (this.selected.zone = this.$route.params.zoneId) && (this.step += 1);
      (this.$route.params.stageId) && (this.selected.stage = this.$route.params.stageId) && (this.step += 1);
    },
    methods: {
      storeZoneSelection(zoneId) {
        this.step += 1;
        this.selected.zone = zoneId
      },
      storeStageSelection(stageId) {
        this.step += 1;
        this.selected.stage = stageId
      },
      getItem(itemId) {
        return get.item.byItemId(itemId)
      }
    }
  }
</script>

<style scoped>
  .theme--light .zoneTitle {
    color: #fff;
  }

  .v-table {
    background: transparent !important;
  }
</style>
