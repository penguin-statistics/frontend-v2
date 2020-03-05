<i18n>
  {
    "zh": {
      "options": {
        "_name": "选项",
        "byProduct": "计算合成副产物",
        "requireExp": "大量需求经验",
        "requireLmb": "大量需求龙门币"
      },
      "actions": {
        "import": "导入",
        "export": "导出",
        "importExport": "@:(actions.import)/@:(actions.export)",
        "becomeIdol": "众筹站长女装",
        "calculate": "计算规划"
      },
      "have": "已有",
      "need": "需要",
      "copy": "复制到剪贴板",
      "calculation": {
        "title": "规划结果",
        "tabs": {
          "stages": "关卡列表",
          "syntheses": "合成列表",
          "values": "素材价值"
        },
        "lmb": "预计龙门币收益",
        "sanity": "预计需要理智",
        "exp": "预计获得录像带经验",
        "times": "次",
        "items": "将得到物品",
        "level": "素材等级",
        "noStage": "未找到需要作战的关卡。是不是忘记选择所需素材了？",
        "noSyntheses": "未找到需要合成的素材。是不是忘记选择所需素材了？"
      }
    },
    "en": {
      "options": {
        "_name": "Options",
        "byProduct": "Consider by-products",
        "requireExp": "Require large amount of EXP",
        "requireLmb": "Require large amount of LMB"
      },
      "actions": {
        "import": "Import",
        "export": "Export",
        "importExport": "@:(actions.import)/@:(actions.export)",
        "becomeIdol": "Become Idol!",
        "calculate": "Calculate"
      },
      "have": "Have",
      "need": "Need",
      "copy": "Copy to Clipboard",
      "calculation": {
        "title": "Calculation Result",
        "tabs": {
          "stages": "Stages",
          "syntheses": "Syntheses",
          "values": "Values"
        },
        "lmb": "Estimated LMB income",
        "sanity": "Estimated Sanity required",
        "exp": "Estimated EXP from Battle Records",
        "times": "battles",
        "items": "Will get",
        "level": "Material Level",
        "noStage": "No stage found. Have you selected any material yet?",
        "noSyntheses": "No syntheses found. Have you selected any material yet?"
      }
    }
  }
</i18n>

