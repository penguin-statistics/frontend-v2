<template>
  <v-container
    fluid
  >
    <v-row
      no-gutters
      class="px-2 mx-10"
      align="center"
      justify="center"
    >
      <v-col>
        <v-switch label="Consider by-products" />
      </v-col>
      <v-col>
        <v-switch label="Require large amount of EXP" />
      </v-col>
      <v-col>
        <v-switch label="Require large amount of LMB" />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="px-2 pb-2 mb-6 mx-10"
      align="center"
      justify="center"
    >
      <v-col>
        <v-dialog
          v-model="importExportDialog"
          width="800"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="green"
              v-on="on"
            >
              Import/Export
            </v-btn>
          </template>
          <v-card>
            <v-tabs
              v-model="importExportDialogTab"
              background-color="green"
              color="white"
            >
              <v-tab>Import</v-tab>
              <v-tab>Export</v-tab>
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
                      Import
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-card-text class="white--text">
                    {{ exportJson }}
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="green"
                      text
                      @click="copyExportJson"
                    >
                      Copy
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col>
        <v-dialog
          v-model="fundDressDialog"
          width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="yellow darken-3"
              v-on="on"
            >
              众筹站长女装
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              众筹站长女装
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
      </v-col>
      <v-col>
        <v-btn color="red">
          Calculate
        </v-btn>
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
          class="pa-1 ma-0"
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
          <v-divider />
          <v-container class="px-0 pt-0 pb-1 ma-0">
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <v-col>
                <v-text-field
                  v-model.number="itemData.have"
                  hide-details
                  label="已有"
                  @click:prepend="{}"
                  @click:append-outer="{}"
                >
                  <template v-slot:prepend>
                    <v-btn
                      text
                      icon
                      x-small
                      @click="itemData.have = decrement(itemData.have)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn
                      text
                      icon
                      x-small
                      @click="itemData.have = increment(itemData.have)"
                    >
                      <v-icon>mdi-plus</v-icon>
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
                  label="需求"
                  @click:prepend="{}"
                  @click:append-outer="{}"
                  v-on="on"
                >
                  <template v-slot:prepend>
                    <v-btn
                      text
                      icon
                      x-small
                      @click="itemData.need = decrement(itemData.need)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn
                      text
                      icon
                      x-small
                      @click="itemData.need = increment(itemData.need)"
                    >
                      <v-icon>mdi-plus</v-icon>
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
      let items = get.items.all().filter(item => item.itemType === "MATERIAL" && item.itemId.length === 5);
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
</style>