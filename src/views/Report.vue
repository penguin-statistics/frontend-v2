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
    class="fill-height"
    fluid
  >
    <v-snackbar
      v-model="showSubmittedSnackbar"
      color="success"
      :timeout="0"
    >
      {{ $t('report.success') }}
      <v-btn
        :loading="undoing"
        color="primary"
        @click="undo"
      >
        {{ $t('report.undo') }}
      </v-btn>
      <v-btn
        dark
        text
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
        text
        @click="undoed = false"
      >
        {{ $t('dialog.close') }}
      </v-btn>
    </v-snackbar>
    <v-row align="center">
      <v-col>
        <StageSelector
          name="report.name"
          :prefill="prefill"
          hide-closed
          @selected="select"
        >
          <v-alert
            color="warning"
          >
            <ol>
              <li>{{ $t('rules.rule_1') }}</li>
              <li>{{ $t('rules.rule_2') }}</li>
              <li>{{ $t('rules.rule_3') }}</li>
              <li>{{ $t('rules.rule_4') }}</li>
              <li>{{ $t('rules.rule_5') }}</li>
            </ol>
          </v-alert>

          <v-alert
            v-if="!$vuetify.breakpoint.smAndDown"
            color="secondary darken-2"
            class="subtitle-1 pl-6 mb-4"
          >
            {{ $t('usage') }}
          </v-alert>

          <v-container
            v-for="stage in stageItems"
            :key="stage.id"
            fluid
            class="py-0"
          >
            <v-subheader>
              {{ $t('stage.loots.' + stage.id) }}
            </v-subheader>
            <v-col
              v-for="item in stage.drops"
              :key="item.itemId"
              class="py-1 px-2 d-inline-block"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <!--                  <h5 class="title mb-4">-->
              <!--                    {{ item.name }}-->
              <!--                  </h5>-->
              <ItemStepper
                :item="item"
                :bus="eventBus"
                @change="handleChange"
              />
            </v-col>
          </v-container>

          <v-col class="pa-6">
            <v-switch
              v-model="furniture"
              :label="$t('report.furniture', {state: $t(`hasNorNot.${furniture}`)})"
            />

            <v-col
              cols="12"
              sm="8"
            >
              <v-row
                
                
                justify="space-around"
              >
                <v-btn
                  large
                  rounded
                  color="error"
                  @click="reset"
                >
                  {{ $t('report.clear') }}
                </v-btn>

                <v-btn
                  large
                  rounded
                  color="primary"
                  :loading="submitting"
                  @click="submit"
                >
                  {{ $t('report.submit') }}
                </v-btn>
              </v-row>
            </v-col>
          </v-col>
        </StageSelector>
      </v-col>
    </v-row>

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
            <v-expansion-panels
              class="mt-4"
              popout
            >
              <v-expansion-panel-header>
                {{ $t('meta.details') }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  <v-list
                    v-if="validation.type"
                    two-line
                    subheader
                  >
                    <v-subheader>
                      {{ $t('report.rules.type._name') }}
                    </v-subheader>
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-icon>mdi-alert-circle-outline</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t('report.rules.type.now', {quantity: validation.type.quantity}) }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ validation.type.message }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
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
                    <v-list-item
                      v-for="item in validation.item"
                      :key="item.id"
                    >
                      <v-list-item-avatar>
                        <Item
                          :item="getItem(item.id)"
                          :ratio="0.5"
                          disable-link
                        />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t('report.rules.item.now', {item: strings.translate(getItem(item.id), "name"), quantity: item.quantity}) }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.message }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panels>
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

          <p class="subtitle-1">
            {{ $t('report.alert.continue.first') }}
          </p>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="dialogs.first.enabled = false"
          >
            {{ $t('dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            text
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
          <span class="subtitle-1">
            {{ $t('report.alert.continue.repeat') }}
          </span>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="closeAllDialogs"
          >
            {{ $t('dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            text
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
  import Item from "@/components/global/Item";
  import ItemStepper from "@/components/global/ItemStepper";
  import Vue from "vue";
  import Cookies from 'js-cookie';
  import Console from "@/utils/Console";
  import StageSelector from "@/components/stats/StageSelector";
  import strings from "@/utils/strings";

  export default {
    name: "Report",
    components: {StageSelector, ItemStepper, Item},
    data: () => ({
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
      },
      selected: {
        zone: null,
        stage: null,
      }
    }),
    computed: {
      strings () {
        return strings
      },
      prefill () {
        let prefills = {};
        const params = this.$route.params;

        prefills.zone = params.zoneId ? params.zoneId : null
        prefills.stage =  params.stageId ? params.stageId : null

        return prefills
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
            drops.push(get.items.byItemId(drop))
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
    methods: {
      goToPage(name) {
        this.$router.push({ name: name })
      },
      select (selection) {
        this.selected[selection.type] = selection.payload;

        if (this.selected.zone === null) {
          if (this.selected.stage === null) {
            Console.debug("report - [router go] index");
            this.$router.push({name: "ReportByZone"});
          }
        } else {
          if (this.selected.stage === null) {
            Console.debug("report - [router go] zone", this.selected.zone);
            this.$router.push({
              name: "ReportByZone_SelectedZone",
              params: {zoneId: this.selected.zone}
            });
          } else {
            Console.debug("- [router go] stage", this.selected);
            this.$router.push({
              name: "ReportByZone_SelectedStage",
              params: {
                zoneId: this.selected.zone,
                stageId: this.selected.stage
              }
            });
          }
        }
      },
      getItem(itemId) {
        return get.items.byItemId(itemId)
      },
      handleChange ([itemId, diff]) {
        let item = this.getOrCreateItem(itemId);
        item.quantity += diff;
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
          limitation = this.limitation["itemQuantityBounds"].find(v => v["itemId"] === value)["bounds"];
        } else if (type === "type") {
          limitation = this.limitation["itemTypeBounds"]
        }
        if (!limitation) {
          return [];
        }

        let itemResponse = isItemType ? {item: strings.translate(this.getItem(value), "name")} : {};

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
