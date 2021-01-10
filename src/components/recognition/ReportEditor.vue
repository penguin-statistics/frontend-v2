<template>
  <v-container
    class="fill-height align-start"
    fluid
  >
    <StageSelector
      :name="$t('report.name')"
      :stage="reportdata.StageCode"
      hide-closed
      class="pa-3"
      @select="select"
    >
      <v-card
        v-if="selected.stage"
        class="bkop-light pa-2"
      >
        <v-overlay
          :opacity="0.75"
          absolute
          :value="invalidStage"
          :class="{ 'slash-strip--warning-transparent': invalidStage }"
          z-index="4"
        >
          <v-row
            v-if="invalidStage"
            align="center"
            justify="center"
            class="fill-height text-center mx-3"
          >
            <v-icon
              large
              class="d-block mb-3"
              style="width: 100%"
            >
              mdi-cancel
            </v-icon>
            <span class="title">
              {{ $t("report.closedReason." + invalidStage) }}
            </span>
          </v-row>
        </v-overlay>

        <v-row
          class="ma-4"
          align="start"
        >
          <h1 class="title no-wrap--text">
            <span class="overline">{{ strings.translate(selectedZone, "zoneName") }}</span>
            {{ strings.translate(selectedStage, "code") }}
          </h1>
        </v-row>
        <v-row v-if="$vuetify.breakpoint.smAndDown">
          <div class="d-flex flex-wrap justify-start md-2">
            <figure
              v-for="(ImgStyle, idx) in reportdata.OriginImages"
              :key="idx"
              style="border-radius:4px;"
              :style="ImgStyle"
              class="d-flex mx-2 my-1"
            />
          </div>
        </v-row>
        <v-row
          align="start"
          justify="center"
        >
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            class="order-1 order-sm-1 order-md-0 order-lg-0 order-xl-0"
          >
            <v-container
              v-for="category in stageItems"
              :key="category.id"
              fluid
              class="py-0"
            >
              <v-subheader
                class="pl-2"
                :style="{
                  color: category.colors[dark ? 0 : 1],
                  'text-shadow': `0 0 10px ${category.colors[dark ? 0 : 1]}`
                }"
              >
                {{ $t("stage.loots." + category.id) }}
                <v-divider
                  class="ml-2"
                  :style="{ 'border-color': category.colors[dark ? 0 : 1] }"
                />
              </v-subheader>
              <span
                v-for="item in category.drops"
                :key="item.itemId"
                class="py-1 px-1 d-inline-block"
              >
                <ItemStepper
                  :defaultquantity="getItemCount(item.item, category.id)"
                  :item="item.item"
                  :bus="eventBus"
                  @change="e => handleChange(category.id, e)"
                />
              </span>
            </v-container>

            <v-row
              justify="center"
              class="mx-2 mb-5"
              dense
            >
              <v-col cols="12">
                <v-switch
                  v-model="furniture"
                  color="primary"
                  class="my-0 pb-0 d-inline-flex"
                  hide-details
                  :disabled="submitting"
                >
                  <template v-slot:label>
                    <v-slide-x-transition leave-absolute>
                      <v-badge
                        v-if="furniture"
                        icon="mdi-check-circle"
                        bordered
                        bottom
                        overlap
                        :offset-x="7"
                        :offset-y="10"
                        class="mr-3"
                      >
                        <ItemIcon
                          :item="getItem('furni')"
                          :ratio="0.5"
                        />
                      </v-badge>
                    </v-slide-x-transition>
                    <span>
                      {{ $t("report.furniture", { state: $t(`meta.hasNorNot.${furniture}`) }) }}
                    </span>
                  </template>
                </v-switch>
              </v-col>
            </v-row>

            <v-row
              v-if="$vuetify.breakpoint.smAndDown"
              justify="space-around"
            >
              <v-btn
                large
                rounded
                color="error"
                class="px-4 py-2"
                @click="reset"
              >
                {{ $t("report.clear") }}
              </v-btn>

              <v-btn
                large
                rounded
                color="primary"
                :loading="submitting"
                class="px-4 py-2"
                @click="submit"
              >
                <div class="d-inline-flex align-center justify-center">
                  <v-icon small>
                    mdi-server
                  </v-icon>
                  <span class="caption ml-1">
                    {{ serverName }}
                  </span>
                </div>
                <v-divider
                  vertical
                  class="mx-2"
                />
                <span>
                  {{ $t("report.submit") }}
                </span>
              </v-btn>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            class="order-0 order-sm-0 order-md-1 order-lg-1 order-xl-1"
          >
            <v-row v-if="!$vuetify.breakpoint.smAndDown">
              <div class="d-flex flex-wrap justify-start md-2">
                <figure
                  v-for="(ImgStyle, idx) in reportdata.OriginImages"
                  :key="idx"
                  style="border-radius:4px;"
                  :style="ImgStyle"
                  class="d-flex mx-2 my-1"
                />
              </div>
            </v-row>
            <v-row
              v-if="!$vuetify.breakpoint.smAndDown"
              justify="space-around"
              class="mt-6"
            >
              <v-btn
                large
                rounded
                color="error"
                class="px-4 py-2"
                @click="reset"
              >
                {{ $t("report.clear") }}
              </v-btn>

              <v-btn
                large
                rounded
                color="primary"
                :loading="submitting"
                class="px-4 py-2"
                @click="submit"
              >
                <div class="d-inline-flex align-center justify-center">
                  <v-icon small>
                    mdi-server
                  </v-icon>
                  <span class="caption ml-1">
                    {{ serverName }}
                  </span>
                </div>
                <v-divider
                  vertical
                  class="mx-2"
                />
                <span>
                  {{ $t("report.submit") }}
                </span>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </StageSelector>
  </v-container>
