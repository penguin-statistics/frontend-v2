<i18n>
  {
    "zh": {
      "choose": {
        "name": "选择物品"
      },
      "result": {
        "name": "统计结果"
      }
    },
    "en": {
      "choose": {
        "name": "Choose Item"
      },
      "result": {
        "name": "Statistics"
      }
    }
  }
</i18n>

<template>
  <v-stepper
    v-model="step"
    class="bkop-light transparent"
  >
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        {{ $t('choose.name') }}
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
      <v-stepper-content :step="1">
        <v-list
          v-for="category in categorizedItems"
          v-if="categorizedItems.length > 0"
          :key="category.id"
          subheader
          class="transparent"
        >
          <v-subheader inset>
            {{ category.items[0].meta.name }}
          </v-subheader>

          <v-list-tile
            v-for="item in category.items"
            :key="item.itemId"
            v-ripple
            avatar
            @click="storeItemSelection(item.itemId)"
          >
            <v-list-tile-avatar>
              <v-avatar>
                <Item
                  :item="item"
                  :ratio="0.75"
                  disable-link
                  disable-tooltip
                />
              </v-avatar>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon color="grey lighten-1">
                mdi-chevron-right
              </v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-stepper-content>

      <v-stepper-content :step="2">
        <v-data-table
          :headers="tableHeaders"
          :items="itemStagesStats"
          :pagination.sync="tablePagination"

          must-sort
          hide-actions
          class="elevation-0 transparentTable"
        >
          <template v-slot:items="props">
            <td>
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
            <td class="text-xs-right">
              {{ props.item.stage.apCost }}
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
    name: "StatsByItem",
    components: {Item},
    data: () => ({
      step: 1,
      selected: {
        item: null
      },
      tablePagination: {
        rowsPerPage: -1,
        sortBy: "percentage",
        descending: true
      }
    }),
    computed: {
      tableHeaders () {
        return [
          {
            text: this.$t('stats.headers.stage'),
            value: "icon",
            align: "center",
            sortable: false,
            width: "200"
          },
          {
            text: this.$t('stats.headers.apCost'),
            value: "stage.apCost",
            align: "center",
            sortable: true,
            width: "30",
          },
          {
            text: this.$t('stats.headers.times'),
            value: "times",
            align: "center",
            sortable: true,
            width: "30",
          },
          {
            text: this.$t('stats.headers.quantity'),
            value: "quantity",
            align: "center",
            sortable: true,
            width: "30",
          },
          {
            text: this.$t('stats.headers.percentage'),
            value: "percentage",
            align: "center",
            sortable: true,
            width: "1"
          },
          {
            text: this.$t('stats.headers.apPPR'),
            value: "apPPR",
            align: "center",
            sortable: true,
            width: "1"
          }
        ]
      },
      categorizedItems () {
        let all = get.item.all();
        const categories = ["MATERIAL", "CARD_EXP", "FURN"];
        let results = [];
        for (let category of categories) {
          results.push({
            id: category,
            items: all.filter(el => el.itemType === category)
          })
        }
        return results
      },
      itemStagesStats() {
        if (!this.selected.item) return [];
        return get.statistics.byItemId(this.selected.item.itemId);
      }
    },
    watch: {
      step: function(newValue, oldValue) {
        console.log("step changed from", oldValue, "to", newValue);
        switch (newValue) {
          case 1:
            console.log("- [router go] index");
            this.$router.push({name: "StatsByItem"});
            break;
          case 2:
            console.log("- [router go] item", this.selected.item.itemId);
            this.$router.push({name: "StatsByItem_SelectedItem", params: {itemId: this.selected.item.itemId}});
            break;
          default:
            console.error("unexpected step number", newValue, "with [newStep, oldStep]", [newValue, oldValue])
        }
      }
    },
    beforeMount() {
      (this.$route.params.itemId) && (this.selected.item = get.item.byItemId(this.$route.params.itemId)) && (this.step += 1);
    },
    methods: {
      storeItemSelection(itemId) {
        this.selected.item = get.item.byItemId(itemId);
        this.step += 1
      },
      redirectStage ({zone, stage}) {
        this.$router.push({
          name: 'StatsByStage_SelectedBoth',
          params: {
            zoneId: zone.zoneId,
            stageId: stage.stageId
          }
        })
      }
    }
  }
</script>

<style scoped>
  .v-table {
    background: transparent !important;
  }
</style>
