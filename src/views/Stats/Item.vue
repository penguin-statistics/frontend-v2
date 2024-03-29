<template>
  <v-stepper
    v-model="step"
    alt-labels
    class="transparent elevation-0 full-width pa-md-2 pa-lg-4 pa-xl-4"
  >
    <v-stepper-header
      class="bkop-light elevation-4 py-2 pl-5 pr-8 d-flex flex-row position-relative align-center justify-center"
      style="border-radius: 4px"
    >
      <v-img
        :src="headerImage"
        class="stepper-header--background stepper-header--background__animated"
        position=""
      >
        <v-overlay
          absolute
          opacity="0"
          :style="{
            background: dark
              ? 'linear-gradient(150deg, rgba(0, 0, 0, .95), rgba(0, 0, 0, 0))'
              : 'linear-gradient(150deg, rgba(255, 255, 255, .95), rgba(255, 255, 255, 0))',
          }"
        />
      </v-img>

      <BackButton
        :name="$t('item.choose.name')"
        :active="step > 1"
        class="my-2"
        @back="step = 1"
      />

      <v-spacer />

      <v-slide-x-transition>
        <div
          v-if="step === 2 && isSelectedItem && relatedItems.length"
          class="d-flex flex-row scrollbar-hidden"
          style="
            overflow-y: visible;
            overflow-x: scroll;
            z-index: 4;
            padding-bottom: 1px;
          "
        >
          <span
            v-for="item in relatedItems"
            :key="item.itemId"
            v-haptic
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
              :value="item.itemId === selectedItem.itemId"
              class="d-flex"
            >
              <span
                :style="{
                  filter:
                    item.itemId === selectedItem.itemId
                      ? dark
                        ? 'drop-shadow(0 0 3px rgba(0, 0, 0, .6))'
                        : 'drop-shadow(0 0 3px rgba(255, 255, 255, .6))'
                      : 'none',
                }"
              >
                <Item
                  :item="item"
                  :ratio="0.6"
                />
              </span>
            </v-badge>
          </span>
        </div>
      </v-slide-x-transition>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        :step="1"
        class="pa-0"
        style="border-radius: 4px"
      >
        <v-card class="bkop-light elevation-4 mt-2 mt-4 pa-4">
          <ItemSelector @select="storeItemSelection" />
        </v-card>
      </v-stepper-content>

      <v-stepper-content
        :step="2"
        class="pa-0 mt-2"
      >
        <v-card class="bkop-light elevation-4 mt-2">
          <v-card-title class="pb-0">
            <v-row
              justify="center"
              class="px-4 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-4 flex-column flex-sm-row align-center align-sm-end"
            >
              <div
                class="d-flex align-center w-full align-self-start align-self-sm-end"
              >
                <Item
                  :item="selectedItem"
                  :ratio="0.7"
                  disable-tooltip
                  disable-link
                />
                <h1 class="title pl-2 pt-1 no-wrap--text">
                  {{ $t("result.title", { item: selectedItemName }) }}
                </h1>
              </div>
              <v-spacer />
              <div class="flex text-center text-sm-right">
                <MatrixCategoryToggle />
                <DataSourceToggle />
              </div>
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
import Item from "@/components/global/Item";
import BackButton from "@/components/stats/BackButton";
import DataSourceToggle from "@/components/stats/DataSourceToggle";
import DataTable from "@/components/stats/DataTable";
import ItemSelector from "@/components/stats/ItemSelector";
import CDN from "@/mixins/CDN";
import Theme from "@/mixins/Theme";
import Console from "@/utils/Console";
import get from "@/utils/getters";
import strings from "@/utils/strings";
import MatrixCategoryToggle from "../../components/stats/MatrixCategoryToggle.vue";

export default {
  name: "StatsByItem",
  components: {
    BackButton,
    ItemSelector,
    DataTable,
    Item,
    DataSourceToggle,
    MatrixCategoryToggle,
  },
  mixins: [CDN, Theme],
  data() {
    return {
      expanded: {},
      step: 1,
      tablePagination: {
        rowsPerPage: -1,
        sortBy: "percentage",
        descending: true,
      },
      headerImage: this.cdnDeliver("/backgrounds/zones/default.jpg"),
      selectedItemId: null,
    };
  },
  computed: {
    isSelectedItem() {
      return !!this.selectedItemId;
    },
    selectedItem() {
      return get.items.byItemId(this.selectedItemId);
    },
    trends() {
      return get.trends.byItemId(this.selectedItemId);
    },
    itemStagesStats() {
      if (!this.selectedItem) return [];
      return get.statistics.byItemId(this.selectedItem.itemId);
    },
    selectedItemName() {
      if (!this.selectedItem) return "";
      return strings.translate(this.selectedItem, "name");
    },
    relatedItems() {
      if (!this.selectedItem) return [];
      return get.items.byGroupId(this.selectedItem.groupID);
    },
  },
  watch: {
    $route: function (to, from) {
      Console.log(
        "StatsByItem",
        "step route changed from",
        from.path,
        "to",
        to.path
      );
      // if (to.name === from.name) return
      if (to.name === "StatsByItem") {
        this.step = 1;
      }
      if (to.name === "StatsByItem_SelectedItem") {
        this.step = 2;
        this.selectedItemId = this.$route.params.itemId;
      }
    },
    step: function (newValue, oldValue) {
      Console.log("StatsByItem", "step changed from", oldValue, "to", newValue);
      switch (newValue) {
        case 1:
          Console.log("StatsByItem", "- [router go] index");
          this.$router.push({ name: "StatsByItem" });
          break;
        case 2:
          this.selectedItemId = this.$route.params.itemId;
          Console.log(
            "StatsByItem",
            "- [router go] item",
            this.selectedItem.itemId
          );
          if (
            this.$route.name !== "StatsByItem_SelectedItem" &&
            this.$route.params.itemId !== this.selectedItem.itemId
          ) {
            this.$router.push({
              name: "StatsByItem_SelectedItem",
              params: { itemId: this.selectedItem.itemId },
            });
          }
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
    },
  },
  beforeMount() {
    this.$route.params.itemId &&
      (this.selectedItemId = this.$route.params.itemId) &&
      (this.step = 2);
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
        params: { itemId },
      });
    },
    redirectStage({ zone, stage }) {
      this.$router.push({
        name: "StatsByStage_SelectedBoth",
        params: {
          zoneId: zone.zoneId,
          stageId: stage.stageId,
        },
      });
    },
  },
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