</template>

<script>
  import get from "@/utils/getters";
  import ItemStepper from "@/components/global/ItemStepper";
  import Vue from "vue";
  import strings from "@/utils/strings";
  import StageSelector from "@/components/stats/StageSelector";
  import Theme from "@/mixins/Theme";
  import ItemIcon from "@/components/global/ItemIcon";
  import validator from "@/utils/validator";
  import existUtils from "@/utils/existUtils";

  // colors: [dark, light]
  const categories = [
    {
      id: "NORMAL_DROP",
      colors: ["#cacbcc", "#4d4d4d"]
    },
    {
      id: "SPECIAL_DROP",
      colors: ["#e26d2c", "#b35522"]
    },
    {
      id: "EXTRA_DROP",
      colors: ["#9aba3d", "#8aa637"]
    }
  ];

  export default {
    name: "ReportEditor",
    components: { ItemIcon, StageSelector, ItemStepper },
    mixins: [Theme],
    props: {
      reportdata: {
        type: Object,
        require: true,
        default() {
          return {};
        }
      }
    },
    data: () => ({
      submitting: false,
      submitted: false,

      undoing: false,
      undid: false,

      lastSubmissionId: null,

      results: [],
      furnitureInternal: false,
      // invalidCount: 0,
      eventBus: new Vue(),

      selected: {
        zone: null,
        stage: null
      }
    }),
    computed: {
      serverName() {
        return this.$t("server.servers." + this.$store.getters["dataSource/server"]);
      },
      strings() {
        return strings;
      },
      selectedZone() {
        if (!this.selected.zone) return {};
        return get.zones.byZoneId(this.selected.zone, false);
      },
      selectedStage() {
        if (!this.selected.stage) return {};
        return get.stages.byStageId(this.selected.stage);
      },
      furniture: {
        get() {
          return this.furnitureInternal;
        },
        set(val) {
          this.furnitureInternal = val;
          if (val === true) {
            this.results.push({
              dropType: "FURNITURE",
              itemId: "furni",
              quantity: 1
            });
          } else if (val === false) {
            this.results = this.results.filter(el => el.dropType !== "FURNITURE" && el.itemId !== "furni");
          }
        }
      },
      dropInfos() {
        const dropInfos = {
          type: [],
          item: []
        };

        const stages = this.selectedStage;
        if (!this.selectedZone || this.invalidStage || !this.selectedZone.zoneId) return null;

        for (const drop of stages["dropInfos"]) {
          if (drop["itemId"]) {
            dropInfos.item.push({
              ...drop,
              item: get.items.byItemId(drop["itemId"])
            });
          } else {
            // when an itemId is not presented, a category drop bound is described.
            dropInfos.type.push(drop);
          }
        }

        dropInfos.item.sort((a, b) => a.item.sortId - b.item.sortId);

        return dropInfos;
      },

      stageItems() {
        if (this.invalidStage) return [];

        const items = [];

        for (const { id, colors } of categories) {
          const category = id;
          const categoryDrops = [];

          for (const itemDropInfo of this.dropInfos.item.filter(v => v["dropType"] === category)) {
            const dropType = itemDropInfo["dropType"];
            if (dropType === "FURNITURE") continue;
            if (!validator.have(items, dropType)) {
              this.$set(items, dropType, []);
            }

            categoryDrops.push(itemDropInfo);
          }

          if (categoryDrops.length === 0) continue;

          items.push({
            id: category,
            colors,
            drops: categoryDrops
          });
        }

        return items;
      },

      isGacha() {
        return this.selected.stage && this.selectedStage["isGacha"];
      },

      slashStripClasses() {
        return { "slash-strip--warning": this.validation.rate <= 2, "slash-strip--danger": this.validation.rate > 2 };
      },
      invalidStage() {
        if (this.selected.zone && this.selected.stage) {
          const zone = get.zones.byZoneId(this.selected.zone, false);
          if (!zone || !zone.zoneId || !existUtils.existence(zone)) return "INVALID";
          if (zone.isOutdated) return "EXPIRED";

          const stage = get.stages.byStageId(this.selected.stage);
          if (!stage || !stage.stageId || !existUtils.existence(stage)) return "INVALID";
        } else {
          return "INVALID";
        }
        return false;
      }
    },
    mounted() {
      if(!this.reportdata.Items) return;
      this.furniture = this.reportdata.Items.some(a => a.ItemId == "furni");
    },
    methods: {
      getItemCount(item, type) {
        if(!this.reportdata.Items) return;
        let Itm = 0;
        for (let Item of this.reportdata.Items) {
          if (Item.Type.type == type && item.itemId == Item.ItemId) {
            return Item.Count;
          } else if (item.itemId == Item.ItemId) {
            Itm = Item.Count;
          }
        }
        return Itm;
      },
      goToPage(name) {
        this.$router.push({ name: name });
      },
      select({ zone, stage }) {
        this.reset();
        this.selected.zone = zone;
        this.selected.stage = stage;
      },
      getItem(itemId) {
        return get.items.byItemId(itemId);
      },
      handleChange(dropType, [itemId, diff]) {
        let item = this.getOrCreateItem(dropType, itemId);
        item.quantity += diff;
        item.quantity <= 0 && this.results.splice(this.results.indexOf(item), 1);
      },
      getOrCreateItem(dropType, itemId) {
        const item = this.results.find(v => v.itemId === itemId && v.dropType === dropType);
        if (item === undefined) {
          const newLength = this.results.push({
            dropType,
            itemId,
            quantity: 0
          });
          return this.results[newLength - 1];
        }
        return item;
      },
      reset() {
        this.results = [];
        this.eventBus.$emit("reset");
        this.furniture = false;
      },
      submit() {
        this.$emit("change", {
          Stage: get.stages.byStageId(this.selected.stage).code,
          Items: this.results
        });
      }
    }
  };
</script>

<style scoped>
  .theme--light .zoneTitle {
    color: #fff;
  }

  .v-table {
    background: transparent !important;
  }

  .round {
    border-radius: 4px;
  }
</style>
