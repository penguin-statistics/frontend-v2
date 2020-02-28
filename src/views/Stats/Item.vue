<i18n>
  {
    "zh": {
      "choose": {
        "name": "选择物品"
      },
      "result": {
        "name": "统计结果",
        "title": "{item} 统计结果"
      },
      "categories": {
        "CARD_EXP": "作战记录",
        "MATERIAL": "材料",
        "FURN": "家具",
        "ACTIVITY_ITEM": "活动道具"
      }
    },
    "en": {
      "choose": {
        "name": "Choose Item"
      },
      "result": {
        "name": "Statistics",
        "title": "Statistics of {item}"
      },
      "categories": {
        "CARD_EXP": "Battle Records",
        "MATERIAL": "Materials",
        "FURN": "Furniture",
        "ACTIVITY_ITEM": "Event item"
      }
    },
    "ja": {
      "choose": {
        "name": "素材選択"
      },
      "result": {
        "name": "統計結果",
        "title": "{item} 統計結果"
      },
      "categories": {
        "CARD_EXP": "作戦記録",
        "MATERIAL": "素材",
        "FURN": "家具",
        "ACTIVITY_ITEM": "イベントアイテム"
      }
    },
    "ko": {
      "choose": {
        "name": "아이템 선택"
      },
      "result": {
        "name": "통계 결과",
        "title": "{item}의 통계 결과"
      },
      "categories": {
        "CARD_EXP": "작전 기록",
        "MATERIAL": "재료",
        "FURN": "가구",
        "ACTIVITY_ITEM": "이벤트 아이템"
      }
    }
  }
</i18n>

<template>
  <v-stepper
    v-model="step"
    :alt-labels="!$vuetify.breakpoint.xsOnly"
    class="px-2 transparent elevation-0 full-width"
  >
    <v-stepper-header
      class="bkop-light elevation-6"
      style="border-radius: 4px"
    >
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        {{ $t('choose.name') }}
        <small
          v-if="step > 1"
          class="mt-2"
        >{{ selectedItemName }}</small>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step === 2"
        :step="2"
      >
        {{ $t('result.name') }}
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        v-if="categorizedItems"
        :step="1"
        class="bkop-light mt-2 elevation-4"
        style="border-radius: 4px"
      >
        <v-row
          justify="center"
          align="center"
        >
          <v-col>
            <div
              v-for="(items, name) in categorizedItems"
              :key="name"
              class="item-list-wrapper"
            >
              <div class="ml-2 my-2">
                {{ $t(`categories.${name}`) }}
              </div>
              <div class="item-list">
                <div
                  v-for="item in items"
                  :key="item.itemId"
                  class="item-list-item-wrapper"
                >
                  <div
                    class="item-list-item-avatar cursor-pointer"
                    @click="storeItemSelection(item.itemId)"
                  >
                    <Item
                      :item="item"
                      disable-link
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-content
        :step="2"
        class="pa-0 mt-2 elevation-4"
      >
        <v-card class="bkop-light pt-2">
          <v-card-title class="pb-0">
            <v-row
              align="center"
              justify="center"
              class="px-4 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-4"
            >
              <Item
                v-if="selected.item"
                :item="selected.item"
                :ratio="0.7"

                disable-tooltip
                disable-link
              />
              <h1 class="title pl-2 pt-1 no-wrap--text">
                {{ $t('result.title', {item: selectedItemName}) }}
              </h1>
              <v-spacer />
              <DataSourceToggle />
            </v-row>
          </v-card-title>

          <DataTable
            :items="itemStagesStats"
            type="item"

            class="px-3 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-6"
          />
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import get from "@/utils/getters";
import Item from "@/components/global/Item";
import DataSourceToggle from "@/components/stats/DataSourceToggle";
import Console from "@/utils/Console";
import strings from "@/utils/strings";
import DataTable from "@/components/stats/DataTable";

