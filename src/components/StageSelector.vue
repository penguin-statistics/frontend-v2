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
      },
      "stats": {
        "name": "统计结果",
        "title": "{stage} 统计结果"
      },
      "report": {
        "name": "上报结果"
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
      },
      "stats": {
        "name": "Statistics",
        "title": "Statistics of {stage}"
      },
      "report": {
        "name": "Report"
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
      },
      "stats": {
        "name": "統計結果",
        "title": "{stage} 統計結果"
      },
      "report": {
        "name": "報告"
      }
    }
  }
</i18n>

<template>
  <v-stepper
    v-model="step"
    :alt-labels="!small"
    class="bkop-light transparent"
  >
    <v-stepper-header>
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
          {{ $t(name) }}
        </v-row>
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content :step="1">
        <v-container>
          <v-expansion-panels
            v-for="zoneCategory in categorizedZones"
            :key="zoneCategory.id"
          >
            <v-subheader>
              {{ $t(['zone.types', zoneCategory.id].join('.')) }}
            </v-subheader>
            <v-expansion-panel-header>
              <v-icon>{{ zone.icon }}</v-icon>
              <v-list-item-title>
                <span
                  v-if="zone.isActivity"
                  :class="{
                    'text--darken-1 font-weight-bold': true,
                    'red--text': zone.isOutdated,
                    'green--text': !zone.isOutdated }"
                >
                  {{ zone.isOutdated ? $t('zone.status.closed') : $t('zone.status.open') }}
                </span>
                <span class="subtitle-1">
                  {{ strings.translate(zone, "zoneName") }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle v-if="zone.isActivity">
                {{ !small ? `${$t('opensAt', zone.activityActiveTime)}` : null }}
              </v-list-item-subtitle>
            </v-expansion-panel-header>
            <v-expansion-panel-content
              v-for="zone in zoneCategory.zones"
              :key="zone.zoneId"
              ripple
            >
              <v-row class="grid-list-xl">
                <v-col
                  v-for="stage in zone.stages"
                  :key="stage.stageId"
                >
                  <v-card>
                    {{ stage }}
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panels>
        </v-container>
      </v-stepper-content>

      <v-stepper-content :step="2">
        <slot :selected="selected" />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";

  export default {
    name: "StageSelector",
    components: {},
    props: {
      name: {
        type: String,
        required: true
      },
      prefill: {
        type: Object,
        default () {
          return null
        }
      },
      hideClosed: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data() {
      return {
        step: 1,
        selected: {
          zone: null,
          stage: null,
        }
      }
    },
    computed: {
      strings () {
        return strings
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
        return result;
      },
      selectedZone() {
        const fallback = { zoneName: "" };
        if (!this.selected.zone) return fallback;
        const zone = get.zones.byZoneId(this.selected.zone);
        if (!zone) return fallback;
        return zone;
      },
      selectedZoneName () {
        if (this.selectedZone) {
          return strings.translate(this.selectedZone, "zoneName")
        } else {
          return ""
        }
      },
      selectedStage() {
        if (!this.selected.stage) return {};
        return get.stages.byStageId(this.selected.stage);
      },
      stages() {
        return get.stages.byParentZoneId(this.selected.zone);
      },
      small () {
        return this.$vuetify.breakpoint.xsOnly
      }
    },
    watch: {
      step(newValue) {
        if (newValue <= 2) {
          this.$emit("selected", {type: "stage", payload: null})
        }
        if (newValue === 1) {
          this.$emit("selected", {type: "zone", payload: null})
        }
      },
      prefill (newValue) {
        this.update(newValue, true)
      }
    },
    created () {
      this.update(this.prefill)
    },
    methods: {
      selectZone(zoneId, emitEvent=true) {
        if (emitEvent) this.$emit("selected", {type: "zone", payload: zoneId})
        this.step = 2
        this.selected.zone = zoneId
      },
      selectStage(stageId, emitEvent=true) {
        if (emitEvent) this.$emit("selected", {type: "stage", payload: stageId})
        this.step = 3
        this.selected.stage = stageId
      },
      getItem(itemId) {
        return get.items.byItemId(itemId);
      },
      update (object, update=false) {
        if (object) {
          if (object.zone) this.selectZone(this.prefill.zone, false);
          if (object.stage) this.selectStage(this.prefill.stage, false);
          if (!object.zone && !object.stage && update) {
            this.step = 1;
            this.selected.stage = null;
            this.selected.zone = null
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>