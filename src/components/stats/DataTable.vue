<i18n>
  {
    "zh": {
      "scroll": "左右滑动查看数据"
    },
    "en": {
      "scroll": "Scroll to view details"
    },
    "ja": {
      "scroll": "Scroll to view details"
    }
  }
</i18n>

<template>
  <div>
    <v-row
      v-if="$vuetify.breakpoint.xsOnly"
      align="center"
      justify="center"
      class="mt-1 mb-3"
    >
      <span
        class="caption grey--text"
      >
        <v-icon
          small
          color="grey"
          class="scroll-chevron-left mr-1"
        >
          mdi-chevron-double-left
        </v-icon>

        <span
          class="scroll-keyword"
        >{{ $t('scroll') }}</span>

        <v-icon
          small
          color="grey"
          class="scroll-chevron-right ml-1"
        >
          mdi-chevron-double-right
        </v-icon>
      </span>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :options="options"

      must-sort
      sort-by="percentage"
      :sort-desc="true"
      :locale="$i18n.locale"

      :calculate-widths="true"
      hide-default-footer
      :mobile-breakpoint="1"
      :loading="matrixPending"

      :class="{'elevation-0 transparentTable stat-table container--fluid px-2': true, 'pt-0': $vuetify.breakpoint.xsOnly}"
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
                  disable-tooltip
                  disable-link

                  class="item-icon"
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
                  class="ml-2"
                >
                  {{ props.item.stage.code }}
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
            <td
              :class="tableCellClasses"
              class="yellow--text"
            >
              {{ props.item.stage.apCost }}
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
            :class="tableCellClasses"
          >
            <!--          <div-->
            <!--            class="charts-data-wrapper"-->
            <!--            fill-height-->
            <!--          >-->
            <!--            -->
            <!--            <div-->
            <!--              class="charts-wrapper cursor-pointer"-->
            <!--              fill-height-->
            <!--            >-->
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
            <!--            </div>-->
            <!--          </div>-->
            {{ props.item.percentageText }}
          </td>
          <td
            :class="tableCellClasses"
          >
            {{ props.item.apPPR }}
          </td>
        </tr>
      </template>
      <!--          <template v-slot:item.percentage="{item}">-->
      <!--            <span class="px-0">-->
      <!--              {{ item.percentageText }}-->
      <!--            </span>-->
      <!--          </template>-->
    </v-data-table>
  </div>
</template>

<script>
  import strings from "@/utils/strings";
  import get from "@/utils/getters";
  import Item from "@/components/global/Item";
  import {mapGetters} from "vuex";

  export default {
    name: "DataTable",
    components: {Item},
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
        options: {
          itemsPerPage: -1
        },
        tableCellClasses: "px-2 font-weight-bold",
        hideItemName: false
      }
    },
    computed: {
      ...mapGetters('ajax', ['matrixPending']),
      headers() {
        const headers = [
          {
            text: this.$t("stats.headers.quantity"),
            value: "quantity",
            align: "left",
            sortable: true,
            width: "85px"
          },
          {
            text: this.$t("stats.headers.times"),
            value: "times",
            align: "left",
            sortable: true,
            width: "85px"
          },
          {
            text: this.$t("stats.headers.percentage"),
            value: "percentage",
            align: "left",
            sortable: true,
            width: "100px"
          },
          {
            text: this.$t("stats.headers.apPPR"),
            value: "apPPR",
            align: "left",
            sortable: true,
            width: "110px"
          }
        ];

        if (this.type === "stage") {
          headers.unshift({
            text: this.$t("stats.headers.item"),
            value: "icon",
            align: "left",
            sortable: false,
            width: "250px"
          });
        } else {
          headers.unshift({
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
              width: "70px"
            })
        }
        return headers
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
      redirectStage(stageId) {
        const got = get.stages.byStageId(stageId);
        this.$router.push({
          name: "StatsByStage_Selected",
          params: {
            zoneId: got.zoneId,
            stageId
          }
        });
      }
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

  .stat-table {
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

  .item-name, .item-name--chevron, .item-name--text {
    transition: text-shadow .1s cubic-bezier(.25,.8,.5,1), filter .1s cubic-bezier(.25,.8,.5,1), transform .225s cubic-bezier(.25,.8,.5,1), opacity .225s cubic-bezier(.25,.8,.5,1) !important;
  }
  .item-name--text {
    z-index: 0;
  }
  .item-name {
    text-shadow: none;
    filter: none;
  }
  .theme--dark .item-name:hover {
    text-shadow: 0 0 8px rgba(255, 255, 255, .6);
  }
  .theme--light .item-name:hover {
    text-shadow: 0 0 4px rgba(0, 0, 0, .2);
  }

  .item-name:hover .item-name--chevron {
    transform: translateX(4px) scale(1.3) rotate(-60deg);
  }
  .item-name:active .item-name--chevron {
    transform: translateX(4px) scale(1.05) rotate(-60deg);
  }

  .item-name--line {
    opacity: 0;
  }

  .item-name:hover .item-name--line {
    opacity: 1;
  }

  .scroll-chevron-left {
    margin-top: -3px;
    animation: scroll-left 3.5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  .scroll-keyword {
    animation: scroll-keyword 3.5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  .scroll-chevron-right {
    margin-top: -3px;
    animation: scroll-right 3.5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  @keyframes scroll-left {
    from {
      transform: translateX(0px);
      filter: brightness(1);
    }
    50% {
      transform: translateX(-5px);
      filter: brightness(2);
    }
    to {
      transform: translateX(0px);
      filter: brightness(1);
    }
  }

  @keyframes scroll-right {
    from {
      transform: translateX(0px);
      filter: brightness(1);
    }
    50% {
      transform: translateX(5px);
      filter: brightness(2);
    }
    to {
      transform: translateX(0px);
      filter: brightness(1);
    }
  }

  @keyframes scroll-keyword {
    from {
      filter: brightness(1);
    }
    30% {
      filter: brightness(1.5);
    }
    to {
      filter: brightness(1);
    }
  }

  .item-icon {
    position: absolute;
    z-index: 4
  }
</style>