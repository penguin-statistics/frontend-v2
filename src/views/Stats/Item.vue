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
        "FURN": "家具"
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
        "CARD_EXP": "作战记录",
        "MATERIAL": "材料",
        "FURN": "家具"
      }
    },
    "ja": {
      "choose": {
        "name": "アイテムを選ぶ"
      },
      "result": {
        "name": "統計結果",
        "title": "{item} 統計結果"
      },
      "categories": {
        "CARD_EXP": "作战记录",
        "MATERIAL": "材料",
        "FURN": "家具"
      }
    }
  }
</i18n>

<template>
  <v-stepper
    v-model="step"
    :alt-labels="!$vuetify.breakpoint.xsOnly"
    class="bkop-light transparent"
  >
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        <v-layout
          column
          align-center
          justify-center
          wrap
          class="text-xs-center"
        >
          {{ $t('choose.name') }}
          <small v-if="step > 1">{{ selectedItemName }}</small>
        </v-layout>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step === 2"
        :step="2"
      >
        <v-layout
          column
          align-center
          justify-center
          wrap
          class="text-xs-center"
        >
          {{ $t('result.name') }}
        </v-layout>
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        v-if="categorizedItems"
        :step="1"
      >
        <v-container>
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
                <v-avatar
                  class="item-list-item-avatar cursor-pointer"
                  @click="storeItemSelection(item.itemId)"
                >
                  <Item
                    :item="item"
                    :ratio="0.75"
                    disable-link
                    disable-tooltip
                  />
                </v-avatar>
              </div>
            </div>
          </div>
        </v-container>
      </v-stepper-content>

      <v-stepper-content :step="2">
        <v-layout
          align-center
          justify-space-between
        >
          <h1 class="title mx-3 my-1">
            <v-layout align-center>
              <Item
                v-if="selected.item"
                :item="selected.item"
                :ratio="0.75"
                disable-tooltip
                disable-link
              />
              <v-flex class="ml-2">
                {{ $t('result.title', {item: selectedItemName}) }}
              </v-flex>
            </v-layout>
          </h1>
          <DataSourceToggle />
        </v-layout>
        <v-data-table
          :headers="tableHeaders"
          :items="itemStagesStats"
          :pagination.sync="tablePagination"
          :calculate-widths="true"
          must-sort
          hide-actions
          class="elevation-0 transparentTable stat-table"
        >
          <template v-slot:items="props">
            <td 
              :class="{
                'px-3': $vuetify.breakpoint.xsOnly,
                'stage-code-td-xs': $vuetify.breakpoint.xsOnly
              }"
            >
              <span
                class="cursor-pointer"
                @click="redirectStage(props.item)"
              >
                <v-hover>
                  <span slot-scope="{ hover }">
                    <v-avatar
                      :size="30"
                      class="mr-1"
                    >
                      <v-icon>{{ props.item.zone.icon }}</v-icon>
                    </v-avatar>
                    {{ props.item.stage.code }}
                    <v-slide-x-transition>
                      <v-icon
                        v-if="hover || $vuetify.breakpoint.smAndDown"
                        small
                      >mdi-chevron-right</v-icon>
                    </v-slide-x-transition>
                  </span>
                </v-hover>
              </span>
            </td>
            <td
              :class="{'px-3': $vuetify.breakpoint.xsOnly}"
              class="text-xs-center"
            >
              {{ props.item.stage.apCost }}
            </td>
            <td
              :class="{'px-3': $vuetify.breakpoint.xsOnly}"
              class="text-xs-center"
            >
              {{ props.item.times }}
            </td>
            <td
              :class="{'px-3': $vuetify.breakpoint.xsOnly}"
              class="text-xs-center"
            >
              {{ props.item.quantity }}
            </td>
            <td
              :class="{'px-3': $vuetify.breakpoint.xsOnly}"
              class="text-xs-center"
            >
              <div class="charts-data-wrapper">
                {{ props.item.percentageText }}
                <div
                  class="charts-wrapper cursor-pointer"
                  fill-height
                >
                  <Charts
                    v-if="getStageItemTrend(props.item.stage.stageId)"
                    :interval="getStageItemTrendInterval(props.item.stage.stageId)"
                    :x-start="getStageItemTrendStartTime(props.item.stage.stageId)"
                    :show-dialog="expanded[props.item.stage.stageId]"
                    :data-keys="['quantity']"
                    :data="getStageItemTrendResults(props.item.stage.stageId)"
                    :charts-id="props.item.stage.stageId"
                    sparkline-key="quantity"
                    sparkline-sub-key="times"
                  />
                </div>
              </div>
            </td>
            <td
              :class="{'px-3': $vuetify.breakpoint.xsOnly}"
              class="text-xs-center"
            >
              {{ props.item.apPPR }}
            </td>
          </template>
        </v-data-table>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import get from "@/utils/getters";
import Item from "@/components/Item";
import Charts from "@/components/Charts";
import DataSourceToggle from "@/components/DataSourceToggle";

export default {
  name: "StatsByItem",
  components: { Item, Charts, DataSourceToggle },
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
        item: get.item.byItemId(this.$route.params.itemId)
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
      let all = get.item.all();
      const categories = ["MATERIAL", "CARD_EXP", "FURN"];
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
      return this.selected.item.name;
    }
  },
  watch: {
    $route: function(to, from) {
      console.log("step route changed from", from.path, "to", to.path);
      if (to.name === "StatsByItem") {
        this.step = 1;
      }
      if (to.name === "StatsByItem_SelectedItem") {
        this.step = 2;
      }
    },
    step: function(newValue, oldValue) {
      console.log("step changed from", oldValue, "to", newValue);
      switch (newValue) {
        case 1:
          console.log("- [router go] index");
          this.$router.push({ name: "StatsByItem" });
          break;
        case 2:
          console.log("- [router go] item", this.selected.item.itemId);
          this.$router.push({
            name: "StatsByItem_SelectedItem",
            params: { itemId: this.selected.item.itemId }
          });
          break;
        default:
          console.error(
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
      (this.selected.item = get.item.byItemId(this.$route.params.itemId)) &&
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
::v-deep .stat-table th {
  padding-left: 8px !important;
  padding-right: 8px !important;
}
::v-deep .stat-table th i {
  margin-left: -16px;
}
.stage-code-td-xs {
  min-width: 122px;
}
</style>
