<template>
  <v-container
    fluid
    class="fill-height align-content-center justify-center"
  >
    <v-dialog
      v-model="calculation.done"
      scrollable
      max-width="calc(max(450px, 80vw))"
    >
      <v-card v-if="calculation.done">
        <v-card-title
          class="indigo pb-4 elevation-2 white--text"
          style="background: #a14042; line-height: 1.1;"
        >
          <div
            class="overline d-block"
            style="width: 100%"
          >
            ArkPlanner
          </div>
          <br>
          <div
            class="headline font-weight-bold d-block"
            style="width: 100%"
          >
            {{ $t('planner.calculation.title') }}
          </div>
        </v-card-title>
        <v-card-text>
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="my-2"
          >
            <v-col
              cols="12"
              sm="4"
              md="4"
              lg="4"
              xl="4"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-cash</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    {{ calculation.data.gold.toLocaleString() }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('planner.calculation.lmb') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
              lg="4"
              xl="4"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-brain</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    {{ calculation.data.cost.toLocaleString() }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('planner.calculation.sanity') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
              lg="4"
              xl="4"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-card-bulleted</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    {{ calculation.data.exp.toLocaleString() }} EXP
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('planner.calculation.exp') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-tabs
            v-model="calculation.tab"
            icons-and-text 
            grow
            centered
            class="elevated-tab"
          >
            <v-tabs-slider />
            <v-tab
              v-for="tab in calculation.tabs"
              :key="tab.id"
            >
              {{ $t(tab.text) }}
              <v-icon>{{ tab.icon }}</v-icon>
            </v-tab>
            <v-tab-item>
              <v-alert
                v-if="!calculation.data.stages.length"
                type="warning"
                border="left"
                class="mt-4"
              >
                {{ $t('planner.calculation.noStage') }}
              </v-alert>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="[index, stage] in calculation.data.stages.entries()"
                  :key="stage.stage"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div class="title">
                        <span class="font-weight-bold headline">{{ stage.stage }}</span>
                        <small class="float-right">#{{ index + 1 }}</small>
                      </div>
                      <div class="display-1 text-center monospace font-weight-bold my-2">
                        {{ parseInt(stage.count).toLocaleString() }} <small class="title">{{ $t('planner.calculation.times') }}</small>
                      </div>
                      <div>
                        <div
                          v-for="material in stage.materials"
                          :key="material.name"
                          class="d-inline-flex mx-2 my-1 cursor-pointer"
                          @click="redirectItem(material.item.itemId)"
                        >
                          <v-badge
                            bottom
                            overlap
                            bordered
                            label
                            color="indigo"
                            :offset-x="24"
                            :offset-y="20"
                            :content="`×${material.value}`"
                          >
                            <Item
                              :item="material.item"
                            />
                          </v-badge>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-alert
                v-if="!calculation.data.syntheses.length"
                type="warning"
                border="left"
                class="mt-4"
              >
                {{ $t('planner.calculation.noSyntheses') }}
              </v-alert>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="synthesis in calculation.data.syntheses"
                  :key="synthesis.target.itemId"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div class="title d-block">
                        <Item
                          :item="synthesis.target.item"
                          disable-tooltip
                          class="float-right"
                          :ratio="0.5"
                        />
                        <span class="font-weight-bold headline">{{ synthesis.target.name }}</span>
                      </div>
                      <div class="display-1 text-center monospace font-weight-bold my-2">
                        &times;{{ parseInt(synthesis.count).toLocaleString() }}
                      </div>
                      <div
                        v-for="item in synthesis.items"
                        :key="item.name"
                        class="d-inline-flex mx-2 my-1 cursor-pointer"
                        @click="redirectItem(item.item.itemId)"
                      >
                        <v-badge
                          bottom
                          overlap
                          bordered
                          label
                          color="secondary"
                          :offset-x="24"
                          :offset-y="20"
                          :content="`×${item.value}`"
                        >
                          <Item
                            :item="item.item"
                          />
                        </v-badge>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="value in calculation.data.values"
                  :key="value.level"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div class="title">
                        <span class="font-weight-bold headline">{{ $t('planner.calculation.level') }} {{ value.level }}</span>
                      </div>
                      <div
                        v-for="item in value.materials"
                        :key="item.name"
                        class="d-inline-flex mx-4 my-1 cursor-pointer"
                        @click="redirectItem(item.item.itemId)"
                      >
                        <v-badge
                          bottom
                          overlap
                          bordered
                          label
                          color="secondary"
                          :offset-x="24"
                          :offset-y="20"
                          :content="`${item.value}`"
                        >
                          <Item
                            :item="item.item"
                          />
                        </v-badge>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
        </v-card-text>

        <v-card-actions class="elevation-4">
          <v-btn
            text
            block
            large
            @click="calculation.done = false"
          >
            <v-divider style="opacity: 0.3" />
            <span class="mx-4">
              <v-icon left>mdi-close</v-icon>{{ $t('meta.dialog.close') }}
            </span>
            <v-divider style="opacity: 0.3" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      fab
      bottom
      right
      fixed
      ripple
      color="primary"
      :loading="calculation.pending"
      @click="calculate"
    >
      <v-icon>
        mdi-calculator
      </v-icon>
    </v-btn>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="5"
        md="4"
        lg="3"
        xl="3"
        class="px-0"
      >
        <v-row
          no-gutters
          class="my-3 mx-6 flex-column"
          align="start"
        >
          <span class="title">
            {{ $t('planner.options._name') }}
          </span>
          <v-switch
            v-model="options.byProduct"
            :label="$t('planner.options.byProduct')"
            hide-details
          />
          <v-switch
            v-model="options.requireExp"
            :label="$t('planner.options.requireExp')"
            hide-details
          />
          <v-switch
            v-model="options.requireLmb"
            :label="$t('planner.options.requireLmb')"
            hide-details
          />
          <v-dialog
            v-model="options.excludeDialog"
            max-width="700px"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="mt-4"
                v-on="on"
              >
                <v-icon left>
                  mdi-cube
                </v-icon>
                {{ $t('planner.options.excludeStage') }}{{ exclude.length ? ` (${exclude.length})` : "" }}
              </v-btn>
            </template>
            <MultiStageSelector
              v-model="exclude"
              @close="options.excludeDialog = false"
            />
          </v-dialog>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="7"
        md="8"
        lg="9"
        xl="9"
        class="pt-0 pb-2 px-0"
      >
        <v-row
          no-gutters
          class="my-3 mx-6"
          align="center"
          justify="space-around"
        >
          <v-dialog
            v-model="importExportDialog"
            width="800"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="green white--text"
                class="my-1"
                large
                v-on="on"
              >
                <v-icon left>
                  mdi-file-restore
                </v-icon>
                {{ $t('planner.actions.importExport') }}
              </v-btn>
            </template>
            <v-card>
              <v-tabs
                v-model="importExportDialogTab"
                icons-and-text
                grow
                centered
                background-color="green"
                color="white"
              >
                <v-tab>
                  {{ $t('planner.actions.import') }}
                  <v-icon>
                    mdi-file-import
                  </v-icon>
                </v-tab>
                <v-tab>
                  {{ $t('planner.actions.export') }}
                  <v-icon>mdi-file-export</v-icon>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="importExportDialogTab">
                <v-tab-item>
                  <v-card flat>
                    <v-container class="pa-4">
                      <v-textarea
                        v-model="importJson"
                        dense
                        hide-details
                        outlined
                        rows="14"
                        class="monospace-pure planner-import-export"
                        placeholder="[{&quot;name&quot;:&quot;双极纳米片&quot;,&quot;need&quot;:4,&quot;have&quot;:0},{&quot;name&quot;:&quot;D32钢&quot;,&quot;need&quot;:4,&quot;have&quot;:0}...]"
                      />
                    </v-container>
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="green"
                        text
                        @click="importFromText"
                      >
                        {{ $t('planner.actions.import') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card
                    flat
                  >
                    <v-card-text
                      class="monospace-pure planner-import-export"
                    >
                      {{ exportJson }}
                    </v-card-text>
                    <v-divider />
                    <v-card-actions style="flex: 0 0 auto;">
                      <v-spacer />
                      <v-btn
                        color="green"
                        text
                        @click="copyExportJson"
                      >
                        {{ $t('planner.copy') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-dialog>
          <v-btn
            color="red white--text"
            class="my-1"
            :loading="calculation.pending"
            large
            @click="calculate"
          >
            <v-icon left>
              mdi-calculator
            </v-icon>
            {{ $t('planner.actions.calculate') }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      class="pt-2"
      dense
    >
      <v-col
        v-for="itemData in itemsData"
        :key="itemData.id"
        xl="1"
        md="2"
        sm="3"
        class="col-xs-1-2 col-md-1-10 col-lg-1-8"
        cols="4"
      >
        <v-card
          class="pa-2 ma-0 bkop-medium"
        >
          <v-container>
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <Item
                :item="items.get(itemData.id)"
                :ratio="1"
                disable-link
              />
            </v-row>
          </v-container>
          <v-container class="px-0 pt-0 pb-1 ma-0">
            <v-row
              align="center"
              justify="center"
              no-gutters
              class="mb-2"
            >
              <v-col class="d-flex align-center">
                <div
                  class="d-flex"
                  style="position: relative"
                >
                  <span
                    class="caption no-break--text field-caption white--text"
                  >
                    {{ $t('planner.have') }}
                  </span>
                </div>
                <number-input
                  v-model="itemData.have"
                  size="small"
                  center
                  controls
                  :placeholder="$t('planner.have')"
                  class="monospace font-weight-bold number-input-theme transition-all"
                  :class="{'number-input-theme--dense': $vuetify.breakpoint.smAndDown}"
                  :min="0"
                />
              </v-col>
            </v-row>
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <v-col class="d-flex align-center mt-2">
                <div
                  class="d-flex"
                  style="position: relative"
                >
                  <span
                    class="caption no-break--text field-caption white--text"
                  >
                    {{ $t('planner.need') }}
                  </span>
                </div>
                <NumberInput
                  v-model="itemData.need"
                  size="small"
                  center
                  controls
                  :placeholder="$t('planner.need')"
                  class="monospace font-weight-bold number-input-theme transition-all"
                  :class="{'number-input-theme--dense': $vuetify.breakpoint.smAndDown}"
                  :min="0"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import planner from "@/apis/planner";
  import get from "@/utils/getters";
  import Item from "@/components/global/Item";
  import NumberInput from "@/components/NumberInput";

  import * as clipboard from "clipboard-polyfill";
  import marshaller from "@/utils/marshaller";
  import snackbar from "@/utils/snackbar";
  import Console from "@/utils/Console";
  import strings from "@/utils/strings";
  import MultiStageSelector from "@/components/stats/MultiStageSelector";
  import {mapGetters} from "vuex";

  export default {
    name: "Planner",
    components: {MultiStageSelector, Item, NumberInput},
    data: () => {
      const items = get.items.all(true);
      return {
        fundDressDialog: false,
        importExportDialog: false,
        importExportDialogTab: null,
        importJson: "",
        items,
        itemsData: get.items.all(false)
          .filter(item => item.itemType === "MATERIAL" && item.itemId.length === 5 || item.itemType === "ARKPLANNER")
          .map(item => ({
            id: item.itemId,
            name: item.name,
            need: 0,
            have: 0,
          })),
        calculation: {
          pending: false,
          done: false,
          data: {},
          tab: null,
          tabs: [{
            id: "stages",
            icon: "mdi-cube",
            text: "planner.calculation.tabs.stages"
          }, {
            id: "syntheses",
            icon: "mdi-treasure-chest",
            text: "planner.calculation.tabs.syntheses"
          }, {
            id: "values",
            icon: "mdi-cash-usd",
            text: "planner.calculation.tabs.values"
          }]
        },
        options: {
          byProduct: false,
          requireExp: false,
          requireLmb: false,
          excludeDialog: false
        },
        getItem: get.items
      }
    },
    computed: {
      ...mapGetters("settings", ["excludedStages"]),
      exportJson() {
        return JSON.stringify(this.itemsData);
      },
      exclude: {
        get () {
          return this.excludedStages
        },
        set (val) {
          this.$store.commit("settings/changeExcludedStages", val)
        }
      }
    },
    methods: {
      calculate() {
        this.calculation.pending = true;
        planner.plan(
          marshaller.planner({
            items: this.itemsData,
            options: this.options,
            exclude: this.exclude
          })
        )
          .then(({data}) => {
            if (data.error === true) {
              return snackbar.launch("error", 15000, "planner.calculationError", {
                error: data.reason
              })
            }

            data.stages = data.stages.map(el => {
              el.materials = [];
              for (const [name, value] of Object.entries(el.items)) {
                const item = get.items.byName(name);
                el.materials.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            data.syntheses = data.syntheses.map(el => {
              el.target = {
                item: get.items.byName(el.target)
              };
              el.target.name = strings.translate(el.target.item, "name");
              el.items = [];
              for (const [name, value] of Object.entries(el.materials)) {
                const item = get.items.byName(name);
                el.items.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            data.values = data.values.map(el => {
              el.materials = [];
              for (const {name, value} of el.items) {
                if (parseFloat(value) === 0) continue;
                const itemObject = get.items.byName(name);
                el.materials.push({
                  name: strings.translate(itemObject, "name"),
                  item: itemObject,
                  value
                })
              }
              return el
            });
            Console.debug("Planner", data)
            this.$set(this.calculation, "data", data);
            this.calculation.done = true
          })
          .catch((err) => {
            Console.error("Planner", "failed to refresh plan", err)
            snackbar.networkError()
          })
          .finally(() => {
            this.calculation.pending = false;
          })
      },
      importFromText () {
        let imported;
        try {
          imported = JSON.parse(this.importJson);
        } catch (e) {
          Console.info("PlannerImport", "json error", e)
          snackbar.launch("error", 5000, "planner.import.jsonError", {
            error: e.toString()
          });
          return
        }
        this.importToItemsData(imported)
      },
      importToItemsData(imported) {
        const convertedImported = [];
        for (const itemData of imported) {
          if (!(itemData.hasOwnProperty("need") && Number.isInteger(itemData.need) && itemData.need >= 0 &&
            itemData.hasOwnProperty("have") && Number.isInteger(itemData.have) && itemData.have >= 0)) {
            Console.info("PlannerImport", "one of the item data is invalid. not importing this and continue to the next one (reason: need or have invalid): ", itemData)
            continue
          }
          const haveId = itemData.hasOwnProperty("id");
          const haveName = itemData.hasOwnProperty("name");
          if (haveId) {
            if (!haveName) {
              itemData.name = get.items.byItemId(itemData.id).name
            }
            convertedImported.push(itemData)
          } else if (!haveId) {
            if (!haveName) {
              Console.info("PlannerImport", "one of the item data is invalid. not importing this and continue to the next one (reason: no id and name): ", itemData)
              continue
            }
            const item = get.items.byName(itemData.name);
            convertedImported.push({
              id: item.itemId,
              name: item.name,
              need: itemData.need,
              have: itemData.have
            })
          }
        }

        let importedCounter = 0;

        for (const item of convertedImported) {
          const object = this.itemsData.find(el => el.id === item.id);
          if (!object) {
            Console.info("PlannerImport","no item found with", item);
            continue
          }
          object.have = item.have;
          object.need = item.need;
          importedCounter++;
        }

        this.importJson = "";
        this.importExportDialog = false;
        snackbar.launch("success", 5000, "planner.import.success", {
          amount: importedCounter
        })
      },
      copyExportJson() {
        clipboard.writeText(this.exportJson)
          .then(() => {
            snackbar.launch("success", 5000, "clipboard.success")
          })
          .catch(() => {
            snackbar.launch("error", 5000, "clipboard.error")
          })
      },
      redirectItem(itemId) {
        this.$router.push({
          name: "StatsByItem_SelectedItem",
          params: {
            itemId
          }
        })
      }
    }
  };
</script>

<style scoped>
  @media (max-width: 380px) {
    .col-xs-1-2 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      max-width: 50%;
    }
  }

  @media (min-width: 1264px) and (max-width: 1584px) {
    .col-lg-1-8 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 12.5%;
      flex: 0 0 12.5%;
      max-width: 12.5%
    }
  }

  @media (min-width: 1584px) and (max-width: 1904px) {
    .col-md-1-10 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 10%;
      flex: 0 0 10%;
      max-width: 10%
    }
  }

  .planner-import-export, ::v-deep .planner-import-export textarea {
    word-break: break-all;
    line-height: 1.2 !important;
    font-size: 12px;
  }

  ::v-deep .planner-import-export textarea {
    padding: 8px 0;
  }

  .card-item {
    border: 2px solid #4350b0;
    height: 100%
  }

  ::v-deep .number-input-theme--dense .number-input__button--minus {
    border-radius: 15px 0 0 15px !important;
  }
  ::v-deep .number-input-theme--dense .number-input__button--plus {
    border-radius: 0 15px 15px 0 !important;
  }
  ::v-deep .number-input-theme--dense .number-input__button::before {
    width: 14px;
  }
  ::v-deep .number-input-theme--dense .number-input__button {
    width: 24px !important;
  }
  ::v-deep .number-input-theme--dense .number-input__button:hover {
    width: 30px !important;
  }
  ::v-deep .number-input-theme--dense .number-input__input {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .field-caption {
    top: -30px;
    left: 20px;
    position: absolute;
    background: rgba(0, 0, 0, .98);
    font-weight: bold;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 11px !important;
    z-index: 4;

    user-select: none;
  }

  ::v-deep .v-tabs .v-slide-group__prev {
    display: none !important;
  }


</style>