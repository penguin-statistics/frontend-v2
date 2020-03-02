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
      "copy": "复制到剪贴板"
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
      "copy": "Copy to Clipboard"
    }
  }
</i18n>

<template>
  <v-container
    fluid
    class="fill-height align-content-center justify-center"
  >
    <v-btn
      fab
      bottom
      right
      fixed
      ripple
      color="primary"
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
              :label="$t('options.byProduct')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              :label="$t('options.requireExp')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
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
          justify="space-between"
        >
          <v-dialog
            v-model="importExportDialog"
            width="800"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="green"
                class="my-1"
                v-on="on"
              >
                {{ $t('actions.importExport') }}
              </v-btn>
            </template>
            <v-card>
              <v-tabs
                v-model="importExportDialogTab"
                background-color="green"
                color="white"
              >
                <v-tab>{{ $t('actions.import') }}</v-tab>
                <v-tab>{{ $t('actions.export') }}</v-tab>
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
                      class="white--text monospace planner-export"
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
          <v-dialog
            v-model="fundDressDialog"
            width="500"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="yellow darken-3"
                class="my-1"
                v-on="on"
              >
                {{ $t('actions.becomeIdol') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                {{ $t('actions.becomeIdol') }}
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  text
                  @click="fundDressDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            color="red"
            class="my-1"
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
          class="pa-1 ma-0 bkop-medium"
        >
          <v-container class="px-0 py-2 ma-0">
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
              <v-col>
                <v-text-field
                  v-model.number="itemData.have"
                  outlined
                  rounded
                  dense
                  hide-details
                  :label="$t('have')"
                  class="input-field transition-all"
                  :class="{'input-field--is-zero': itemData.have === 0}"
                  @click:prepend-inner="{}"
                  @click:append="{}"
                >
                  <template v-slot:prepend-inner>
                    <v-btn
                      icon
                      left
                      class="fix-icon--left"
                      :disabled="itemData.have === 0"
                      @click="itemData.have = decrement(itemData.have)"
                    >
                      <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      icon
                      left
                      class="fix-icon--right"
                      @click="itemData.have = increment(itemData.have)"
                    >
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <v-col>
                <v-text-field
                  v-model.number="itemData.need"
                  hide-details
                  outlined
                  rounded
                  dense
                  :label="$t('need')"
                  class="input-field transition-all"
                  :class="{'input-field--is-zero': itemData.need === 0}"
                  @click:prepend-inner="{}"
                  @click:append="{}"
                >
                  <template v-slot:prepend-inner>
                    <v-btn
                      icon
                      left
                      class="fix-icon--left"
                      :disabled="itemData.need === 0"
                      @click="itemData.need = decrement(itemData.need)"
                    >
                      <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      icon
                      left
                      class="fix-icon--right"
                      @click="itemData.need = increment(itemData.need)"
                    >
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import get from "@/utils/getters";
  import Item from "@/components/global/Item";

  import * as clipboard from "clipboard-polyfill";

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
            need: 0,
            have: 0,
          }))
      }
    },
    computed: {
      exportJson() {
        return JSON.stringify(this.itemsData);
      }
    },
    methods: {
      decrement(orig) {
        if (orig > 0)
          return orig - 1;
        return 0;
      },
      increment(orig) {
        return orig + 1;
      },
      calculate () {

      },
      importToItemsData() {
        let imported = JSON.parse(this.importJson);
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
  .planner-export {
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
</style>