<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} ~ {1}",
      "zone": {
        "name": "章节",
        "types": {
          "MAINLINE": "主线",
          "WEEKLY": "物资筹备",
          "ACTIVITY": "限时活动"
        }
      },
      "stage": {
        "name": "关卡",
        "apCost": "{apCost} 点理智",
        "loots": {
          "normal": "常规掉落",
          "extra": "额外物资",
          "special": "幸运掉落"
        }
      },
      "report": {
        "name": "上报结果",
        "furniture": "家具掉落：{state}",
        "submit": "提交",
        "success": "上传成功",
        "undo": "撤销"
      }
    },
    "en": {
      "opensAt": "Opens At: {0} ~ {1}",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
          "ACTIVITY": "Activity"
        }
      },
      "stage": {
        "name": "Stage",
        "apCost": "{apCost} points of AP required",
        "loots": {
          "normal": "Normal",
          "extra": "Extra",
          "special": "Special"
        }
      },
      "report": {
        "name": "Report",
        "furniture": "Furniture: {state}",
        "submit": "Submit",
        "success": "Successfully submitted",
        "undo": "Undo"
      }
    }
  }
</i18n>

<template>
  <v-container
    fluid
    fill-height
  >
    <v-snackbar
      v-model="snackbar"
      color="success"
      :timeout="15000"
    >
      {{ $t('report.success') }}
      <v-btn
        :loading="undoing"
        flat
        @click="undo"
      >
        {{ $t('report.undo') }}
      </v-btn>
    </v-snackbar>
    <v-layout align-center>
      <v-flex>
        <v-stepper
          v-model="step"
          class="bkop-light transparent"
          alt-labels
        >
          <v-stepper-header>
            <v-stepper-step
              :complete="step > 1"
              :editable="step > 1"
              :step="1"
            >
              {{ $t('zone.name') }}
              <small v-if="step > 1">{{ selectedZone.zoneName }}</small>
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="step > 2"
              :editable="step > 2"
              :step="2"
            >
              {{ $t('stage.name') }}
              <small v-if="step > 2">{{ selectedStage.code }}</small>
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="step === 3"
              :step="3"
            >
              {{ $t('report.name') }}
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content :step="1">
              <v-container
                fluid
                grid-list-lg
                class="py-0"
              >
                <v-list
                  v-for="zoneCategory in categorizedZones"
                  :key="zoneCategory.id"
                  subheader
                  class="transparent"
                >
                  <v-subheader inset>
                    {{ $t(['zone.types', zoneCategory.id].join('.')) }}
                  </v-subheader>

                  <v-list-tile
                    v-for="zone in zoneCategory.zones"
                    :key="zone.zoneId"
                    v-ripple
                    :disabled="zone.isOutdated"
                    avatar
                    @click="storeZoneSelection(zone.zoneId)"
                  >
                    <v-list-tile-avatar>
                      <v-icon>{{ zone.icon }}</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ zone.zoneName }}</v-list-tile-title>
                      <v-list-tile-sub-title v-if="zone.isActivity">
                        <span
                          :class="{ 'text--darken-1 font-weight-bold': true, 'red--text': zone.isOutdated, 'green--text': !zone.isOutdated }"
                        >{{ zone.isOutdated ? "已结束" : "正在进行" }}</span>
                        {{ $t('opensAt', zone.activityActiveTime) }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon color="grey lighten-1">
                        mdi-chevron-right
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-container>
            </v-stepper-content>

            <v-stepper-content
              v-if="selected.zone"
              :step="2"
            >
              <v-container
                fluid
                grid-list-lg
                class="py-0"
              >
                <v-list
                  subheader
                  :three-line="$vuetify.breakpoint.smAndUp"
                  class="transparent"
                >
                  <v-subheader
                    v-if="selectedZone"
                    inset
                  >
                    {{ selectedZone.zoneName || '' }}
                  </v-subheader>

                  <v-list-tile
                    v-for="stage in stages"
                    :key="stage.stageId"
                    v-ripple
                    avatar
                    @click="storeStageSelection(stage.stageId)"
                  >
                    <v-list-tile-avatar>
                      <v-icon>mdi-cube-outline</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ stage.code }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <v-layout
                          align-center
                          justify-start
                          row
                          wrap
                          d-inline-flex
                        >
                          <v-flex :class="{ 'yellow--text font-weight-bold': true, 'amber--text text--darken-4': !$vuetify.dark }">
                            {{ $t('stage.apCost', {apCost: stage.apCost}) }}
                          </v-flex>

                          <v-divider
                            v-if="stage.normalDrop.length > 0"
                            vertical
                            class="hidden-xs-only mx-1"
                          />

                          <v-flex
                            v-if="stage.normalDrop.length > 0"
                            class="hidden-xs-only"
                          >
                            <div>{{ $t('stage.loots.normal') }}</div>
                            <Item
                              v-for="item in stage.normalDrop"
                              :key="item"
                              :item="getItem(item)"
                              :ratio="0.5"
                              disable-link
                            />
                          </v-flex>

                          <v-divider
                            v-if="stage.extraDrop.length > 0"
                            vertical
                            class="hidden-sm-and-down mx-1"
                          />

                          <v-flex
                            v-if="stage.extraDrop.length > 0"
                            class="hidden-sm-and-down"
                          >
                            <div>{{ $t('stage.loots.extra') }}</div>
                            <Item
                              v-for="item in stage.extraDrop"
                              :key="item*10"
                              :item="getItem(item)"
                              :ratio="0.5"
                              disable-link
                            />
                          </v-flex>

                          <v-divider
                            v-if="stage.specialDrop.length > 0"
                            vertical
                            class="hidden-sm-and-down mx-1"
                          />

                          <v-flex
                            v-if="stage.specialDrop.length > 0"
                            class="hidden-sm-and-down"
                          >
                            <div>{{ $t('stage.loots.special') }}</div>
                            <Item
                              v-for="item in stage.specialDrop"
                              :key="item*100"
                              :item="getItem(item)"
                              :ratio="0.5"
                              disable-link
                            />
                          </v-flex>
                        </v-layout>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon color="grey lighten-1">
                        mdi-chevron-right
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-container>
            </v-stepper-content>

            <v-stepper-content :step="3">
              <v-alert
                :value="true"
                type="warning"
                class="mb-3"
              >
                <ol>
                  <li>这是<strong>单次</strong>提交，请注意核对数目；</li>
                  <li>若无素材掉落，请直接点击提交；</li>
                  <li><strong>不要</strong>只汇报比较“欧”的掉落；</li>
                  <li>请保证通关评价是<strong>3星</strong>；</li>
                  <li><strong>不要</strong>汇报首次通关奖励，谢谢！</li>
                </ol>
              </v-alert>

              <v-container
                v-for="stage in stageItems"
                :key="stage.id"
                fluid
                grid-list-sm

                class="py-0"
              >
                <v-subheader>
                  {{ $t('stage.loots.' + stage.id) }}
                </v-subheader>
                <v-flex
                  v-for="item in stage.drops"
                  :key="item.itemId"
                  class="py-1 px-2 d-inline-block"
                  xs12
                  sm6
                  md4
                  lg3
                  xl2
                >
                  <!--                  <h5 class="title mb-3">-->
                  <!--                    {{ item.name }}-->
                  <!--                  </h5>-->
                  <ItemStepper
                    :item="item"
                    :stage="selected.stage"
                    :bus="eventBus"

                    @change="handleChange"
                    @change:valid="validChange"
                  />
                </v-flex>
              </v-container>

              <v-flex class="pa-4">
                <v-switch
                  v-model="furniture"
                  :label="$t('report.furniture', {state: $t(`boolean.${furniture}`)})"
                />

                <v-btn
                  large
                  round
                  color="primary"

                  :loading="submitting"

                  @click="submit"
                >
                  {{ $t('report.submit') }}
                </v-btn>
              </v-flex>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import get from '@/utils/getters'
  import report from '@/apis/report'
  import Item from "@/components/Item";
  import ItemStepper from "@/components/ItemStepper";
  import Vue from "vue";

  export default {
    name: "Report",
    components: {ItemStepper, Item},
    data: () => ({
      step: 1,
      selected: {
        zone: null,
        stage: null
      },
      snackbar: false,
      submitting: false,
      undoing: false,
      results: [],
      furniture: false,
      invalidCount: 0,
      eventBus: new Vue()
    }),
    computed: {
      categorizedZones() {
        const categories = ["MAINLINE", "WEEKLY", "ACTIVITY"];
        let result = [];
        for (let category of categories) {
          result.push({
            id: category,
            zones: get.zones.byType(category)
          })
        }
        return result
      },
      selectedZone() {
        if (!this.selected.zone) return {zoneName: ''};
        return get.zones.byZoneId(this.selected.zone)
      },
      selectedStage() {
        if (!this.selected.stage) return {};
        return get.stages.byStageId(this.selected.stage)
      },
      stages() {
        return get.stages.byParentZoneId(this.selected.zone)
      },
      stageItems () {
        if (!this.selected.stage) return [];
        let stages = get.stages.byStageId(this.selected.stage);
        let items = [];
        const categories = [{
          i18n: "normal",
          value: "normalDrop"
        }, {
          i18n: "extra",
          value: "extraDrop"
        }, {
          i18n: "special",
          value: "specialDrop"
        }];

        for (let category of categories) {
          let dropIds = stages[category.value];

          // skip the category where it is not having any drop
          if (dropIds.length === 0) continue;

          let drops = [];
          for (let drop of dropIds) {
            drops.push(get.item.byItemId(drop))
          }

          items.push({
            id: category.i18n,
            drops
          })
        }
        return items
      },
      valid () {
        return this.invalidCount === 0
      },
      typeLimitation () {
        return get.limitations.byStageId(this.selected.stage).itemTypeBounds
      }
    },
    watch: {
      results: function (value) {
        this.eventBus.$emit("fulfilled", this.typeLimitationFulfilled(value.length))
      }
    },
    methods: {
      storeZoneSelection(zoneId) {
        this.step += 1;
        this.selected.zone = zoneId
      },
      storeStageSelection(stageId) {
        this.step += 1;
        this.selected.stage = stageId;
        this.reset();
      },
      getItem(itemId) {
        return get.item.byItemId(itemId)
      },
      handleChange ([itemId, quantity]) {
        let item = this.getOrCreateItem(itemId);
        item.quantity = quantity;
        item.quantity <= 0 && (this.results = this.results.filter(v => v.itemId !== item.itemId))
      },
      validChange (newState) {
        if (newState) {
          this.invalidCount -= 1
        } else {
          this.invalidCount += 1
        }
      },
      getOrCreateItem (itemId) {
        let item = this.results.find(v => v.itemId === itemId);
        if (item === undefined) {
          this.results.push({
            itemId,
            quantity: 0
          });
          return this.results.find(v => v.itemId === itemId)
        }
        return item
      },
      typeLimitationFulfilled (types) {
        let limit = this.typeLimitation
        return types > limit.lower && types < limit.upper && limit.exceptions.indexOf(types) === -1
      },
      reset () {
        this.eventBus.$emit("reset");
        this.furniture = false
      },
      async submit () {
        this.submitting = true;
        await report.submitReport({
          stageId: this.selected.stage,
          drops: this.results,
          furnitureNum: this.furniture ? 1 : 0
        });
        this.submitting = false;
        this.reset();
        this.snackbar = true
      },
      undo () {
        this.undoing = true;
        // TODO: replace with real api
        setTimeout(() => {
          this.undoing = false
          this.snackbar = false
          setTimeout(() => {
            this.snackbar = true
          }, 500)
        }, 3000)
      }
    }
  }
</script>

<style scoped>
  .theme--light .zoneTitle {
    color: #fff;
  }

  .v-table {
    background: transparent !important;
  }
</style>
