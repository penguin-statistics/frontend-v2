<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} ~ {1}",
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
      }
    },
    "en": {
      "opensAt": "Opens At: {0} ~ {1}",
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
      }
    },
    "ja": {
      "opensAt": "開催期間：{0} ~ {1}",
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
      }
    }
  }
</i18n>

<template>
  <StageSelector
    name="stats.name"
    :prefill="prefill"
    @selected="select"
  >
    <v-row
      align="center"
      justify="space-between"
    >
      <h1 class="title ma-4">
        {{ $t('stats.title', {stage: selectedStage.code}) }}
      </h1>
      <DataSourceToggle />
    </v-row>
    <v-data-table
      :headers="tableHeaders"
      :items="stageStats"
      :pagination.sync="tablePagination"
      :calculate-widths="true"
      must-sort
      hide-default-footer
      class="elevation-0 transparentTable stat-table"
    >
      <template v-slot:items="props">
        <tr>
          <td
            :class="{
              'px-3': $vuetify.breakpoint.smAndDown,
              'item-name-td-xs': $vuetify.breakpoint.xsOnly,
              'item-name-td-sm': $vuetify.breakpoint.smOnly
            }"
            class="hovering"
          >
            <span
              class="cursor-pointer"
              @click="redirectItem(props.item.item.itemId)"
            >
              <v-hover>
                <span
                  slot-scope="{ hover }"
                  :class="{
                    'hovering--hovered': hover
                  }"
                >
                  <v-avatar
                    :size="30"
                    class="mr-1"
                  >
                    <Item
                      :item="props.item.item"
                      :ratio="0.65"
                      disable-tooltip
                      disable-link
                    />
                  </v-avatar>
                  <span
                    v-if="!$vuetify.breakpoint.xsOnly"
                    class="ml-2"
                  >
                    {{ strings.translate(props.item.item, "name") }}
                  </span>
                  <v-slide-x-transition>
                    <v-icon
                      v-if="hover || $vuetify.breakpoint.smOnly"
                      small
                    >mdi-chevron-right</v-icon>
                  </v-slide-x-transition>
                </span>
              </v-hover>
            </span>
          </td>
          <td
            :class="{'px-3': $vuetify.breakpoint.xsOnly}"
            class="text-center"
          >
            {{ props.item.times }}
          </td>
          <td
            :class="{'px-3': $vuetify.breakpoint.xsOnly}"
            class="text-center"
          >
            {{ props.item.quantity }}
          </td>
          <td
            :class="{'px-3': $vuetify.breakpoint.xsOnly}"
            class="text-center"
          >
            <div
              class="charts-data-wrapper"
              fill-height
            >
              {{ props.item.percentageText }}
              <div
                class="charts-wrapper cursor-pointer"
                fill-height
              >
                <!--                <Charts-->
                <!--                  v-if="currentTrends"-->
                <!--                  :interval="currentTrends && currentTrends.interval"-->
                <!--                  :x-start="currentTrends && currentTrends.startTime"-->
                <!--                  :show-dialog="expanded[props.item.item.itemId]"-->
                <!--                  :data-keys="['quantity']"-->
                <!--                  :data="currentTrendsData && currentTrendsData[props.item.item.itemId]"-->
                <!--                  :charts-id="props.item.item.itemId"-->
                <!--                  sparkline-key="quantity"-->
                <!--                  sparkline-sub-key="times"-->
                <!--                />-->
              </div>
            </div>
          </td>
          <td
            :class="{'px-3': $vuetify.breakpoint.xsOnly}"
            class="text-center"
          >
            {{ props.item.apPPR }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </StageSelector>
</template>

<script>
import get from "@/utils/getters";
import Item from "@/components/Item";
import DataSourceToggle from "@/components/DataSourceToggle";
import Console from "@/utils/Console";
import StageSelector from "@/components/StageSelector";
import strings from "@/utils/strings";

export default {
  name: "StatsByStage",
  components: {StageSelector, Item, DataSourceToggle },
  data: () => ({
    expanded: {},
    selected: {
      zone: null,
      stage: null,
    },
    tablePagination: {
      rowsPerPage: -1,
      sortBy: "percentage",
      descending: true
    }
  }),
  computed: {
    strings() {
      return strings
    },
    prefill () {
      let prefills = {};
      const params = this.$route.params;

      prefills.zone = params.zoneId ? params.zoneId : null
      prefills.stage =  params.stageId ? params.stageId : null

      return prefills
    },
    currentTrends() {
      return get.trends.byStageId(this.selected.stage);
    },
    currentTrendsData() {
      return this.currentTrends && this.currentTrends.results;
    },
    categorizedZones() {
      const categories = ["ACTIVITY_OPEN", "MAINLINE", "WEEKLY", "ACTIVITY_CLOSED"];
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
    selectedZone() {
      if (!this.selected.zone) return {};
      return get.zones.byZoneId(this.selected.zone);
    },
    selectedStage() {
      if (!this.selected.stage) return {};
      return get.stages.byStageId(this.selected.stage);
    },
    stages() {
      return get.stages.byParentZoneId(this.selected.zone);
    },
    stageStats() {
      if (!this.selected.stage) return [];
      return get.statistics.byStageId(this.selected.stage);
    },
    tableHeaders() {
      return [
        {
          text: this.$t("stats.headers.item"),
          value: "icon",
          align: "center",
          sortable: false,
          width: "250px"
        },
        {
          text: this.$t("stats.headers.times"),
          value: "times",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("stats.headers.quantity"),
          value: "quantity",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("stats.headers.percentage"),
          value: "percentage",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("stats.headers.apPPR"),
          value: "apPPR",
          align: "center",
          sortable: true
        }
      ];
    }
  },
  methods: {
    redirectItem(itemId) {
      this.$router.push({
        name: "StatsByItem_SelectedItem",
        params: {
          itemId
        }
      });
    },
    select (selection) {
      this.selected[selection.type] = selection.payload;

      if (this.selected.zone === null) {
        if (this.selected.stage === null) {
          Console.debug("- [router go] index");
          this.$router.push({name: "StatsByStage"});
        }
      } else {
        if (this.selected.stage === null) {
          Console.debug("- [router go] zone", this.selected.zone);
          this.$router.push({
            name: "StatsByStage_SelectedZone",
            params: {zoneId: this.selected.zone}
          });
        } else {
          Console.debug("- [router go] stage", this.selected);
          this.$router.push({
            name: "StatsByStage_SelectedBoth",
            params: {
              zoneId: this.selected.zone,
              stageId: this.selected.stage
            }
          });
        }
      }
    },
    getItem(itemId) {
      return get.items.byItemId(itemId);
    }
  }
};
</script>

<style scoped>
.theme--light .zoneTitle {
  color: #fff;
}

.v-table {
  background: transparent !important;
}

.charts-data-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.charts-wrapper {
  display: flex;
  align-items: center;
}

::v-deep .stat-table th {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

.item-name-td-xs {
  min-width: 100px;
}

.item-name-td-sm {
  min-width: 160px;
}

::v-deep .stat-table th i {
  margin-left: -16px;
}
</style>
