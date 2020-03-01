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
        "importExport": "@:(actions.import)@:(meta.separator)@:(actions.export)",
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
        "importExport": "@:(actions.import)@:(meta.separator)@:(actions.export)",
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
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="3"
        xl="3"
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
        sm="12"
        md="8"
        lg="9"
        xl="9"
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
          <v-btn color="red">
            {{ $t('actions.calculate') }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    
    <v-divider />
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
        class="col-lg-1-8"
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
                :item="itemIdMap.get(itemData.id)"
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
                  dense
                  hide-details
                  :label="$t('have')"
                  @click:prepend-inner="{}"
                  @click:append="{}"
                >
                  <template v-slot:prepend-inner>
                    <v-btn
                      text
                      icon
                      x-small
                      @click="itemData.have = decrement(itemData.have)"
                    >
                      <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      text
                      icon
                      x-small
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
                  dense
                  :label="$t('need')"
                  @click:prepend-inner="{}"
                  @click:append="{}"
                >
                  <template v-slot:prepend-inner>
                    <v-btn
                      text
                      icon
                      x-small
                      @click="itemData.need = decrement(itemData.need)"
                    >
                      <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      text
                      icon
                      x-small
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
      let items = get.items.all().filter(item => item.itemType === "MATERIAL" && item.itemId.length === 5 || item.itemType === "ARKPLANNER");
      return {
        fundDressDialog: false,
        importExportDialog: false,
        importExportDialogTab: null,
        importJson: "",
        items: items,
        itemIdMap: new Map(items.map(item => [item.itemId, item])),
        itemsData: items.map(item => ({
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
      importToItemsData() {
        let imported = JSON.parse(this.importJson);
        if (imported.length !== this.itemsData.length)
          return;
        let importedAsMap = new Map();
        for (const itemData of imported)
          if (!(itemData.hasOwnProperty("id") && this.itemIdMap.has(itemData.id) &&
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
  @media (min-width: 1264px) and (max-width: 1903px) {
    .col-lg-1-8 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 12.5%;
      flex: 0 0 12.5%;
      max-width: 12.5%
    }
  }
  .planner-export {
    word-break: break-all;
    line-height: 1.1 !important;
    font-size: 12px;
    height: 300px;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    flex: 1 1 auto;
    overflow-y: auto;
  }
</style>