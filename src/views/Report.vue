<template>
  <v-container
    class="fill-height align-start"
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
      v-model="undid"
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
        @click="undid = false"
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
      <v-card
        v-if="selected.stage"
        class="bkop-light pa-2"
      >
        <v-overlay
          :opacity="0.75"
          absolute
          :value="invalidStage"
          :class="{'slash-strip--warning-transparent': invalidStage}"
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
              {{ $t('report.closedReason.' + invalidStage) }}
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
            <!--            <v-btn-->
            <!--              icon-->
            <!--            >-->
            <!--              <v-icon>-->
            <!--                mdi-star-->
            <!--              </v-icon>-->
            <!--            </v-btn>-->
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
                :style="{'color': category.colors[dark ? 0 : 1], 'text-shadow': `0 0 10px ${category.colors[dark ? 0 : 1]}`}"
              >
                {{ $t('stage.loots.' + category.id) }}
                <v-divider
                  class="ml-2"
                  :style="{'border-color': category.colors[dark ? 0 : 1]}"
                />
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
            
            <v-row
              justify="center"
              class="mx-2 mb-5"
              dense
            >
              <v-col
                cols="12"
              >
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
                      {{ $t('report.furniture', {state: $t(`meta.hasNorNot.${furniture}`)}) }}
                    </span>
                  </template>
                </v-switch>
              </v-col>

              <!--          <v-col-->
              <!--            cols="12"-->
              <!--            sm="6"-->
              <!--            md="6"-->
              <!--            lg="6"-->
              <!--            xl="6"-->
              <!--          >-->
              <!--            <v-switch-->
              <!--              v-model="plannerIntegration.enabled"-->
              <!--              color="primary"-->
              <!--              class="my-0 pb-0 d-flex align-center"-->
              <!--              hide-details-->
              <!--              :disabled="submitting"-->
              <!--            >-->
              <!--              <template v-slot:label>-->
              <!--                <v-slide-x-transition leave-absolute>-->
              <!--                  <v-badge-->
              <!--                    v-if="plannerIntegration.enabled"-->
              <!--                    icon="mdi-sync"-->
              <!--                    bordered-->
              <!--                    bottom-->
              <!--                    overlap-->
              <!--                    :offset-x="7"-->
              <!--                    :offset-y="10"-->
              <!--                    class="mr-3"-->
              <!--                  >-->
              <!--                    <v-icon>-->
              <!--                      mdi-floor-plan-->
              <!--                    </v-icon>-->
              <!--                  </v-badge>-->
              <!--                </v-slide-x-transition>-->
              <!--                <span class="mr-2">-->
              <!--                  同步汇报内容到刷图规划器-->
              <!--                </span>-->
              <!--                <v-dialog-->
              <!--                  v-model="plannerIntegration.dialog"-->
              <!--                  max-width="450px"-->
              <!--                >-->
              <!--                  <template v-slot:activator="{ on, attrs }">-->
              <!--                    <v-btn-->
              <!--                      icon-->
              <!--                      v-on="on" v-bind="attrs"-->
              <!--                    >-->
              <!--                      <v-icon>-->
              <!--                        mdi-help-circle-->
              <!--                      </v-icon>-->
              <!--                    </v-btn>-->
              <!--                  </template>-->
              <!--                  <v-card color="background">-->
              <!--                    <v-card-title>-->
              <!--                      同步汇报内容到刷图规划器-->
              <!--                    </v-card-title>-->
              <!--                    <v-card-text>-->
              <!--                      在开启此功能且汇报成功后，会自动将此次获得的物品数量于刷图规划器内对应物品的【已有】栏目进行累加。-->
              <!--                    </v-card-text>-->
              <!--                    <v-card-actions>-->
              <!--                      <v-spacer />-->
              <!--                      <v-btn-->
              <!--                        text-->
              <!--                        @click="plannerIntegration.dialog = false"-->
              <!--                      >-->
              <!--                        {{ $t('meta.dialog.close') }}-->
              <!--                      </v-btn>-->
              <!--                    </v-card-actions>-->
              <!--                  </v-card>-->
              <!--                </v-dialog>-->
              <!--              </template>-->
              <!--            </v-switch>-->
              <!--          </v-col>-->
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
                  {{ $t('report.submit') }}
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
            <v-alert
              v-if="!$vuetify.breakpoint.smAndDown"
              dense
              color="secondary darken-2"
              class="subtitle-1 pl-6 mb-4 mx-2"
              dark
              border="left"
            >
              {{ $t('report.usage') }}
            </v-alert>
            <v-alert
              color="orange darken-3"
              border="left"
              class=" mx-2"
            >
              <ol>
                <li v-if="!isGacha">
                  {{ $t('report.notices.rule_1') }}
                </li>
                <li>{{ $t('report.notices.rule_2') }}</li>
                <li>{{ $t('report.notices.rule_3') }}</li>
                <li>{{ $t('report.notices.rule_4') }}</li>
              </ol>
            </v-alert>

            <v-alert
              v-if="isGacha"
              color="blue darken-2"
              class="subtitle-1 pl-6 mb-4 mx-2"
              dark
              border="left"
            >
              {{ $t('report.gacha') }}
            </v-alert>

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
                  {{ $t('report.submit') }}
                </span>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
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
import Theme from "@/mixins/Theme";
import ItemIcon from "@/components/global/ItemIcon";
import config from "@/config";
import validator from "@/utils/validator";
import existUtils from "@/utils/existUtils";
import performance from "@/utils/performance";
import Console from "@/utils/Console";

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
  },
];

