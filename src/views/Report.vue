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
      "report": {
        "name": "上报结果",
        "furniture": "家具掉落：{state}",
        "submit": "提交",
        "success": "上传成功",
        "undo": "撤销",
        "undoSuccess": "撤销成功",
        "unable": "无法提交：",
        "clear": "清空"
      },
      "rules": {
        "rule_1": "这是单次作战的提交，请注意核对数目；",
        "rule_2": "若无素材掉落，请直接点击提交；",
        "rule_3": "请不要只汇报比较“欧”的掉落；",
        "rule_4": "请保证通关评价是3星；",
        "rule_5": "不要汇报首次通关奖励，谢谢！"
      },
      "usage": "左键增加，右键减少"
    },
    "en": {
      "opensAt": "Opens At: {0} ~ {1}",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
          "ACTIVITY": "Activity"
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
      "report": {
        "name": "Report",
        "furniture": "Furniture Drop: {state}",
        "submit": "Submit",
        "success": "Successfully submitted",
        "undo": "Recall",
        "undoSuccess": "Successfully recalled submission",
        "clear": "Clear",
        "unable": "Failed to submit: ",
        "alertMsg": {
          "alert": "Warning",
          "limitation": "There is a big gap between your current report and the existing data. If you continue to submit, the report may be judged to be abnormal and cannot be counted into all statistics.",
          "preContact": "If you think this is a misjudgment, ",
          "contact": "please contact the site owner or team members ",
          "sufContact": "(attach the screenshot if possible). We will correct it as soon as possible after confirmation.",
          "noDrop": "You have not selected any dropped items. Are you sure that the upload data is correct?",
          "finalAlert": "Are you sure you want to continue?",
          "continue": "Do you want to continue?"
        }
      },
      "rules": {
        "rule_1": "这是单次作战的提交，请注意核对数目；",
        "rule_2": "若无素材掉落，请直接点击提交；",
        "rule_3": "请不要只汇报比较“欧”的掉落；",
        "rule_4": "请保证通关评价是3星；",
        "rule_5": "不要汇报首次通关奖励，谢谢！"
      },
      "usage": "Increase by left click, decrease by right click"
    },
    "ja": {
      "opensAt": "開催期間：{0} ~ {1}",
      "zone": {
        "name": "章",
        "types": {
          "MAINLINE": "メインストーリー",
          "WEEKLY": "曜日クエスト",
          "ACTIVITY": "イベント"
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
      "report": {
        "name": "報告",
        "furniture": "家具ドロップ：{state}",
        "submit": "送信",
        "success": "送信成功",
        "undo": "送信キャンセル",
        "undoSuccess": "キャンセルしました",
        "unable": "送信失敗：",
        "clear": "クリア",
        "alertMsg": {
          "alert": "警告",
          "limitation": "今回報告しようとしている内容は既存のデータとの差が大きくなっており、このまま報告するのであれば今回の報告は異常と判定され、全て統計データに反映されることはありません。",
          "preContact": "誤った情報であると判断した場合は",
          "contact": "管理人に連絡を行ってください",
          "sufContact": "（その際はスクリーンショットの添付をお願いいたします）。確認次第速やかに修正を行わせて頂きます。",
          "noDrop": "ドロップアイテムが何も選択されていません。送信するデータに問題はありませんか？",
          "finalAlert": "本当にこのデータを送信しますか？",
          "continue": "本当に送信しますか？"
        }
      },
      "rules": {
        "rule_1": "ここに追加する内容は1回でドロップした内容です。",
        "rule_2": "素材がドロップしなかった場合は直接送信をクリックしてください。",
        "rule_3": "ドロップ結果が極端に良かったものだけを報告するのはご遠慮ください。",
        "rule_4": "クリア時の評価が☆3である場合のみ報告してください。",
        "rule_5": "初クリア時の報酬は報告しないでください。ご協力ありがとうございます。"
      },
      "usage": "左クリックで個数増加、右クリックで個数減少"
    }
  }
</i18n>

<template>
  <v-container
    fluid
    fill-height
  >
    <v-snackbar
      v-model="showSubmittedSnackbar"
      color="success"
      :timeout="0"
    >
      {{ $t('report.success') }}
      <v-btn
        :loading="undoing"
        @click="undo"
      >
        {{ $t('report.undo') }}
      </v-btn>
      <v-btn
        dark
        flat
        icon
        @click="submitted = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="undoed"
      color="success"
      :timeout="15000"
    >
      {{ $t('report.undoSuccess') }}
      <v-btn
        flat
        @click="undoed = false"
      >
        {{ $t('dialog.close') }}
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
              <v-layout
                column
                align-center
                justify-center
                wrap
                class="text-xs-center"
              >
                {{ $t('zone.name') }}
                <small v-if="step > 1">{{ selectedZone.zoneName }}</small>
              </v-layout>
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="step > 2"
              :editable="step > 2"
              :step="2"
            >
              <v-layout
                column
                align-center
                justify-center
                wrap
                class="text-xs-center"
              >
                {{ $t('stage.name') }}
                <small v-if="step > 2">{{ selectedStage.code }}</small>
              </v-layout>
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="step === 3"
              :step="3"
            >
              <v-layout
                column
                align-center
                justify-center
                wrap
                class="text-xs-center"
              >
                {{ $t('report.name') }}
              </v-layout>
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
                        >{{ zone.isOutdated ? $t('zone.status.closed') : $t('zone.status.open') }}</span>
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
                              :ratio="0.6"
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
                              :ratio="0.6"
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
                              :ratio="0.6"
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
                  <li>{{ $t('rules.rule_1') }}</li>
                  <li>{{ $t('rules.rule_2') }}</li>
                  <li>{{ $t('rules.rule_3') }}</li>
                  <li>{{ $t('rules.rule_4') }}</li>
                  <li>{{ $t('rules.rule_5') }}</li>
                </ol>
              </v-alert>

              <v-container v-if="!$vuetify.breakpoint.smAndDown">
                {{ $t('usage') }}
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
                    :bus="eventBus"
                    @change="handleChange"
                  />
                </v-flex>
              </v-container>

              <v-flex class="pa-4">
                <v-switch
                  v-model="furniture"
                  :label="$t('report.furniture', {state: $t(`hasNorNot.${furniture}`)})"
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
                      {{ $t('report.clear') }}
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

    <v-dialog
      v-model="dialogs.first.enabled"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline"
          :class="slashStripClasses"
          primary-title
        >
          <v-icon>mdi-alert</v-icon>
          <span class="ml-2">{{ $t('report.alert.title.first') }}</span>
        </v-card-title>

        <v-card-text>
          <p v-if="results.length">
            <span>
              {{ $t('report.alert.causes.limitation') }}
            </span>
            <v-expansion-panel
              class="mt-3"
              popout
            >
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>{{ $t('meta.details') }}</div>
                </template>
                <div>
                  <v-list
                    v-if="validation.type"
                    two-line
                    subheader
                  >
                    <v-subheader>
                      {{ $t('report.rules.type._name') }}
                    </v-subheader>
                    <v-list-tile
                      avatar
                    >
                      <v-list-tile-avatar>
                        <v-icon>mdi-alert-circle-outline</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ $t('report.rules.type.now', {quantity: validation.type.quantity}) }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{ validation.type.message }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <v-divider v-if="validation.type && validation.item.length" />
                  <v-list
                    v-if="validation.item.length"
                    two-line
                    subheader
                  >
                    <v-subheader>
                      {{ $t('report.rules.item._name') }}
                    </v-subheader>
                    <v-list-tile
                      v-for="item in validation.item"
                      :key="item.id"
                      avatar
                    >
                      <v-list-tile-avatar>
                        <Item
                          :item="getItem(item.id)"
                          :ratio="0.5"
                          disable-link
                        />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ $t('report.rules.item.now', {item: getItem(item.id).name, quantity: item.quantity}) }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{ item.message }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </p>
          <p v-if="!results.length">
            {{ $t('report.alert.causes.noDrop') }}
          </p>

          <blockquote
            v-if="results.length"
            class="blockquote"
          >
            {{ $t('report.alert.contact.before') }}

            <span
              class="font-weight-black cursor-pointer"
              @click="goToPage('AboutContact')"
            >
              {{ $t('report.alert.contact.activator') }}
            </span>

            {{ $t('report.alert.contact.after') }}
          </blockquote>

          <p class="subheading">
            {{ $t('report.alert.continue.first') }}
          </p>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            flat
            @click="dialogs.first.enabled = false"
          >
            {{ $t('dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            flat
            @click="dialogs.repeat.enabled = true"
          >
            {{ $t('dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogs.repeat.enabled"
      width="300"
    >
      <v-card>
        <v-card-title
          class="headline warning"
          primary-title
        >
          <v-icon>mdi-alert</v-icon>
          <span class="ml-2">{{ $t('report.alert.title.repeat') }}</span>
        </v-card-title>

        <v-card-text>
          <span class="subheading">
            {{ $t('report.alert.continue.repeat') }}
          </span>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            flat
            @click="closeAllDialogs"
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
  </v-container>
</template>

<script>
  import get from '@/utils/getters'
  import report from '@/apis/report'
  import Item from "@/components/Item";
  import ItemStepper from "@/components/ItemStepper";
  import Vue from "vue";
  import Cookies from 'js-cookie';

  export default {
    name: "Report",
    components: {ItemStepper, Item},
    data: () => ({
      step: 1,
      snackbar: false,
      submitting: false,
      undoing: false,
      lastSubmissionId: null,
      undoed: false,
      results: [],
      furniture: false,
      invalidCount: 0,
      eventBus: new Vue(),
      submitted: false,
      dialogs: {
        first: {
          enabled: false
        },
        repeat: {
          enabled: false
        }
      }
    }),
    computed: {
      selected() {
        return {
          zone: this.$route.params.zoneId,
          stage: this.$route.params.stageId
        };
      },
      categorizedZones() {
        const categories = ["ACTIVITY", "MAINLINE", "WEEKLY"]; // in the report page we want activity to be the first
        let result = [];
        for (let category of categories) {
          let zones = get.zones.byType(category).filter(zone => !zone.isOutdated);
          if (zones && zones.length) {
            result.push({
              id: category,
              zones: zones
            })
          }
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
      /**
       * @typedef {{lower: number, upper: number, exceptions: number[]}} Limitation
       * @typedef {{id: string, quantity: number, limitation: Limitation, rate: number, message: string}} ItemOutlier
       * @typedef {{quantity: number, limitation: Limitation, rate: number, message: string}|null} TypeOutlier
       * @returns {{item: ItemOutlier[], type: TypeOutlier}} returns item data outliers and type data outliers in the whole dataset, respectively
       */
      validation () {
        // initiate the array that will be storing every data outlier
        /** @type ItemOutlier[] */
        let itemOutliers = [];

        /** @type TypeOutlier */
        let typeOutlier = null;

        if (!this.selected.stage) return {item: itemOutliers, type: typeOutlier, rate: 0};

        /**
         * validate the quantity using their corresponding rule
         * @returns {String|boolean} error message or success
         */
        function validate(rules, quantity) {
          for (let rule of rules) {
            let evaluation = rule(quantity);
            if (evaluation !== true) return evaluation
          }
          return true
        }

        /**
         * calculate the outlier rate
         * @param {Limitation} limitation rules to verify with
         * @param {number} value value to verify with
         * @returns {number} percentage in decimal format (e.g. 150% = 1.5)
         */
        function calculateOutlierRate(limitation, value) {
          let upper = (value - limitation.upper) ? Math.max(0, (value - limitation.upper) / limitation.upper) : 0;
          let lower = (limitation.lower - value) ? Math.max(0, (limitation.lower - value) / limitation.lower) : 0;
          return upper + lower;
        }

        // check for item outlier
        for (let item of this.results) {
          // if the item is not having a limitation record then skip it
          if (!this.limitation["itemQuantityBounds"].find(v => v["itemId"] === item.itemId)) continue;
          let [rules, limitation] = this.generateVerificationRule("item", item.itemId);
          let validation = validate(rules, item.quantity);
          if (validation !== true) {
            let rate = calculateOutlierRate(limitation, item.quantity);
            itemOutliers.push({
              id: item.itemId,
              quantity: item.quantity,
              limitation,
              rate,
              message: validation
            })
          }
        }

        // check for type outlier
        if (this.limitation["itemTypeBounds"]) {
          let [rules, limitation] = this.generateVerificationRule("type");
          let quantity = this.results.length;
          let validation = validate(rules, quantity);
          if (validation !== true) {
            let rate = calculateOutlierRate(limitation, quantity);
            typeOutlier = {
              quantity,
              limitation,
              rate,
              message: validation
            }
          }
        }

        // calculate total outlier rate
        let itemRatesInitial = 0;
        let itemRates = itemOutliers.reduce(
          (accumulator, current) => accumulator + current.rate,
          itemRatesInitial
        );
        let totalRates = itemRates + (typeOutlier ? typeOutlier.rate : 0);

        return {
          item: itemOutliers,
          type: typeOutlier,
          rate: totalRates
        }
      },
      valid () {
        let {item, type} = this.validation;
        return item.length === 0 && type === null
      },
      limitation () {
        if (!this.selected.stage) return {};
        return get.limitations.byStageId(this.selected.stage)
      },
      slashStripClasses () {
        return {'slash-strip--warning': this.validation.rate <= 2, 'slash-strip--danger': this.validation.rate > 2}
      },
      showSubmittedSnackbar () {
        return this.submitted && this.$store.getters.authed
      }
    },
    watch: {
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
        this.reset();
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
      reset () {
        this.results = [];
        this.eventBus.$emit("reset");
        this.furniture = false
      },
      submit () {
        if (!this.valid || this.results.length === 0) {
          this.dialogs.first.enabled = true;
          this.$ga.event('report', 'show_warning', this.selected.stage, 1)
        } else {
          this.doSubmit()
        }
      },
      async doSubmit () {
        this.submitted = false;
        this.submitting = true;
        let userId = Cookies.get('userID');
        let {data} = await report.submitReport({
          stageId: this.selected.stage,
          drops: this.results,
          furnitureNum: this.furniture ? 1 : 0
        });
        let reportedUserId = Cookies.get('userID');
        if (userId !== reportedUserId) {
          this.$store.commit("authLogin", reportedUserId);
        }
        this.lastSubmissionId = data;
        this.submitting = false;
        this.reset();
        this.submitted = true;
        this.$ga.event('report', 'submit_single', this.selected.stage, 1)
      },
      confirmSubmit () {
        this.closeAllDialogs();
        this.$ga.event('report', 'ignore_warning', this.selected.stage, 1);
        this.doSubmit()
      },
      async undo () {
        this.undoing = true;
        await report.recallReport(this.lastSubmissionId);
        this.submitted = false;
        this.undoing = false;
        this.undoed = true;
        this.$ga.event('report', 'undo', Cookies.get('userID'), 1)
      },
      closeAllDialogs () {
        this.dialogs.first.enabled = false;
        this.dialogs.repeat.enabled = false
      },
      generateVerificationRule(type, value=null) {
        let isItemType = type === "item";
        let limitation;
        if (isItemType) {
          limitation = this.limitation["itemQuantityBounds"].find(v => v["itemId"] === value)["bounds"]
        } else if (type === "type") {
          limitation = this.limitation["itemTypeBounds"];
        }

        let itemResponse = isItemType ? {item: this.getItem(value).name} : {};

        const gte = (value) => {
          return (compare) => {
            let response = { ...itemResponse, quantity: Array.isArray(value) ? value.join(", ") : value };
            return compare >= value ? true : this.$t(`report.rules.${type}.gte`, response)
          }
        };

        const lte = (value) => {
          return (compare) => {
            let response = { ...itemResponse, quantity: Array.isArray(value) ? value.join(", ") : value };
            return compare <= value ? true : this.$t(`report.rules.${type}.lte`, response)
          }
        };

        const notIncludes = (values) => {
          return (compare) => {
            let response = { ...itemResponse, quantity: Array.isArray(value) ? value.join(", ") : value };
            return values.indexOf(compare) === -1 ? true : this.$t(`report.rules.${type}.not`, response)
          }
        };

        return [[
          gte(limitation.lower),
          lte(limitation.upper),
          notIncludes(limitation.exceptions)
        ], limitation]
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

  .slash-strip--warning {
    background: repeating-linear-gradient(-45deg, rgb(237, 144, 53), rgb(237, 144, 53) 45px, rgb(0, 0, 0) 45px, rgb(0, 0, 0) 90px);
  }

.slash-strip--danger {
  background: repeating-linear-gradient(-45deg, rgb(226, 81, 65), rgb(226, 81, 65) 45px, rgb(0, 0, 0) 45px, rgb(0, 0, 0) 90px);
}
</style>