<template>
  <v-container
    fluid
    class="fill-height align-content-center justify-center"
  >
    <v-dialog
      v-model="calculation.done"
      persistent
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
            {{ $t('calculation.title') }}
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
                    {{ $t('calculation.lmb') }}
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
                    {{ $t('calculation.sanity') }}
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
                    {{ $t('calculation.exp') }}
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
                {{ $t('calculation.noStage') }}
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
                      <div class="display-1 text-center monospace font-weight-bold mb-2">
                        {{ parseInt(stage.count).toLocaleString() }} <small class="title">{{ $t('calculation.times') }}</small>
                      </div>
                      <div class="subtitle-1">
                        {{ $t('calculation.items') }}
                      </div>
                      <ul class="pl-2">
                        <li
                          v-for="[name, value] in Object.entries(stage.items)"
                          :key="name"
                          class="d-flex align-center"
                        >
                          <span class="font-weight-bold">{{ name }}</span>
                          <v-divider class="mx-2" />
                          <span class="monospace float-right">&times;{{ value }}</span>
                        </li>
                      </ul>
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
                {{ $t('calculation.noSyntheses') }}
              </v-alert>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="[index, synthesis] in calculation.data.syntheses.entries()"
                  :key="synthesis.target"
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
                        <span class="font-weight-bold headline">{{ synthesis.target }}</span>
                        <small class="float-right">#{{ index + 1 }}</small>
                      </div>
                      <div class="display-1 text-center monospace font-weight-bold mb-2">
                        &times;{{ parseInt(synthesis.count).toLocaleString() }}
                      </div>
                      <ul class="pl-2">
                        <li
                          v-for="[name, value] in Object.entries(synthesis.materials)"
                          :key="name"
                          class="d-flex align-center"
                        >
                          <span class="font-weight-bold">{{ name }}</span>
                          <v-divider class="mx-2" />
                          <span class="monospace float-right">&times;{{ value }}</span>
                        </li>
                      </ul>
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
                        <span class="font-weight-bold headline">{{ $t('calculation.level') }} {{ value.level }}</span>
                      </div>
                      <ul class="pl-2">
                        <li
                          v-for="item in value.items"
                          :key="item.name"
                          class="d-flex align-center"
                        >
                          <span class="font-weight-bold">{{ item.name }}</span>
                          <v-divider class="mx-2" />
                          <span class="monospace float-right">{{ item.value }}</span>
                        </li>
                      </ul>
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
              <v-icon left>mdi-close</v-icon>{{ $t('dialog.close') }}
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
          class="my-3 mx-6"
          align="center"
          justify="center"
        >
          <v-col cols="12">
            <span class="title">
              {{ $t('options._name') }}
            </span>
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.byProduct"
              :label="$t('options.byProduct')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.requireExp"
              :label="$t('options.requireExp')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.requireLmb"
              :label="$t('options.requireLmb')"
              hide-details
            />
          </v-col>
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
                {{ $t('actions.importExport') }}
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
                  {{ $t('actions.import') }}
                  <v-icon>
                    mdi-file-import
                  </v-icon>
                </v-tab>
                <v-tab>
                  {{ $t('actions.export') }}
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
                        class="monospace planner-import-export"
                        placeholder="[{&quot;name&quot;:&quot;双极纳米片&quot;,&quot;need&quot;:4,&quot;have&quot;:0},{&quot;name&quot;:&quot;D32钢&quot;,&quot;need&quot;:4,&quot;have&quot;:0}...]"
                      />
                    </v-container>
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="green"
                        text
                        @click="importToItemsData"
                      >
                        {{ $t('actions.import') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text
                      class="monospace planner-import-export"
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
                        {{ $t('copy') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-dialog>
          <!--          <v-dialog-->
          <!--            v-model="fundDressDialog"-->
          <!--            width="500"-->
          <!--          >-->
          <!--            <template v-slot:activator="{ on }">-->
          <!--              <v-btn-->
          <!--                color="yellow darken-3"-->
          <!--                class="my-1"-->
          <!--                v-on="on"-->
          <!--              >-->
          <!--                {{ $t('actions.becomeIdol') }}-->
          <!--              </v-btn>-->
          <!--            </template>-->
          <!--            <v-card>-->
          <!--              <v-card-title class="headline">-->
          <!--                {{ $t('actions.becomeIdol') }}-->
          <!--              </v-card-title>-->
          <!--              <v-card-actions>-->
          <!--                <v-spacer />-->
          <!--                <v-btn-->
          <!--                  color="primary"-->
          <!--                  text-->
          <!--                  @click="fundDressDialog = false"-->
          <!--                >-->
          <!--                  OK-->
          <!--                </v-btn>-->
          <!--              </v-card-actions>-->
          <!--            </v-card>-->
          <!--          </v-dialog>-->
          <v-btn
            color="red white--text"
            class="my-1"
            :loading="calculation.pending"
            large
            @click="calculate"
          >
            {{ $t('actions.calculate') }}
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
                tooltip-position="bottom"
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
                    {{ $t('have') }}
                  </span>
                </div>
                <number-input
                  v-model="itemData.have"
                  size="small"
                  center
                  controls
                  :placeholder="$t('have')"
                  class="monospace font-weight-bold number-input-theme transition-all"
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
                    {{ $t('need') }}
                  </span>
                </div>
                <number-input
                  v-model="itemData.need"
                  size="small"
                  center
                  controls
                  :placeholder="$t('need')"
                  class="monospace font-weight-bold number-input-theme transition-all"
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

  import * as clipboard from "clipboard-polyfill";
  import marshaller from "@/utils/marshaller";

  export default {
    name: "Planner",
    components: {Item},
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
            text: "calculation.tabs.stages"
          }, {
            id: "syntheses",
            icon: "mdi-treasure-chest",
            text: "calculation.tabs.syntheses"
          }, {
            id: "values",
            icon: "mdi-cash-usd",
            text: "calculation.tabs.values"
          }]
        },
        options: {
          byProduct: false,
          requireExp: false,
          requireLmb: false
        }
      }
    },
    computed: {
      exportJson() {
        return JSON.stringify(this.itemsData);
      }
    },
    methods: {
      calculate() {
        this.calculation.pending = true;
        planner.plan(
          marshaller.planner({
            items: this.itemsData,
            options: this.options
          })
        )
          .then(({data}) => {
            console.log(data);
            this.$set(this.calculation, "data", data);
            this.calculation.done = true
          })
          .finally(() => {
            this.calculation.pending = false;
          })
      },
      // fontSize (v) {
      //   return {fontSize: `${(16 + (v.toString().length * -1.8)) * (document.body.clientWidth / 800)}px`}
      //   // return {fontSize: `${2 - (v.toString().length - 1) * 0.5}ch`}
      // },
      importToItemsData() {
        let imported;
        try {
          imported = JSON.parse(this.importJson);
        } catch (e) {
          alert(e);
          return
        }
        if (imported.length !== this.itemsData.length)
          return;
        let importedAsMap = new Map();
        for (const itemData of imported)
          if (!(itemData.hasOwnProperty("id") && this.items.has(itemData.id) &&
            itemData.hasOwnProperty("need") && Number.isInteger(itemData.need) && itemData.need >= 0 &&
            itemData.hasOwnProperty("have") && Number.isInteger(itemData.have) && itemData.have >= 0))
            return;
          else
            importedAsMap.set(itemData.id, [itemData.need, itemData.have]);
        let newItemsData = [];
        for (const item of this.items) {
          let importedItem = importedAsMap.get(item.itemId);
          newItemsData.push({id: item.itemId, need: importedItem[0], have: importedItem[1]});
        }
        this.itemsData = newItemsData;
        this.importExportDialog = false;
      },
      copyExportJson() {
        clipboard.writeText(this.exportJson);
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
    line-height: 1.1 !important;
    font-size: 12px;
    max-height: 300px;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    flex: 1 1 auto;
    overflow-y: auto;
  }

  .fix-icon--left {
    transform: translate(-2px, -3.5px)
  }

  .fix-icon--right {
    transform: translate(2px, -3.5px)
  }

  ::v-deep .input-field input {
    text-align: center !important;
    /*font-family: SF Mono, "Droid Sans Mono", Ubuntu Mono, Consolas, Courier New, Courier, monospace;*/
    font-weight: bold;
  }

  ::v-deep .input-field .v-input__slot {
    padding: 0 6px !important;
  }

  ::v-deep .input-field legend {
    margin: 0 6px !important;
  }

  ::v-deep .input-field label {
    margin: 0 12px !important;
    max-width: none;
  }


  ::v-deep .input-field--is-zero input {
    opacity: 0.5
  }

  .card-item {
    border: 2px solid #4350b0;
    height: 100%
  }

  ::v-deep .number-input-theme .number-input__input {
    background: rgba(0, 0, 0, .2) !important;
    border: 1px solid #ddd;
    border-radius: 1rem !important;
    top: 0 !important;
  }

  ::v-deep .number-input-theme .number-input__input:hover {
    background: rgba(0, 0, 0, .35) !important;
  }
  ::v-deep .number-input-theme .number-input__input:focus {
    background: rgba(0, 0, 0, .5) !important;
    border: 1px solid #0074d9;
    /*border: none;*/
    /*box-shadow: 0 0 0 1px #0074d9;*/
  }

  ::v-deep .theme--light .number-input-theme .number-input__input:hover {
    background: rgba(0, 0, 0, .17) !important;
  }
  ::v-deep .theme--light .number-input-theme .number-input__input:focus {
    background: rgba(0, 0, 0, .35) !important;
  }

  ::v-deep .number-input-theme .number-input__button {
    border: 1px solid #ddd !important;
    border-radius: 50% !important;
    top: 2px !important;
    height: 27px !important;
    width: 27px !important;
    transition: all .225s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  ::v-deep .number-input-theme .number-input__button:hover {
    transform: scale(1.15);
  }
  ::v-deep .number-input-theme .number-input__button:active {
    transform: scale(1.05);
  }

  ::v-deep .number-input-theme .number-input__button--minus {
    left: 2px !important;
  }
  ::v-deep .number-input-theme .number-input__button--plus {
    right: 2px !important;
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

</style>