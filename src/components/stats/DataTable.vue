<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"

    must-sort
    sort-by="percentage"
    :sort-desc="true"
    :locale="$i18n.locale"

    :calculate-widths="true"
    hide-default-footer
    :mobile-breakpoint="1"

    class="elevation-0 transparentTable stat-table container--fluid"
  >
    <!--    <template v-slot:item.stage="{ item }">-->
    <!--      <v-row-->
    <!--        align="center"-->
    <!--        align-content="center"-->
    <!--        class="pl-2"-->
    <!--      >-->
    <!--        <Item-->
    <!--          :item="item.item"-->
    <!--          :ratio="0.6"-->
    <!--          disable-tooltip-->
    <!--          disable-link-->
    <!--        />-->
    <!--        <span-->
    <!--          class="ml-2"-->
    <!--        >-->
    <!--          {{ strings.translate(item.item, "name") }}-->
    <!--        </span>-->
    <!--        <v-icon-->
    <!--          small-->
    <!--        >-->
    <!--          mdi-chevron-right-->
    <!--        </v-icon>-->
    <!--      </v-row>-->
    <!--    </template>-->
    <!--    <template v-slot:item.percentage="{ item }">-->
    <!--      {{ item.percentageText }}-->
    <!--    </template>-->
    <template v-slot:item="props">
      <tr>
        <td
          :class="{
            'px-3': $vuetify.breakpoint.smAndDown,
            'item-name-td-xs': $vuetify.breakpoint.xsOnly,
            'item-name-td-sm': $vuetify.breakpoint.smOnly
          }"
        >
          <v-row
            align="center"
            align-content="center"
            class="pl-2"
          >
            <Item
              :item="props.item.item"
              :ratio="0.6"
              disable-tooltip
              disable-link
            />
            <span
              class="ml-2"
            >
              {{ strings.translate(props.item.item, "name") }}
            </span>
            <v-icon
              small
            >
              mdi-chevron-right
            </v-icon>
          </v-row>
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
</template>

<script>
  import strings from "@/utils/strings";
  import Item from "@/components/global/Item";
  import DataSourceToggle from "@/components/stats/DataSourceToggle";

  export default {
    name: "DataTable",
    components: {DataSourceToggle, Item},
    props: {
      items: {
        type: Array,
        required: true
      },
      search: {
        type: String,
        default () {
          return ""
        }
      },
      type: {
        type: String,
        required: true
      }
    },
    data() {
      return {
      }
    },
    computed: {
      headers() {
        if (this.type === "stage") {
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
        } else {
          return [
            {
              text: this.$t("stats.headers.stage"),
              value: "stage",
              align: "left",
              sortable: false,
              width: "230px"
            },
            {
              text: this.$t("stats.headers.apCost"),
              value: "stage.apCost",
              align: "left",
              sortable: true,
            },
            {
              text: this.$t("stats.headers.times"),
              value: "times",
              align: "left",
              sortable: true,
            },
            {
              text: this.$t("stats.headers.quantity"),
              value: "quantity",
              align: "left",
              sortable: true,
            },
            {
              text: this.$t("stats.headers.percentage"),
              value: "percentage",
              align: "left",
              sortable: true,
            },
            {
              text: this.$t("stats.headers.apPPR"),
              value: "apPPR",
              align: "left",
              sortable: true,

            }
          ];
        }
      },
      strings () {
        return strings
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
    },
  }
</script>

<style>
  .stat-table th {
    padding-left: 8px;
    padding-right: 8px;
  }

  .item-name-td-xs {
    min-width: 100px;
  }

  .item-name-td-sm {
    min-width: 160px;
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
</style>