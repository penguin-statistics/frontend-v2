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
        "undo": "撤销",
        "unable": "无法提交：",
        "rules": {
          "gte": "应至少有 {quantity} 种物品",
          "lte": "应至多有 {quantity} 种物品",
          "not": "物品种类应不为 {quantity}"
        },
        "alertMsg": {
          "limitation": "您的本次汇报与现有数据差距较大，继续提交可能导致此次汇报被判定为异常，无法进入全部统计数据中。",
          "preContact": "如果您认为这是误判，欢迎",
          "contact": "联系作者",
          "sufContact": "（最好附上掉落截图），确认后会尽快修正。",
          "noDrop": "您尚未选择任何掉落物品，您确定此次上传数据正确么？",
          "finalAlert": "您真的确定要继续吗？",
          "continue": "确定要继续吗？"
        }
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
        "furniture": "Furniture Drop: {state}",
        "submit": "Submit",
        "success": "Successfully submitted",
        "undo": "Undo",
        "unable": "Unable to submit: ",
        "rules": {
          "gte": "There should have at least {quantity} types of item in this stage",
          "lte": "There should have at least {quantity} types of item in this stage",
          "not": "There should not occur {quantity} types of item in this stage"
        },
        "alertMsg": {
          "limitation": "There is a big gap between your current report and the existing data. If you continue to submit, the report may be judged to be abnormal and cannot enter all the statistics.",
          "preContact": "If you think this is a misjudgment, ",
          "contact": "please contact the author ",
          "sufContact": "(preferably drop the screenshot) and correct it as soon as possible after confirmation.",
          "noDrop": "You have not selected any dropped items. Are you sure that the upload data is correct?",
          "finalAlert": "Are you sure you want to continue?",
          "continue": "Are you sure you want to continue?"
        }
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
          :alt-labels="!$vuetify.breakpoint.xsOnly"
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
                color="warning"
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

              <v-container v-if="!$vuetify.breakpoint.smAndDown">
                左键增加，右键减少
              </v-container>

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

                <v-flex
                  xs12
                  sm8
                >
                  <v-layout
                    row
                    wrap
                    justify-space-around
                  >
                    <v-btn
                      large
                      round
                      color="error"
                      @click="reset"
                    >
                      清空
                    </v-btn>

                    <v-btn
                      large
                      round
                      color="primary"
                      :loading="submitting"
                      @click="submit"
                    >
                      {{ $t('report.submit') }}
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-flex>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
    <!-- TODO: refactor dialog code -->
    <v-dialog
      v-model="showLimitationAlert"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline indigo"
          primary-title
        >
          <v-icon>mdi-alert</v-icon>警告
        </v-card-title>

        <v-card-text>
          {{ results.length ? $t('report.alertMsg.limitation') : $t('report.alertMsg.noDrop') }}
        </v-card-text>

        <v-card-text v-if="results.length">
          {{ $t('report.alertMsg.preContact') }}

          <span
            class="font-weight-black cursor-pointer"
            @click="goToPage('AboutContact')"
          >
            {{ $t('report.alertMsg.contact') }}
          </span>

          {{ $t('report.alertMsg.sufContact') }}
        </v-card-text>

        <v-card-text>
          {{ $t('report.alertMsg.continue') }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            flat
            @click="showLimitationAlert = false"
          >
            {{ $t('dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            flat
            @click="confirmSubmit"
          >
            {{ $t('dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showLimitationRepeatAlert"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline red"
          primary-title
        >
          <v-icon>mdi-alert</v-icon>警告
        </v-card-title>

        <v-card-text>
          {{ $t('report.alertMsg.finalAlert') }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            flat
            @click="showLimitationRepeatAlert = false"
          >
            {{ $t('dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            flat
            @click="confirmFinalSubmit"
          >
            {{ $t('dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      snackbar: false,
      submitting: false,
      undoing: false,
      results: [],
      furniture: false,
      invalidCount: 0,
      eventBus: new Vue(),
      showLimitationAlert: false,
      showLimitationRepeatAlert: false
    }),
    computed: {
      selected() {
        return {
          zone: this.$route.params.zoneId,
          stage: this.$route.params.stageId
        };
      },
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
        if (!this.selected.stage) return {};
        return get.limitations.byStageId(this.selected.stage).itemTypeBounds
      }
    },
    watch: {
      results: function(value) {
        this.eventBus.$emit(
          "fulfilled",
          this.typeLimitationFulfilled(value.length)
        );
      },
      $route: function(to, from) {
        console.log("step route changed from", from.path, "to", to.path);
        if (to.name === "ReportByZone") {
          this.step = 1;
        }
        if (to.name === "ReportByZone_SelectedZone") {
          this.step = 2;
        }
        if (to.name === "ReportByZone_SelectedStage") {
          this.step = 3;
        }
      },
      step: function(newValue, oldValue) {
        console.log("step changed from", oldValue, "to", newValue);
        switch (newValue) {
          case 1:
            console.log("- [router go] index");
            this.$router.push({ name: "ReportByZone" });
            break;
          case 2:
            console.log("- [router go] zone", this.selected.zone);
            this.$router.push({
              name: "ReportByZone_SelectedZone",
              params: { zoneId: this.selected.zone }
            });
            break;
          case 3:
            console.log("- [router go] stage", this.selected);
            this.$router.push({
              name: "ReportByZone_SelectedStage",
              params: {
                zoneId: this.selected.zone,
                stageId: this.selected.stage
              }
            });
            break;
          default:
            console.error(
              "unexpected step number",
              newValue,
              "with [newStep, oldStep]",
              [newValue, oldValue]
            );
        }
      }
    },
    beforeMount() {
      this.$route.params.zoneId &&
        (this.selected.zone = this.$route.params.zoneId) &&
        (this.step += 1);
      this.$route.params.stageId &&
        (this.selected.stage = this.$route.params.stageId) &&
        (this.step += 1);
    },
    methods: {
      goToPage(name) {
        this.$router.push({ name: name })
      },
      storeZoneSelection(zoneId) {
        this.$router.push({
          name: "ReportByZone_SelectedZone",
          params: { zoneId: zoneId }
        });
      },
      storeStageSelection(stageId) {
        this.reset();
        this.$router.push({
          name: "ReportByZone_SelectedStage",
          params: {
            zoneId: this.selected.zone,
            stageId: stageId
          }
        });
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
        let limit = this.typeLimitation;
        return types > limit.lower && types < limit.upper && limit.exceptions.indexOf(types) === -1
      },
      reset () {
        this.eventBus.$emit("reset");
        this.furniture = false
      },
      submit () {
        if (this.invalidCount || this.results.length === 0) {
          this.showLimitationAlert = true;
        } else {
          this.doSubmit()
        }
      },
      async doSubmit () {
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
      confirmSubmit () {
        this.showLimitationAlert = false
        if (this.results.length === 0) {
          this.doSubmit()
        } else {
          this.showLimitationRepeatAlert = true
        }
      },
      confirmFinalSubmit () {
        this.showLimitationRepeatAlert = false
        this.doSubmit()
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