export default {
  name: "StatsByItem",
  components: {DataTable, Item, DataSourceToggle },
  data: () => ({
    expanded: {},
    step: 1,
    tablePagination: {
      rowsPerPage: -1,
      sortBy: "percentage",
      descending: true
    }
  }),
  computed: {
    selected() {
      return {
        item: get.items.byItemId(this.$route.params.itemId)
      };
    },
    currentItemTrends() {
      return get.trends.byItemId(this.$route.params.itemId);
    },
    tableHeaders() {
      return [
        {
          text: this.$t("stats.headers.stage"),
          value: "icon",
          align: "center",
          sortable: false,
          width: "250px"
        },
        {
          text: this.$t("stats.headers.apCost"),
          value: "stage.apCost",
          align: "center",
          sortable: true
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
    },
    categorizedItems() {
      let all = get.items.all();
      const categories = ["MATERIAL", "CARD_EXP", "FURN", "ACTIVITY_ITEM"];
      let results = {};
      for (let category of categories) {
        results[category] = all.filter(el => el.itemType === category);
        // move 3003 to the last member
        results[category].sort((a, b) => {
          if (a.itemId === "3003") return 1;
          if (b.itemId === "3003") return -1;
          return a.sortId - b.sortId;
        });
      }
      return results;
    },
    itemStagesStats() {
      if (!this.selected.item) return [];
      return get.statistics.byItemId(this.selected.item.itemId);
    },
    selectedItemName() {
      if (!this.selected.item) return "";
      return strings.translate(this.selected.item, "name");
    }
  },
  watch: {
    $route: function(to, from) {
      Console.log("step route changed from", from.path, "to", to.path);
      if (to.name === "StatsByItem") {
        this.step = 1;
      }
      if (to.name === "StatsByItem_SelectedItem") {
        this.step = 2;
      }
    },
    step: function(newValue, oldValue) {
      Console.log("step changed from", oldValue, "to", newValue);
      switch (newValue) {
        case 1:
          Console.log("- [router go] index");
          this.$router.push({ name: "StatsByItem" });
          break;
        case 2:
          Console.log("- [router go] item", this.selected.item.itemId);
          this.$router.push({
            name: "StatsByItem_SelectedItem",
            params: { itemId: this.selected.item.itemId }
          });
          break;
        default:
          Console.error(
            "unexpected step number",
            newValue,
            "with [newStep, oldStep]",
            [newValue, oldValue]
          );
      }
    }
  },
  beforeMount() {
    this.$route.params.itemId &&
      (this.selected.item = get.items.byItemId(this.$route.params.itemId)) &&
      (this.step += 1);
  },
  methods: {
    getStageItemTrendInterval(stageId) {
      let trend = this.getStageItemTrend(stageId);
      return trend && trend.interval;
    },
    getStageItemTrendStartTime(stageId) {
      let trend = this.getStageItemTrend(stageId);
      return trend && trend.startTime;
    },
    getStageItemTrendResults(stageId) {
      let trend = this.getStageItemTrend(stageId);
      return trend && trend.results;
    },
    getStageItemTrend(stageId) {
      return this.currentItemTrends && this.currentItemTrends[stageId];
    },
    storeItemSelection(itemId) {
      this.$router.push({
        name: "StatsByItem_SelectedItem",
        params: { itemId: itemId }
      });
    },
    redirectStage({ zone, stage }) {
      this.$router.push({
        name: "StatsByStage_SelectedBoth",
        params: {
          zoneId: zone.zoneId,
          stageId: stage.stageId
        }
      });
    }
  }
};
</script>

<style scoped>
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
.item-list-wrapper {
  display: flex;
  flex-direction: column;
}
.item-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.item-list-item-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 62px;
  margin: 4px 0;
}
.full-width {
  width: 100%;
}


/*::v-deep .stat-table th {*/
/*  padding-left: 8px !important;*/
/*  padding-right: 8px !important;*/
/*}*/
/*::v-deep .stat-table th i {*/
/*  margin-left: -16px;*/
/*}*/
/*.stage-code-td-xs {*/
/*  min-width: 122px;*/
/*}*/
</style>
