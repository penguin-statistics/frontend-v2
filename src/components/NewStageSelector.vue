<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} - {1}",
      "zone": {
        "name": "章节",
        "types": {
          "MAINLINE": "主线",
          "WEEKLY": "物资筹备",
          "ACTIVITY_OPEN": "限时活动（开放中）",
          "ACTIVITY_CLOSED": "限时活动（已结束）"
        },
        "status": {
          "closed": "已结束",
          "open": "开放中"
        }
      },
      "stage": {
        "name": "关卡",
        "apCost": "{apCost} 点理智",
        "loots": {
          "normal": "常规掉落",
          "extra": "额外物资",
          "special": "特殊掉落"
        }
      },
      "stats": {
        "name": "统计结果",
        "title": "{stage} 统计结果"
      },
      "report": {
        "name": "上报结果"
      }
    },
    "en": {
      "opensAt": "Opens at: {0} - {1}",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
          "ACTIVITY_OPEN": "Event (Opening)",
          "ACTIVITY_CLOSED": "Event (Closed)"
        },
        "status": {
          "closed": "Closed",
          "open": "Opening"
        }
      },
      "stage": {
        "name": "Stage",
        "apCost": "{apCost} AP required",
        "loots": {
          "normal": "Normal",
          "extra": "Extra",
          "special": "Special"
        }
      },
      "stats": {
        "name": "Statistics",
        "title": "Statistics of {stage}"
      },
      "report": {
        "name": "Report"
      }
    },
    "ja": {
      "opensAt": "開催期間：{0} - {1}",
      "zone": {
        "name": "章",
        "types": {
          "MAINLINE": "メインストーリー",
          "WEEKLY": "曜日クエスト",
          "ACTIVITY_OPEN": "イベント（開催中）",
          "ACTIVITY_CLOSED": "イベント（終了）"
        },
        "status": {
          "closed": "終了",
          "open": "開催中"
        }
      },
      "stage": {
        "name": "作戦",
        "apCost": "消費理智：{apCost}",
        "loots": {
          "normal": "通常ドロップ",
          "extra": "エクストラドロップ",
          "special": "スペシャルドロップ"
        }
      },
      "stats": {
        "name": "統計結果",
        "title": "{stage} 統計結果"
      },
      "report": {
        "name": "報告"
      }
    }
  }
</i18n>

<template>
  <v-container>
    <div
      v-for="category in categorizedZones"
      :key="category.id"
    >
      <v-subheader>
        <v-icon class="mr-2">
          {{ category.zones[0].icon }}
        </v-icon>
        <span>
          {{ $t(['zone.types', category.id].join('.')) }}
        </span>
      </v-subheader>

      <v-expansion-panels
        hover
        eager
        class="mb-2"
      >
        <v-expansion-panel
          v-for="zone in category.zones"
          :key="zone.zoneId"
          class="bkop-light"
        >
          <v-expansion-panel-header class="overflow-hidden">
            <v-row align="center">
              <span
                v-if="zone.isActivity && !small"
                :class="{
                  'text--darken-1 font-weight-bold': true,
                  'red--text': zone.isOutdated,
                  'green--text': !zone.isOutdated }"
              >
                {{ zone.isOutdated ? $t('zone.status.closed') : $t('zone.status.open') }}
              </span>

              <span
                :class="{'subtitle-1 pl-2': true, 'text--darken-1 font-weight-bold': zone.isActivity && small, 'red--text': zone.isActivity && small && zone.isOutdated,
                         'green--text': zone.isActivity && small && !zone.isOutdated}"
              >
                {{ strings.translate(zone, "zoneName") }}
              </span>

              <v-spacer />

              <span
                v-if="zone.isActivity"
                class="grey--text text--lighten-1 mr-4 text-truncate"
              >
                {{ !small ? $t('opensAt', zone.activityActiveTime) : null }}
              </span>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div
              v-if="zone.isActivity && small"
              class="grey--text text--lighten-1 caption"
            >
              {{ $t('opensAt', zone.activityActiveTime) }}
            </div>
            <StageCard
              v-for="stage in getStages(zone.zoneId)"
              :key="stage.stageId"
              :stage="stage"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";
  import StageCard from "@/components/stats/StageCard";

  export default {
    name: "NewStageSelector",
    components: {StageCard},
    computed: {
      strings () {
        return strings
      },
      small () {
        return this.$vuetify.breakpoint.xsOnly
      },
      categorizedZones() {
        const categories = ["ACTIVITY_OPEN", "MAINLINE", "WEEKLY"];
        !this.hideClosed ? categories.push("ACTIVITY_CLOSED") : null;
        let result = [];
        for (let category of categories) {
          let filter = null;
          let zones = get.zones.byType(category.startsWith("ACTIVITY") ? "ACTIVITY" : category);
          if (category === "ACTIVITY_OPEN") {
            filter = zone => !zone.isOutdated;
          } else if (category === "ACTIVITY_CLOSED") {
            filter = zone => zone.isOutdated;
          }
          if (filter) {
            zones = zones.filter(filter);
          }
          if (zones && zones.length) {
            result.push({
              id: category,
              zones: zones
            })
          }
        }
        return result;
      },
    },

    methods: {
      getStages (zoneId) {
        return get.stages.byParentZoneId(zoneId);
      }
    },
  }
</script>

<style scoped>

</style>