export default {
  name: "Report",
  components: {ItemIcon, Subheader, StageSelector, ItemStepper, Item },
  mixins: [Theme],
  data: () => ({
    snackbar: false,

    submitting: false,
    submitted: false,

    undoing: false,
    undid: false,

    lastSubmissionId: null,

    results: [],
    furnitureInternal: false,
    // invalidCount: 0,
    eventBus: new Vue(),

    plannerIntegration: {
      enabled: false,
      dialog: false
    },

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
    serverName() {
      return this.$t('server.servers.' + this.$store.getters["dataSource/server"])
    },
    strings() {
      return strings
    },
    selectedZone () {
      if (!this.selected.zone) return {};
      return get.zones.byZoneId(this.selected.zone, false);
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
        this.furnitureInternal = val
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

      const stages = this.selectedStage;
      if (!this.selectedZone || this.invalidStage || !this.selectedZone.zoneId) return null;

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
      if (this.invalidStage) return []

      const items = [];

      for (const {id, colors} of categories) {
        const category = id;
        const categoryDrops = [];

        for (const itemDropInfo of this.dropInfos.item.filter(v => v["dropType"] === category)) {
          const dropType = itemDropInfo["dropType"]
          if (dropType === "FURNITURE") continue
          if (
            !(
              validator.have(items, dropType)
            )
          ) {
            this.$set(items, dropType , [])
          }

          categoryDrops.push(itemDropInfo)
        }

        if (categoryDrops.length === 0) continue

        items.push({
          id: category,
          colors,
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

      if (!this.selectedZone || this.invalidStage) return nullValidation;

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
      for (const dropInfo of this.dropInfos.item) {
        const record = this.results.find(el => el.itemId === dropInfo.itemId && el.dropType === dropInfo.dropType) || {...dropInfo, quantity: 0}

        // generate rules. rules: Function[]; limitation: the bounds
        const {rules, limitation} = this.generateVerificationRule("item", dropInfo)

        if (limitation === null) return {
          error: "EMPTY_RULE",
          ...nullValidation
        }

        const quantity = record.quantity;

        // execute validation rules.
        const [validation, extras] = validate(rules, quantity);

        // console.log("generated & executed", dropInfo, "->", {rules, limitation, validation, extras})

        // if validation fails on a rule
        if (validation !== true) {
          // calculate the outlier rate based on the bounds and current value
          // e.g. [0, 3), 6: will get 1 (outlier value 100%)
          const rate = calculateOutlierRate(limitation, record.quantity);

          // store this outlier
          itemOutliers.push({
            itemId: dropInfo.itemId,
            type: dropInfo.dropType,
            quantity,
            limitation,
            rate,
            message: validation,
            extras
          })
        }
      }

      // loop the type declarations (dropType limitations)
      for (const {id} of categories) {
        const dropType = id;
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
    },
    invalidStage () {
      if (this.selected.zone && this.selected.stage) {
        const zone = get.zones.byZoneId(this.selected.zone, false);
        if (!zone || !zone.zoneId || !existUtils.existence(zone)) return "INVALID"
        if (zone.isOutdated) return "EXPIRED"

        const stage = get.stages.byStageId(this.selected.stage);
        if (!stage || !stage.stageId || !existUtils.existence(stage)) return "INVALID"
      } else {
        return "INVALID"
      }
      return false
    },
    performance () {
      return performance
    }
  },
  methods: {
    goToPage(name) {
      this.$router.push({ name: name })
    },
    select({ zone, stage }) {
      this.reset();
      this.selected.zone = zone;
      this.selected.stage = stage;
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
      const userId = Cookies.get(config.authorization.userId.cookieKey);
      const timer = performance.timer.ctx(
        report.submitReport({
          stageId: this.selected.stage,
          drops: this.results,
        })
          .then(({data}) => {
            const reportedUserId = Cookies.get(config.authorization.userId.cookieKey);
            if (userId !== reportedUserId) {
              this.$store.dispatch("auth/login", {
                userId: reportedUserId
              });
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
      )
      // Console.debug("Report", "report with context: got performance timer promise", timer)
      timer.then(timeDelta => {
        Console.info("Performance", `report submit request last ${timeDelta}ms to complete`)
        this.$ga.time({
          timingCategory: 'report',
          timingVar: 'submit',
          timingValue: timeDelta
        })
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
      this.undid = true;
      this.$ga.event('report', 'undo', Cookies.get(config.authorization.userId.cookieKey), 1)
    },
    closeAllDialogs() {
      this.dialogs.first.enabled = false;
      this.dialogs.repeat.enabled = false
    },
    generateVerificationRule(type, query) {
      if (this.invalidStage || !this.dropInfos) return {
        rules: [
          () => {
            return () => {
              return true
            }
          }
        ],
        limitation: {}
      }

      let limitation;
      let verificationResponse = {
        stage: this.$t(`stage.loots.${query["dropType"]}`)
      };
      // console.log("generating verification rule for", type, query)
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
          // console.log("executing rule: gte with compare", compare, "should", value)
          const response = { ...verificationResponse, quantity: compare, should: value };
          return compare >= value ? true : [this.$t(`report.rules.${type}.gte`, response), response]
        }
      };

      // less than or equal to
      const lte = (value) => {
        return (compare) => {
          // console.log("executing rule: lte with compare", compare, "should", value)
          const response = { ...verificationResponse, quantity: compare, should: value };
          return compare <= value ? true : [this.$t(`report.rules.${type}.lte`, response), response]
        }
      };

      // not including
      const notIncludes = (values) => {
        return (compare) => {
          // console.log("executing rule: notIncludes with compare", compare, "should", values)
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

      // console.log("generateVerificationRule", type, query, generated)

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
</style>
