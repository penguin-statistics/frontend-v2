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
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
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
          "MAINLINE": "メインストーリー",
          "WEEKLY": "曜日クエスト",
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
        "apCost": "消費理智：{apCost}",
        "loots": {
          "normal": "通常ドロップ",
          "extra": "エクストラドロップ",
          "special": "スペシャルドロップ"
        }
      }
    }
  }
</i18n>

<template>
  <v-container>
    <v-stepper
      v-model="step"
      :alt-labels="!small"
      class="pa-2 transparent elevation-0"
    >
      <v-stepper-header class="elevation-6">
        <v-stepper-step
          :complete="step > 1"
          :editable="step > 1"
          :step="1"
        >
          <v-row
            align="center"
            justify="center"

            class="text-center"
          >
            {{ $t('stage.name') }}{{ $t('meta.separator') }}{{ $t('zone.name') }}
            <small v-if="step > 1">{{ selectedStage.code || '' }}</small>
          </v-row>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step
          :complete="step === 2"
          :step="2"
        >
          <v-row
            align="center"
            justify="center"

            class="text-center"
          >
            {{ name }}
          </v-row>
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content
          :step="1"
          :class="{'pa-0': small}"
        >
          <v-row>
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
                  eager
                  class="mb-2"
                  multiple
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
                        class="grey--text text--lighten-1 caption mb-2 mt-1"
                      >
                        {{ $t('opensAt', zone.activityActiveTime) }}
                      </div>
                      <StageCard
                        v-for="stage in getStages(zone.zoneId)"
                        :key="stage.stageId"
                        :stage="stage"

                        @click="selectStage(stage.stageId)"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content :step="2">
          <slot />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";
  import StageCard from "@/components/stats/StageCard";
  import Console from "@/utils/Console";

  export default {
    name: "NewStageSelector",
    components: {StageCard},
    props: {
      name: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        step: 1,
        selected: {
          stage: null
        }
      }
    },
    computed: {
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

    methods: {
      getStages (zoneId) {
        return get.stages.byParentZoneId(zoneId);
      },
      selectStage (stageId) {
        Console.log("chose", stageId);
        this.selected.stage = stageId;
        this.$emit("selected", stageId);
        this.step += 1
      }
    },
  }
</script>

<style scoped>
.monospace {
  font-family: Consolas, Courier, monospace;
}
</style>