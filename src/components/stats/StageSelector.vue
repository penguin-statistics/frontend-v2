<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} - {1}",
      "zone": {
        "name": "章节",
        "types": {
          "MAINLINE": "主线",
          "WEEKLY": "物资筹备",
          "ACTIVITY_OPEN": "限时活动（开放中）",
          "ACTIVITY_CLOSED": "限时活动（已结束）"
        },
        "status": {
          "closed": "已结束",
          "open": "开放中"
        }
      },
      "stage": {
        "name": "关卡",
        "apCost": "{apCost} 点理智",
        "loots": {
          "normal": "常规掉落",
          "extra": "额外物资",
          "special": "特殊掉落"
        }
      }
    },
    "en": {
      "opensAt": "Opens at: {0} - {1}",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Main Storyline",
          "WEEKLY": "Supplies",
          "ACTIVITY_OPEN": "Event (Opening)",
          "ACTIVITY_CLOSED": "Event (Closed)"
        },
        "status": {
          "closed": "Closed",
          "open": "Opening"
        }
      },
      "stage": {
        "name": "Stage",
        "apCost": "{apCost} AP required",
        "loots": {
          "normal": "Normal",
          "extra": "Extra",
          "special": "Special"
        }
      }
    },
    "ja": {
      "opensAt": "開催期間：{0} - {1}",
      "zone": {
        "name": "章",
        "types": {
          "MAINLINE": "メインステージ",
          "WEEKLY": "物資調達",
          "ACTIVITY_OPEN": "イベント（開催中）",
          "ACTIVITY_CLOSED": "イベント（終了）"
        },
        "status": {
          "closed": "終了",
          "open": "開催中"
        }
      },
      "stage": {
        "name": "作戦",
        "apCost": "消費理性：{apCost}",
        "loots": {
          "normal": "通常ドロップ",
          "extra": "エクストラドロップ",
          "special": "スペシャルドロップ"
        }
      }
    },
    "ko": {
      "opensAt": "Opens at: {0} - {1}",
      "zone": {
        "name": "에피소드",
        "types": {
          "MAINLINE": "메인",
          "WEEKLY": "물자 비축",
          "ACTIVITY_OPEN": "Event (Opening)",
          "ACTIVITY_CLOSED": "Event (Closed)"
        },
        "status": {
          "closed": "Closed",
          "open": "Opening"
        }
      },
      "stage": {
        "name": "작전지역",
        "apCost": "{apCost} AP required",
        "loots": {
          "normal": "일반 드랍",
          "extra": "추가 드랍",
          "special": "특수 드랍"
        }
      }
    }
  }
</i18n>

