<i18n>
{
	"en": {
		"gacha": "Multiple results are allowed for the reports of this stage.",
		"report": {
			"clear": "Clear",
			"expired": "This stage is not available in-game anymore. The report function for this stage has been closed.",
			"furniture": "Furniture Drop: {state}",
			"name": "Report",
			"submit": "Submit",
			"success": "Successfully submitted",
			"unable": "Failed to submit: ",
			"undo": "Recall",
			"undoSuccess": "Successfully recalled submission"
		},
		"rules": {
			"rule_1": "Report one clear at a time. Please double-check your drop selection.",
			"rule_2": "If there are no drops, click submit directly without selecting any drops.",
			"rule_3": "Please do not report the first-clear of a stage, and do not only report the clears where you were lucky - report all clears.",
			"rule_4": "Please make sure that you refresh a 3-stars clear.",
			"rule_5": "Please only submit drop data from the CN server."
		},
		"usage": "Increase drop amount by left mouse click, decrease by right click"
	},
	"ja": {
		"gacha": "この操作を行うことでデータに複数の結果を反映させることが出来ます。",
		"report": {
			"clear": "クリア",
			"expired": "",
			"furniture": "家具ドロップ：{state}",
			"name": "報告",
			"submit": "送信",
			"success": "送信成功",
			"unable": "送信失敗：",
			"undo": "送信キャンセル",
			"undoSuccess": "キャンセルしました"
		},
		"rules": {
			"rule_1": "ここに追加する内容は1回でドロップした内容です。",
			"rule_2": "素材がドロップしなかった場合は直接送信をクリックしてください。",
			"rule_3": "初クリア時の報酬は報告しないでください。ドロップ結果が極端に良かったものだけを報告するのはご遠慮ください。",
			"rule_4": "クリア時の評価が☆3である場合のみ報告してください。",
			"rule_5": "大陸版のドロップデータのみをアップロードして下さい。ご協力ありがとうございます。"
		},
		"usage": "左クリックで個数増加、右クリックで個数減少"
	},
	"ko": {
		"gacha": "이 작전지역은 여러 개의 결과를 한 보고서에 제출할 수 있습니다.",
		"report": {
			"clear": "초기화",
			"expired": "",
			"furniture": "럭키 드랍: {state}",
			"name": "보고",
			"submit": "제출",
			"success": "성공적으로 제출되었습니다",
			"unable": "제출 실패: ",
			"undo": "제출 취소",
			"undoSuccess": "성공적으로 취소되었습니다"
		},
		"rules": {
			"rule_1": "한 번에 하나의 전투에 대한 보고서를 작성하여야 합니다, 제출 전에 입력 내용을 한번 더 확인해 주십시오.",
			"rule_2": "드랍이 없는 경우에는, 아무것도 누르지 않은 채로 제출을 눌러 주십시오.",
			"rule_3": "처음으로 클리어한 작전은 보고하지 마시고, 운이 좋았던 작전만 보고하지 마십시오 - 모든 드랍을 보고해 주십시오.",
			"rule_4": "3성으로 클리어하여 주십시오.",
			"rule_5": "중국 서버에서의 드랍만 보고하여 주십시오, 감사합니다."
		},
		"usage": "왼쪽 클릭시 증가하며, 오른쪽 클릭시 감소합니다"
	},
	"zh": {
		"gacha": "本作战允许在一次汇报内包含多个结果。",
		"report": {
			"clear": "清空",
			"expired": "此活动关卡已过期，汇报已关闭",
			"furniture": "家具掉落：{state}",
			"name": "上报结果",
			"submit": "提交",
			"success": "上传成功",
			"unable": "无法提交：",
			"undo": "撤销",
			"undoSuccess": "撤销成功"
		},
		"rules": {
			"rule_1": "这是单次作战的提交，请注意核对数目；",
			"rule_2": "若无素材掉落，请直接点击提交；",
			"rule_3": "请不要汇报首次通关奖励，不要只汇报比较“欧”的掉落；",
			"rule_4": "请保证通关评价是3星；",
			"rule_5": "请只上传国服的掉落，谢谢。"
		},
		"usage": "左键增加，右键减少"
	}
}
</i18n>

