<template>
  <v-container
    fluid
  >
    <v-row
      no-gutters
      class="px-2"
      align="center"
      justify="center"
    >
      <v-col cols="3">
        <v-switch label="Consider by-products" />
      </v-col>
      <v-col cols="3">
        <v-switch label="Require large amount of EXP" />
      </v-col>
      <v-col cols="3">
        <v-switch label="Require large amount of LMB" />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="px-2 pb-2 mb-6"
      align="center"
      justify="center"
    >
      <v-col cols="3">
        <v-dialog
          v-model="import_export_dialog"
          width="500"
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
            <v-card-title class="headline">
              Import/Export
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
              >
                Import
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="3">
        <v-dialog
          v-model="fund_dress_dialog"
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
                @click="fund_dress_dialog = false"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="3">
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
        v-for="item in materialItems"
        :key="item.itemId"
        lg="1"
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
                :item="item"
                :ratio="1"
                disable-link
                tooltip-position="bottom"
              />
            </v-row>
          </v-container>
          <v-divider />
          <v-container class="px-0 pb-0 pt-3 ma-0">
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <v-col>
                <v-text-field
                  hide-details="true"
                  dense
                  label="已有"
                  @click:prepend="{}"
                  @click:append-outer="{}"
                  v-on="on"
                >
                  <template v-slot:prepend>
                    <v-btn
                      text
                      icon
                      x-small
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn
                      text
                      icon
                      x-small
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
                  hide-details="true"
                  dense
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
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn
                      text
                      icon
                      x-small
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

export default {
  name: "Planner",
  components: { Item },
  data: () => ({
    fund_dress_dialog: false,
    import_export_dialog: false,
  }),
  computed: {
    materialItems() {
      return get.items.all().filter(item => item.itemType === "MATERIAL" && item.itemId.length === 5);
    },
  }
};
</script>

<style scoped>
</style>