<template>
  <v-stepper
    v-model="step"
    :alt-labels="!small"
    class="px-2 transparent elevation-0 full-width"
  >
    <v-stepper-header
      class="bkop-light elevation-6"
      style="border-radius: 4px"
    >
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        <span
          class="text-center"
          style="word-break: keep-all"
        >
          {{ $t('zone.name') }} & {{ $t('stage.name') }}
        </span>
        <small
          v-if="step > 1"
          class="mt-2"
        >
          {{ selectedStage.code || '' }}
        </small>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step === 2"
        :step="2"
      >
        {{ name }}
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content
        :step="1"
        :class="{'pa-0': small}"
      >
        <v-row class="px-1">
          <v-col
            v-for="(categories, index) in categorizedZones"
            :key="index"
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
          >
            <div
              v-for="category in categories"
              :key="category.id"
            >
              <v-subheader>
                <v-icon class="mr-2">
                  {{ category.zones[0].icon }}
                </v-icon>
                <span>
                  {{ $t(['zone.types', category.id].join('.')) }}
                </span>
              </v-subheader>
              <v-expansion-panels
                hover
                class="mb-2"
              >
                <v-expansion-panel
                  v-for="zone in category.zones"
                  :key="zone.zoneId"
                  class="bkop-light"
                >
                  <v-expansion-panel-header class="overflow-hidden bkop-medium">
                    <v-row align="center">
                      <span
                        v-if="zone.isActivity && !small"
                        :class="{
                          'text--darken-1 font-weight-bold ml-2 mr-1': true,
                          'red--text': zone.isOutdated,
                          'green--text': !zone.isOutdated }"
                      >
                        {{ zone.isOutdated ? $t('zone.status.closed') : $t('zone.status.open') }}
                      </span>

                      <span
                        :class="{'subtitle-1 pl-2': true, 'text--darken-1 font-weight-bold': zone.isActivity && small, 'red--text': zone.isActivity && small && zone.isOutdated,
                                 'green--text': zone.isActivity && small && !zone.isOutdated}"
                      >
                        {{ strings.translate(zone, "zoneName") }}
                      </span>

                      <!--                        <v-spacer />-->

                      <!--                        <span class="font-weight-bold monospace mr-6">-->
                      <!--                          <v-badge-->
                      <!--                            inline-->
                      <!--                            color="black"-->
                      <!--                            :content="zone.stages.length"-->
                      <!--                          />-->
                      <!--                        </span>-->
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-2">
                    <div
                      v-if="zone.isActivity"
                      class="caption mb-2 mt-1"
                    >
                      {{ $t('opensAt', zone.activityActiveTime) }}
                    </div>
                    <StageCard
                      v-for="stage in getStages(zone.zoneId)"
                      :key="stage.stageId"
                      :stage="stage"

                      @click.native="selectStage(zone.zoneId, stage.stageId)"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>
        </v-row>
      </v-stepper-content>
      <v-stepper-content
        :step="2"
        class="pa-0 pt-2"
      >
        <slot />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";
  import StageCard from "@/components/stats/StageCard";
  import Console from "@/utils/Console";

  export default {
    name: "StageSelector",
    components: {StageCard},
    props: {
      name: {
        type: String,
        required: true
      },
      hideClosed: {
        type: Boolean,
        default () {
          return false
        }
      },
      routerNames: {
        type: Object,
        default () {
          return {
            index: "",
            details: ""
          }
        }
      }
    },
    data() {
      return {
        internalStep: 1,
        selected: {
          zone: null,
          stage: null
        }
      }
    },
    computed: {
      bindRouter () {
        return this.routerNames.index !== "" && this.routerNames.details !== ""
      },
      step: {
        get () {
          return this.internalStep
        },
        set (val) {
          this.internalStep = val;
          if (val === 1) this.$emit("select", {zone: null, stage: null});

          if (!this.bindRouter) return;
          if (val === 1) {
            this.$router.push({
              name: this.routerNames.index
            });
          } else if (val === 2) {
            this.$router.push({
              name: this.routerNames.details,
              params: {
                zoneId: this.selected.zone,
                stageId: this.selected.stage
              }
            })
          }
        }
      },
      strings () {
        return strings
      },
      small () {
        return this.$vuetify.breakpoint.xsOnly
      },
      categorizedZones() {
        const categories = ["ACTIVITY_OPEN", "MAINLINE", "WEEKLY"];
        !this.hideClosed ? categories.push("ACTIVITY_CLOSED") : null;
        let result = [];
        for (let category of categories) {
          let filter = null;
          let zones = get.zones.byType(category.startsWith("ACTIVITY") ? "ACTIVITY" : category);
          if (category === "ACTIVITY_OPEN") {
            filter = zone => !zone.isOutdated;
          } else if (category === "ACTIVITY_CLOSED") {
            filter = zone => zone.isOutdated;
          }
          if (filter) {
            zones = zones.filter(filter);
          }
          if (zones && zones.length) {
            result.push({
              id: category,
              zones: zones
            })
          }
        }
        result = [result.slice(0, -1), result.slice(-1)]
        return result;
      },
      selectedStage() {
        if (!this.selected.stage) return {};
        return get.stages.byStageId(this.selected.stage);
      },
    },
    watch: {
      '$route' () {
        this.checkRoute()
      }
    },
    beforeMount () {
      this.checkRoute()
    },
    methods: {
      getStages (zoneId) {
        return get.stages.byParentZoneId(zoneId);
      },
      selectStage (zone, stage) {
        Console.log("chose", zone, stage);
        this.selected.zone = zone;
        this.selected.stage = stage;
        this.$emit("select", {zone, stage});
        this.step += 1
      },
      checkRoute () {
        if (!this.bindRouter) return;
        if (this.$route.name === this.routerNames.details) {
          this.internalStep = 2;
          const zone = this.$route.params.zoneId;
          const stage = this.$route.params.stageId;
          this.selected.zone = zone;
          this.selected.stage = stage;
          this.$emit("select", {zone, stage});
        } else if (this.$route.name === this.routerNames.index) {
          this.internalStep = 1;

          this.selected.zone = null;
          this.selected.stage = null;
        }
      }
    },
  }
</script>

<style scoped>
.monospace {
  font-family: Consolas, Courier, monospace;
}

  .full-width {
    width: 100%;
  }
</style>