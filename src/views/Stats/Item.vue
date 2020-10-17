<i18n>
{
  "zh": {
    "result": {
      "name": "统计结果",
      "title": "{item} 统计结果"
    }
  },
	"en": {
		"result": {
			"name": "Statistics",
			"title": "Statistics of {item}"
		}
	},
	"ja": {
		"result": {
			"name": "統計結果",
			"title": "{item} 統計結果"
		}
	},
	"ko": {
		"result": {
			"name": "통계 결과",
			"title": "{item}의 통계 결과"
		}
	}
}
</i18n>

<template>
  <v-stepper
    v-model="step"
    :alt-labels="!$vuetify.breakpoint.xsOnly"
    class="pa-2 transparent elevation-0 full-width"
  >
    <v-stepper-header
      class="bkop-light elevation-4"
      style="border-radius: 4px"
    >
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        {{ $t('items.choose.name') }}
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

    <v-slide-y-transition leave-absolute>
      <v-card
        v-if="isSelectedItem && relatedItems.length"
        class="bkop-light mt-2 elevation-4 py-2 px-6"
      >
        <TitledRow
          dense
        >
          <template v-slot:header>
            <v-icon>
              mdi-related
            </v-icon>
            {{ $t("items.related") }}
          </template>
          <template v-slot:content>
            <span
              v-for="item in relatedItems"
              :key="item.itemId"
              class="mr-1 cursor-pointer"
              @click="storeItemSelection(item.itemId)"
            >
              <v-badge
                bordered
                bottom
                overlap

                :offset-x="16"
                :offset-y="20"
                color="green darken-1"
                icon="mdi-check"
                :value="item.itemId === selected.item.itemId"
                class="d-flex"
              >
                <span :style="{'filter': item.itemId === selected.item.itemId ? 'drop-shadow(0 0 3px rgba(255, 255, 255, .6))' : 'none'}">
                  <Item
                    :item="item"
                    :ratio="0.6"
                  />
                </span>
              </v-badge>
            </span>
          </template>
        </TitledRow>
      </v-card>
    </v-slide-y-transition>

    <v-stepper-items>
      <v-stepper-content
        :step="1"
        class="bkop-light mt-2 elevation-4"
        style="border-radius: 4px"
      >
        <v-row
          justify="center"
          align="center"
        >
          <v-col>
            <ItemSelector @select="storeItemSelection" />
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
            :trends="trends"

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
import ItemSelector from "@/components/stats/ItemSelector";
import TitledRow from "@/components/global/TitledRow";

export default {
  name: "StatsByItem",
  components: {TitledRow, ItemSelector, DataTable, Item, DataSourceToggle },
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
    isSelectedItem () {
      return !!this.$route.params.itemId
    },
    selected() {
      return {
        item: get.items.byItemId(this.$route.params.itemId)
      };
    },
    trends () {
      return get.trends.byItemId(this.$route.params.itemId)
    },
    itemStagesStats() {
      if (!this.selected.item) return [];
      return get.statistics.byItemId(this.selected.item.itemId);
    },
    selectedItemName() {
      if (!this.selected.item) return "";
      return strings.translate(this.selected.item, "name");
    },
    relatedItems() {
      if (!this.selected.item) return "";
      return get.items.byGroupId(this.selected.item.groupID)
    }
  },
  watch: {
    $route: function(to, from) {
      Console.log("StatsByItem", "step route changed from", from.path, "to", to.path);
      if (to.name === "StatsByItem") {
        this.step = 1;
      }
      if (to.name === "StatsByItem_SelectedItem") {
        this.step = 2;
      }
    },
    step: function(newValue, oldValue) {
      Console.log("StatsByItem", "step changed from", oldValue, "to", newValue);
      switch (newValue) {
        case 1:
          Console.log("StatsByItem", "- [router go] index");
          this.$router.push({ name: "StatsByItem" });
          break;
        case 2:
          Console.log("StatsByItem", "- [router go] item", this.selected.item.itemId);
          this.$router.push({
            name: "StatsByItem_SelectedItem",
            params: { itemId: this.selected.item.itemId }
          });
          break;
        default:
          Console.warn(
            "StatsByItem",
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
    // getStageItemTrendInterval(stageId) {
    //   let trend = this.getStageItemTrend(stageId);
    //   return trend && trend.interval;
    // },
    // getStageItemTrendStartTime(stageId) {
    //   let trend = this.getStageItemTrend(stageId);
    //   return trend && trend.startTime;
    // },
    // getStageItemTrendResults(stageId) {
    //   let trend = this.getStageItemTrend(stageId);
    //   return trend && trend.results;
    // },
    getStageItemTrend(stageId) {
      return this.currentItemTrends && this.currentItemTrends[stageId];
    },
    storeItemSelection(itemId) {
      this.$router.push({
        name: "StatsByItem_SelectedItem",
        params: { itemId }
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
.full-width {
  width: 100%;
}
</style>
