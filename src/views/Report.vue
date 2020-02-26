<i18n>
  {
    "zh": {
      "stage": {
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
        "rule_3": "请不要汇报首次通关奖励，不要只汇报比较“欧”的掉落；",
        "rule_4": "请保证通关评价是3星；",
        "rule_5": "请只上传国服的掉落，谢谢。"
      },
      "usage": "左键增加，右键减少",
      "gacha": "本作战允许在一次汇报内包含多个结果。"
    },
    "en": {
      "stage": {
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
        "unable": "Failed to submit: "
      },
      "rules": {
        "rule_1": "This is only intended for reporting a single combat, please double-check your inputting.",
        "rule_2": "If there's no drops, please click submit directly without inputting any drops.",
        "rule_3": "Please don't report the first time you accomplish a mission, and don't only report the situations where you are lucky ‒ report all drops.",
        "rule_4": "Please guarantee that you get a 3-stars score.",
        "rule_5": "Please only submit drop data from CN server, thanks."
      },
      "usage": "Increase by left click, decrease by right click",
      "gacha": "Multiple results are allowed in the reporting of this stage."
    },
    "ja": {
      "stage": {
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
        "clear": "クリア"
      },
      "rules": {
        "rule_1": "ここに追加する内容は1回でドロップした内容です。",
        "rule_2": "素材がドロップしなかった場合は直接送信をクリックしてください。",
        "rule_3": "初クリア時の報酬は報告しないでください。ドロップ結果が極端に良かったものだけを報告するのはご遠慮ください。",
        "rule_4": "クリア時の評価が☆3である場合のみ報告してください。",
        "rule_5": "大陸版のドロップデータのみをアップロードして下さい。ご協力ありがとうございます。"
      },
      "usage": "左クリックで個数増加、右クリックで個数減少",
      "gacha": "Multiple results are allowed in the reporting of this stage."
    },
    "ko": {
      "stage": {
        "loots": {
          "normal": "일반 드랍",
          "extra": "추가 드랍",
          "special": "특수 드랍"
        }
      },
      "report": {
        "name": "보고",
        "furniture": "럭키 드랍: {state}",
        "submit": "제출",
        "success": "성공적으로 제출되었습니다",
        "undo": "제출 취소",
        "undoSuccess": "성공적으로 취소되었습니다",
        "clear": "초기화",
        "unable": "제출 실패: "
      },
      "rules": {
        "rule_1": "한 번에 하나의 전투에 대한 보고서를 작성하여야 합니다, 제출 전에 입력 내용을 한번 더 확인해 주십시오.",
        "rule_2": "드랍이 없는 경우에는, 아무것도 누르지 않은 채로 제출을 눌러 주십시오.",
        "rule_3": "처음으로 클리어한 작전은 보고하지 마시고, 운이 좋았던 작전만 보고하지 마십시오 - 모든 드랍을 보고해 주십시오.",
        "rule_4": "3성으로 클리어하여 주십시오.",
        "rule_5": "중국 서버에서의 드랍만 보고하여 주십시오, 감사합니다."
      },
      "usage": "왼쪽 클릭시 증가하며, 오른쪽 클릭시 감소합니다",
      "gacha": "이 작전지역은 여러 개의 결과를 한 보고서에 제출할 수 있습니다."
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
      bottom
    >
      <v-row
        align="center"
        class="mx-0"
      >
        <v-icon class="mr-4">
          mdi-check
        </v-icon>

        {{ $t('report.success') }}

        <v-spacer />

        <v-btn
          :loading="undoing"
          class="ml-sm-4"
          small
          depressed
          ripple
          @click="undo"
        >
          <v-icon
            small
            class="mr-1"
          >
            mdi-undo
          </v-icon>
          {{ $t('report.undo') }}
        </v-btn>

        <v-btn
          class="ml-4"
          text
          small
          @click="submitted = false"
        >
          {{ $t('dialog.close') }}
        </v-btn>
      </v-row>
    </v-snackbar>

    <v-snackbar
      v-model="undoed"
      color="success"
      :timeout="15000"
      bottom
    >
      <v-icon class="mr-4">
        mdi-check-all
      </v-icon>
      {{ $t('report.undoSuccess') }}
      <v-spacer />
      <v-btn
        text
        @click="undoed = false"
      >
        {{ $t('dialog.close') }}
      </v-btn>
    </v-snackbar>

    <NewStageSelector
      :name="$t('report.name')"
      hide-closed
      @select="select"
    >
      <v-card class="pa-2">
        <v-alert
          color="orange darken-3"
          border="left"
        >
          <ol>
            <li v-if="!isGacha">
              {{ $t('rules.rule_1') }}
            </li>
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
          dark
          border="left"
        >
          {{ $t('usage') }}
        </v-alert>

        <v-alert
          v-if="isGacha"
          color="blue darken-2"
          class="subtitle-1 pl-6 mb-4"
          dark
          border="left"
        >
          {{ $t('gacha') }}
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
          <span
            v-for="item in stage.drops"
            :key="item.itemId"
            class="py-1 px-2 d-inline-block"
          >
            <!--                  <h5 class="title mb-4">-->
            <!--                    {{ item.name }}-->
            <!--                  </h5>-->
            <ItemStepper
              :item="item"
              :bus="eventBus"
              @change="handleChange"
            />
          </span>
        </v-container>

        <v-col class="pa-6 pt-0">
          <v-switch
            v-model="furniture"
            color="primary"
            :label="$t('report.furniture', {state: $t(`hasNorNot.${furniture}`)})"
            class="mb-5 pb-0"
            hide-details
          />

          <v-row justify="space-around">
            <v-btn
              large
              rounded
              color="error"
              class="px-4 py-2"
              @click="reset"
            >
              {{ $t('report.clear') }}
            </v-btn>

            <v-btn
              large
              rounded
              color="primary"
              :loading="submitting"
              class="px-4 py-2"
              @click="submit"
            >
              {{ $t('report.submit') }}
            </v-btn>
          </v-row>
        </v-col>
      </v-card>
    </NewStageSelector>

    <v-dialog
      v-model="dialogs.first.enabled"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline pa-5"
          :class="slashStripClasses"
        >
          <v-icon>mdi-alert</v-icon>
          <span class="pl-2">{{ $t('report.alert.title.first') }}</span>
        </v-card-title>

        <v-card-text class="mt-4">
          <p v-if="results.length">
            <span>
              {{ $t('report.alert.causes.limitation') }}
            </span>
            <v-expansion-panels
              class="mt-4"
              popout
            >
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ $t('meta.details') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-0">
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
                          disable-tooltip
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
                </v-expansion-panel-content>
              </v-expansion-panel>
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
        <v-card-title class="headline warning pa-5">
          <v-icon>mdi-alert</v-icon>
          <span class="ml-2">{{ $t('report.alert.title.repeat') }}</span>
        </v-card-title>

        <v-card-text class="mt-4">
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
import strings from "@/utils/strings";
import NewStageSelector from "@/components/stats/StageSelector";

export default {
  name: "Report",
  components: { NewStageSelector, ItemStepper, Item },
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
    },
    routerNames: {
      index: "ReportByZone",
      details: "ReportByZone_Selected"
    }
  }),
  computed: {
    strings() {
      return strings
    },
    stageItems() {
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

    isGacha () {
      return this.selected.stage && get.stages.byStageId(this.selected.stage).isGacha
    },

    /**
     * @typedef {{lower: number, upper: number, exceptions: number[]}} Limitation
     * @typedef {{id: string, quantity: number, limitation: Limitation, rate: number, message: string}} ItemOutlier
     * @typedef {{quantity: number, limitation: Limitation, rate: number, message: string}|null} TypeOutlier
     * @returns {{item: ItemOutlier[], type: TypeOutlier}} returns item data outliers and type data outliers in the whole dataset, respectively
     */
    validation() {
      // initiate the array that will be storing every data outlier
      /** @type ItemOutlier[] */
      let itemOutliers = [];

      /** @type TypeOutlier */
      let typeOutlier = null;

      if (!this.selected.stage) return { item: itemOutliers, type: typeOutlier, rate: 0 };

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
      if (!this.isGacha && this.limitation["itemTypeBounds"]) {
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
    valid() {
      let { item, type } = this.validation;
      return item.length === 0 && type === null
    },
    limitation() {
      if (!this.selected.stage) return {};
      return get.limitations.byStageId(this.selected.stage)
    },
    slashStripClasses() {
      return { 'slash-strip--warning': this.validation.rate <= 2, 'slash-strip--danger': this.validation.rate > 2 }
    },
    showSubmittedSnackbar() {
      return this.submitted
    }
  },
  methods: {
    goToPage(name) {
      this.$router.push({ name: name })
    },
    select({ zone, stage }) {
      this.selected.zone = zone;
      this.selected.stage = stage;

      if (!zone && !stage) {
        this.reset();
      }
    },
    getItem(itemId) {
      return get.items.byItemId(itemId)
    },
    handleChange([itemId, diff]) {
      let item = this.getOrCreateItem(itemId);
      item.quantity += diff;
      item.quantity <= 0 && (this.results = this.results.filter(v => v.itemId !== item.itemId))
    },
    getOrCreateItem(itemId) {
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
    reset() {
      this.results = [];
      this.eventBus.$emit("reset");
      this.furniture = false
    },
    submit() {
      if (!this.isGacha && (!this.valid || this.results.length === 0)) {
        this.dialogs.first.enabled = true;
        this.$ga.event('report', 'show_warning', this.selected.stage, 1)
      } else {
        this.doSubmit()
      }
    },
    async doSubmit() {
      this.submitted = false;
      this.submitting = true;
      let userId = Cookies.get('userID');
      let { data } = await report.submitReport({
        stageId: this.selected.stage,
        drops: this.results,
        furnitureNum: this.furniture ? 1 : 0
      });
      let reportedUserId = Cookies.get('userID');
      if (userId !== reportedUserId) {
        this.$store.commit("auth/login", reportedUserId);
      }
      this.lastSubmissionId = data;
      this.submitting = false;
      this.reset();
      this.submitted = true;
      this.$ga.event('report', 'submit_single', this.selected.stage, 1)
    },
    confirmSubmit() {
      this.closeAllDialogs();
      this.$ga.event('report', 'ignore_warning', this.selected.stage, 1);
      this.doSubmit()
    },
    async undo() {
      this.undoing = true;
      await report.recallReport(this.lastSubmissionId);
      this.submitted = false;
      this.undoing = false;
      this.undoed = true;
      this.$ga.event('report', 'undo', Cookies.get('userID'), 1)
    },
    closeAllDialogs() {
      this.dialogs.first.enabled = false;
      this.dialogs.repeat.enabled = false
    },
    generateVerificationRule(type, value = null) {
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

      let itemResponse = isItemType ? { item: strings.translate(this.getItem(value), "name") } : {};

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
  background: repeating-linear-gradient(
    -45deg,
    rgb(237, 144, 53),
    rgb(237, 144, 53) 45px,
    rgb(0, 0, 0) 45px,
    rgb(0, 0, 0) 90px
  );
}

.slash-strip--danger {
  background: repeating-linear-gradient(
    -45deg,
    rgb(226, 81, 65),
    rgb(226, 81, 65) 45px,
    rgb(0, 0, 0) 45px,
    rgb(0, 0, 0) 90px
  );
}

.round {
  border-radius: 4px;
}
</style>