<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-snackbar
      v-model="submitted"
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
          @click="submitted = false"
        >
          {{ $t('meta.dialog.close') }}
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
        {{ $t('meta.dialog.close') }}
      </v-btn>
    </v-snackbar>

    <StageSelector
      :name="$t('report.name')"
      :router-names="routerNames"

      hide-closed
      class="pa-3"
      @select="select"
    >
      <v-card class="bkop-light pa-2">
        <v-overlay
          :opacity="0.75"
          absolute
          :value="invalidPath"
          :class="{'slash-strip--warning-transparent': invalidPath}"
        >
          <v-row
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
              {{ $t('report.expired') }}
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
          <v-spacer />
          <v-btn
            depressed
            color="primary"
            small
            class="mx-2"
            :to="{name: 'StatsByStage_Selected', params: {zoneId: selected.zone, stageId: selected.stage}}"
          >
            <v-icon
              left
              small
            >
              mdi-chart-pie
            </v-icon>
            {{ $t('menu.stats._name') }}
          </v-btn>
        </v-row>

        <v-alert
          color="orange darken-3"
          border="left"
          class=" mx-2"
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
          class="subtitle-1 pl-6 mb-4 mx-2"
          dark
          border="left"
        >
          {{ $t('usage') }}
        </v-alert>

        <v-alert
          v-if="isGacha"
          color="blue darken-2"
          class="subtitle-1 pl-6 mb-4 mx-2"
          dark
          border="left"
        >
          {{ $t('gacha') }}
        </v-alert>

        <v-container
          v-for="category in stageItems"
          :key="category.id"
          fluid
          class="py-0"
        >
          <v-subheader class="pl-2">
            {{ $t('stage.loots.' + category.id) }}
            <v-divider class="ml-4" />
          </v-subheader>
          <span
            v-for="item in category.drops"
            :key="item.itemId"
            class="py-1 px-1 d-inline-block"
          >
            <!--                  <h5 class="title mb-4">-->
            <!--                    {{ item.name }}-->
            <!--                  </h5>-->
            <ItemStepper
              :item="item.item"
              :bus="eventBus"
              @change="(e) => handleChange(category.id, e)"
            />
          </span>
        </v-container>

        <v-col class="pa-6 pt-0">
          <v-switch
            v-model="furniture"
            color="primary"
            :label="$t('report.furniture', {state: $t(`meta.hasNorNot.${furniture}`)})"
            class="mb-5 pb-0"
            hide-details
          />

          <code>
            {{ JSON.stringify(results) }}
          </code>

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
    </StageSelector>

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
          <div
            v-if="results.length"
            class="d-flex flex-column"
          >
            <span>
              {{ $t('report.alert.causes.limitation') }}
            </span>
            <Subheader>
              {{ $t('meta.details') }}
            </Subheader>
            <v-card class="pa-1">
              <v-list
                v-if="validation.type.length"
                two-line
                subheader
              >
                <v-subheader>
                  {{ $t('report.rules.type._name') }}
                </v-subheader>

                <v-list-item
                  v-for="type in validation.type"
                  :key="type.type"
                >
                  <v-list-item-avatar>
                    <v-icon>mdi-alert-circle-outline</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="v-list--force-line-break">
                      {{ $t('report.rules.type.now', type.extras) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="v-list--force-line-break">
                      {{ type.message }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider
                v-if="validation.type.length && validation.item.length"
                class="mx-4"
              />
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
                  :key="`${item.extras.stage}--${item.itemId}`"
                >
                  <v-list-item-avatar>
                    <Item
                      :item="getItem(item.itemId)"
                      :ratio="0.5"
                      disable-tooltip
                      disable-link
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="v-list--force-line-break">
                      {{ $t('report.rules.item.now', item.extras) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="v-list--force-line-break">
                      {{ item.message }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </div>


          <p v-if="!results.length">
            {{ $t('report.alert.causes.noDrop') }}
          </p>

          <p
            v-if="results.length"
            class="subtitle-1 mt-4"
          >
            {{ $t('report.alert.contact.before') }}

            <v-btn
              class="font-weight-bold"
              small
              color="blue"
              rounded
              outlined
              :to="{name: 'AboutContact'}"
            >
              {{ $t('report.alert.contact.activator') }}
            </v-btn>

            {{ $t('report.alert.contact.after') }}
          </p>

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
            {{ $t('meta.dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            text
            @click="dialogs.repeat.enabled = true"
          >
            {{ $t('meta.dialog.confirm') }}
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
            {{ $t('meta.dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            text
            @click="confirmSubmit"
          >
            {{ $t('meta.dialog.confirm') }}
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
import StageSelector from "@/components/stats/StageSelector";
import snackbar from "@/utils/snackbar";
import Subheader from "@/components/global/Subheader";

const categories = [
  "NORMAL_DROP",
  "EXTRA_DROP",
  "SPECIAL_DROP",
];

export default {
  name: "Report",
  components: {Subheader, StageSelector, ItemStepper, Item },
  data: () => ({
    invalidPath: false,
    snackbar: false,
    submitting: false,
    undoing: false,
    lastSubmissionId: null,
    undoed: false,
    results: [],
    furnitureInternal: false,
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
    selectedZone () {
      if (!this.selected.zone) return {};
      return get.zones.byZoneId(this.selected.zone);
    },
    selectedStage () {
      if (!this.selected.stage) return {};
      return get.stages.byStageId(this.selected.stage);
    },
    furniture: {
      get () {
        return this.furnitureInternal
      },
      set (val) {
        if (val === true) {
          this.results.push({
            dropType: "FURNITURE",
            itemId: "furni",
            quantity: 1
          });
        } else if (val === false) {
          this.results = this.results.filter(el => el.dropType !== "FURNITURE" && el.itemId !== "furni")
        }
      }
    },
    dropInfos() {
      const dropInfos = {
        type: [],
        item: []
      };

      if (!this.selected.stage) return dropInfos;
      const stages = this.selectedStage;

      for (const drop of stages["dropInfos"]) {
        if (drop["itemId"]) {
          dropInfos.item.push({
            ...drop,
            item: get.items.byItemId(drop["itemId"])
          })
        } else {
          // when an itemId is not presented, a category drop bound is described.
          dropInfos.type.push(drop)
        }
      }

      dropInfos.item.sort((a, b) => a.item.sortId - b.item.sortId);

      return dropInfos
    },

    stageItems () {
      const items = [];

      for (const category of categories) {
        const categoryDrops = [];

        for (const itemDropInfo of this.dropInfos.item.filter(v => v["dropType"] === category)) {
          const dropType = itemDropInfo["dropType"]
          if (dropType === "FURNITURE") continue
          if (!(dropType in items)) this.$set(items, dropType , [])

          categoryDrops.push(itemDropInfo)
        }

        if (categoryDrops.length === 0) continue

        items.push({
          id: category,
          drops: categoryDrops
        })
      }

      return items
    },

    isGacha () {
      return this.selected.stage && this.selectedStage["isGacha"]
    },

    /**
     * @typedef {{lower: number, upper: number, exceptions: number[]}} Limitation
     * @typedef {{itemId: string, type: string, quantity: number, limitation: Limitation, rate: number, message: string}} ItemOutlier
     * @typedef {{type: string, quantity: number, limitation: Limitation, rate: number, message: string}|null} TypeOutlier
     * @returns {{item: ItemOutlier[], type: TypeOutlier[], rate: number}} returns item data outliers and type data outliers in the whole dataset, respectively
     */
    validation() {
      // initiate the array that will be storing every data outlier
      /** @type ItemOutlier[] */
      const itemOutliers = [];

      /** @type TypeOutlier[] */
      const typeOutliers = [];

      const nullValidation = { item: itemOutliers, type: typeOutliers, rate: 0 };

      if (!this.selected.stage) return nullValidation;

      /**
       * validate the quantity using their corresponding rule
       */
      function validate(rules, quantity) {
        for (const rule of rules) {
          const evaluation = rule(quantity);
          if (evaluation !== true) return evaluation
        }
        return [true, {}]
      }

      /**
       * calculate the outlier rate
       * @param {Limitation} limitation rules to verify with
       * @param {number} value value to verify with
       * @returns {number} percentage in decimal format (e.g. 150% = 1.5)
       */
      function calculateOutlierRate(limitation, value) {
        const upper = (value - limitation.upper) ? Math.max(0, (value - limitation.upper) / limitation.upper) : 0;
        const lower = (limitation.lower - value) ? Math.max(0, (limitation.lower - value) / limitation.lower) : 0;
        return upper + lower;
      }

      // loop the candidate results that user provided
      for (const result of this.results) {
        // generate rules. rules: Function[]; limitation: the bounds
        const {rules, limitation} = this.generateVerificationRule("item", result)

        if (limitation === null) return {
          error: "EMPTY_RULE",
          ...nullValidation
        }

        const quantity = result.quantity;

        // execute validation rules.
        const [validation, extras] = validate(rules, quantity);

        // if validation fails on a rule
        if (validation !== true) {
          // calculate the outlier rate based on the bounds and current value
          // e.g. [0, 3), 6: will get 1 (outlier value 100%)
          const rate = calculateOutlierRate(limitation, result.quantity);

          // store this outlier
          itemOutliers.push({
            itemId: result.itemId,
            type: result.dropType,
            quantity,
            limitation,
            rate,
            message: validation,
            extras
          })
        }
      }

      // loop the type declarations (dropType limitations)
      for (const dropType of categories) {
        // generate rules
        const {rules, limitation} = this.generateVerificationRule("type", {
          dropType
        })

        if (limitation === null) return {
          error: "EMPTY_RULE",
          ...nullValidation
        }

        const quantity = this.results
          .filter(el => el["dropType"] === dropType)
          .length;

        // execute validation rules.
        const [validation, extras] = validate(rules, quantity);

        // if validation fails on a rule
        if (validation !== true) {
          // calculate the outlier rate based on the bounds and current value
          // e.g. [0, 3), 6: will get 1 (outlier value 100%)
          const rate = calculateOutlierRate(limitation, quantity);

          // store this outlier
          typeOutliers.push({
            type: dropType,
            quantity,
            limitation,
            rate,
            message: validation,
            extras
          })
        }
      }

      // calculate total outlier rate
      const itemRates = itemOutliers.reduce(
        (accumulator, current) => accumulator + current.rate,
        0
      );
      const typeRates = typeOutliers.reduce(
        (accumulator, current) => accumulator + current.rate,
        0
      );
      const totalRates = itemRates + typeRates;

      console.log(itemOutliers, typeOutliers, totalRates)

      return {
        item: itemOutliers,
        type: typeOutliers,
        rate: totalRates
      }
    },
    valid() {
      const { item, type } = this.validation;
      return item.length === 0 && type.length === 0
    },
    slashStripClasses() {
      return { 'slash-strip--warning': this.validation.rate <= 2, 'slash-strip--danger': this.validation.rate > 2 }
    }
  },
  created () {
    this.validateZone(this.$route.params.zoneId)
  },
  methods: {
    validateZone (zoneId) {
      if (zoneId) {
        const got = get.zones.byZoneId(zoneId);
        if (!got || got.isOutdated) {
          return this.invalidPath = true;
        }
      }
      return this.invalidPath = false;
    },
    goToPage(name) {
      this.$router.push({ name: name })
    },
    select({ zone, stage }) {
      this.reset();
      this.selected.zone = zone;
      this.selected.stage = stage;
      this.validateZone(zone);
    },
    getItem(itemId) {
      return get.items.byItemId(itemId)
    },
    handleChange(dropType, [itemId, diff]) {
      let item = this.getOrCreateItem(dropType, itemId);
      item.quantity += diff;
      item.quantity <= 0 && (this.results.splice(this.results.indexOf(item), 1))
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
      const userId = Cookies.get('userID');
      report.submitReport({
        stageId: this.selected.stage,
        drops: this.results,
      })
      .then(({data}) => {
        const reportedUserId = Cookies.get('userID');
        if (userId !== reportedUserId) {
          this.$store.commit("auth/login", reportedUserId);
        }
        this.reset();
        this.submitted = true;
        this.$ga.event('report', 'submit_single', this.selected.stage, 1)

        this.lastSubmissionId = data;
      })
      .catch(() => {
        snackbar.networkError()
      })
      .finally(() => {
        this.submitting = false;
      })
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
    generateVerificationRule(type, query) {
      let limitation;
      let verificationResponse = {
        stage: this.$t(`stage.loots.${query["dropType"]}`)
      };
      console.log("generating verification rule for", type, query)
      if (type === "item") {
        limitation = this.dropInfos.item
          .find(v => v["itemId"] === query["itemId"] && v["dropType"] === query["dropType"])["bounds"];

        verificationResponse = {
          ...verificationResponse,
          item: strings.translate(this.getItem(query["itemId"]), "name")
        }
      } else if (type === "type") {
        limitation = this.dropInfos.type
          .find(v => v["dropType"] === query["dropType"])["bounds"]

      } else {
        throw new TypeError(`generateVerificationRule: Invalid argument ${type}`)
      }

      // can't found drop info based on the queries, means it should be zero/not presenting.
      if (!limitation) return {
        rules: [
          () => {
            return () => {
              return this.$t(`report.rules.null`, {type})
            }
          }
        ],
        limitation
      };

      // rule declarations

      // greater than or equal to
      const gte = (value) => {
        return (compare) => {
          const response = { ...verificationResponse, quantity: compare, should: value };
          return compare >= value ? true : [this.$t(`report.rules.${type}.gte`, response), response]
        }
      };

      // less than or equal to
      const lte = (value) => {
        return (compare) => {
          const response = { ...verificationResponse, quantity: compare, should: value };
          return compare <= value ? true : [this.$t(`report.rules.${type}.lte`, response), response]
        }
      };

      // not including
      const notIncludes = (values) => {
        return (compare) => {
          const response = { ...verificationResponse, quantity: compare, should: values.join(",") };
          return values.indexOf(compare) === -1 ? true : [this.$t(`report.rules.${type}.not`, response), response]
        }
      };

      // compose generation
      const generated = {
        rules: [
          gte(limitation.lower),
          lte(limitation.upper),
        ],
        limitation
      }

      // if there's limitation then we also need to verify the notIncludes.
      if (limitation.exceptions) generated.rules.push(notIncludes(limitation.exceptions))

      return generated
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

.round {
  border-radius: 4px;
}

  .v-list--force-line-break {
    white-space: normal;
  }
</style>
