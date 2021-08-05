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
        class="mx-0 z-index-5"
      >
        <v-icon class="mr-4">
          mdi-check
        </v-icon>

        {{ $t('report.success') }}

        <v-spacer />

        <v-btn
          v-haptic
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
          v-haptic
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
        v-haptic
        text
        @click="undid = false"
      >
        {{ $t('meta.dialog.close') }}
      </v-btn>
    </v-snackbar>

    <SpecialStageDialog
      v-model="specialStageDialog"
      @confirm="dialogRead"
      @cancel="specialStageDialog = false"
    />

    <StageSelector
      :name="$t('report.name')"
      :router-names="routerNames"

      hide-closed
      class="pa-3"
      @select="select"
    >
      <v-card
        v-if="selected.stage"
        class="bkop-light pa-2 content-card"
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
          class="ma-4 z-index-5"
          align="start"
        >
          <h1 class="title no-wrap--text">
            <span class="subtitle-2">{{ strings.translate(selectedZone, "zoneName") }}</span>
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
            v-haptic
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
                  :item-options="{ disableOverviewCard: true }"

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
                  v-haptic
                  color="primary"
                  class="my-0 pb-0 d-inline-flex"
                  hide-details
                  :disabled="submitting"
                >
                  <template #label>
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
            </v-row>

            <v-row
              v-if="$vuetify.breakpoint.smAndDown"
              justify="space-around"
              class="z-index-5"
            >
              <v-btn
                v-haptic
                large
                rounded
                color="error"
                class="px-4 py-2"
                @click="reset"
              >
                {{ $t('report.clear') }}
              </v-btn>

              <v-btn
                v-haptic
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

            <v-alert
              v-if="isSpecialSideStory"
              color="blue darken-2"
              class="subtitle-1 pl-6 mb-4 mx-2 markdown-content-inline"
              dark
              border="left"
            >
              <h3 class="subtitle-1 mb-2">
                请<strong class="text-glow">确保集齐所有标志物</strong>后再进行汇报
              </h3>
              <p class="subtitle-2">
                根据初步数据统计推测，标志物掉率计算事件可能不满足独立前提。因此，我们决定仅收集集齐所有标志物后的掉率数据
              </p>
            </v-alert>

            <v-row
              v-if="!$vuetify.breakpoint.smAndDown"
              justify="space-around"
              class="mt-6"
            >
              <v-btn
                v-haptic
                large
                rounded
                color="error"
                class="px-4 py-2"
                @click="reset"
              >
                {{ $t('report.clear') }}
              </v-btn>

              <v-btn
                v-haptic
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

        <BackdropName :content="strings.translate(selectedStage, 'code')" />
      </v-card>
    </StageSelector>

    <v-dialog
      v-model="dialog.enabled"
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
            <ReportValidationOutlier :validation="validation" />
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
              v-haptic
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
            v-haptic
            color="primary"
            text
            @click="dialog.enabled = false"
          >
            {{ $t('meta.dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            v-haptic
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
import ItemStepper from '@/components/global/ItemStepper'
import Vue from 'vue'
import strings from '@/utils/strings'
import StageSelector from '@/components/stats/StageSelector'
import snackbar from '@/utils/snackbar'
import Subheader from '@/components/global/Subheader'
import Theme from '@/mixins/Theme'
import ItemIcon from '@/components/global/ItemIcon'
import validator from '@/utils/validator'
import existUtils from '@/utils/existUtils'
import performance from '@/utils/performance'
import Console from '@/utils/Console'
import BackdropName from '@/components/stats/BackdropName'
import ReportValidator from "@/utils/reportValidator";
import ReportValidationOutlier from "@/components/stats/ReportValidationOutlier";
import SpecialStageDialog from "@/components/report/SpecialStageDialog";

// colors: [dark, light]
const categories = [
  {
    id: 'NORMAL_DROP',
    colors: ['#cacbcc', '#4d4d4d']
  },
  {
    id: 'SPECIAL_DROP',
    colors: ['#e26d2c', '#b35522']
  },
  {
    id: 'EXTRA_DROP',
    colors: ['#9aba3d', '#8aa637']
  }
]

export default {
  name: 'Report',
  components: {
    SpecialStageDialog,
    ReportValidationOutlier, BackdropName, ItemIcon, Subheader, StageSelector, ItemStepper },
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

    dialog: {
      enabled: false
    },

    selected: {
      zone: null,
      stage: null
    },

    routerNames: {
      index: 'ReportByZone',
      details: 'ReportByZone_Selected'
    },

    specialStageDialog: false
  }),
  computed: {
    serverName () {
      return this.$t('server.servers.' + this.$store.getters['dataSource/server'])
    },
    strings () {
      return strings
    },
    selectedZone () {
      if (!this.selected.zone) return {}
      return get.zones.byZoneId(this.selected.zone, false)
    },
    selectedStage () {
      if (!this.selected.stage) return {}
      return get.stages.byStageId(this.selected.stage)
    },
    furniture: {
      get () {
        return this.furnitureInternal
      },
      set (val) {
        this.furnitureInternal = val
        if (val === true) {
          this.results.push({
            dropType: 'FURNITURE',
            itemId: 'furni',
            quantity: 1
          })
        } else if (val === false) {
          this.results = this.results.filter(el => el.dropType !== 'FURNITURE' && el.itemId !== 'furni')
        }
      }
    },
    dropInfos () {
      const dropInfos = {
        type: [],
        item: []
      }

      const stages = this.selectedStage
      if (!this.selectedZone || this.invalidStage || !this.selectedZone.zoneId) return null

      for (const drop of stages.dropInfos) {
        if (drop.itemId) {
          dropInfos.item.push({
            ...drop,
            item: get.items.byItemId(drop.itemId)
          })
        } else {
          // when an itemId is not presented, a category drop bound is described.
          dropInfos.type.push(drop)
        }
      }

      dropInfos.item.sort((a, b) => a.item.sortId - b.item.sortId)

      return dropInfos
    },

    stageItems () {
      if (this.invalidStage) return []

      const items = []

      for (const { id, colors } of categories) {
        const category = id
        const categoryDrops = []

        for (const itemDropInfo of this.dropInfos.item.filter(v => v.dropType === category)) {
          const dropType = itemDropInfo.dropType
          if (dropType === 'FURNITURE') continue
          if (
            !(
              validator.have(items, dropType)
            )
          ) {
            this.$set(items, dropType, [])
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
      return this.selected.stage && this.selectedStage.isGacha
    },

    validation () {
      if (this.invalidStage || !this.selectedStage.dropInfos) return ReportValidator.null()

      const validator = new ReportValidator(
        this.$store.getters['dataSource/server'],
        this.selectedZone,
        this.selectedStage,
        this.results
      )

      Console.info('Report', 'initialized validator as', validator)

      return validator.validate()
    },

    valid () {
      const { item, type } = this.validation
      return item.length === 0 && type.length === 0
    },
    slashStripClasses () {
      return { 'slash-strip--warning': this.validation.rate <= 2, 'slash-strip--danger': this.validation.rate > 2 }
    },
    invalidStage () {
      if (this.selected.zone && this.selected.stage) {
        const zone = get.zones.byZoneId(this.selected.zone, false)
        if (!zone || !zone.zoneId || !existUtils.existence(zone)) return 'NOT_FOUND'
        if (zone.isOutdated) return 'EXPIRED'

        const stage = get.stages.byStageId(this.selected.stage)
        if (!stage || !stage.stageId || !existUtils.existence(stage)) return 'NOT_FOUND'
        if (!stage.dropInfos || !stage.dropInfos.length) return 'INVALID'
      } else {
        return 'NOT_FOUND'
      }
      return false
    },
    performance () {
      return performance
    },
    isSpecialSideStory() {
      return (this.selectedStage || {}).zoneId === 'act12side_zone1'
    }
  },
  methods: {
    goToPage (name) {
      this.$router.push({ name: name })
    },
    select ({ zone, stage }) {
      this.reset()
      this.selected.zone = zone
      this.selected.stage = stage
    },
    getItem (itemId) {
      return get.items.byItemId(itemId)
    },
    touchDialog () {
      const read = this.$store.getters['options/specialSideStoryDialogRead']
      if (!read && this.isSpecialSideStory) {
        this.specialStageDialog = true
      }
    },
    dialogRead() {
      this.$store.commit('options/setSpecialSideStoryDialogRead', true)
      this.specialStageDialog = false
    },
    handleChange (dropType, [itemId, diff]) {
      this.touchDialog()
      const item = this.getOrCreateItem(dropType, itemId)
      item.quantity += diff
      item.quantity <= 0 && (this.results.splice(this.results.indexOf(item), 1))
    },
    getOrCreateItem (dropType, itemId) {
      const item = this.results.find(v => v.itemId === itemId && v.dropType === dropType)
      if (item === undefined) {
        const newLength = this.results.push({
          dropType,
          itemId,
          quantity: 0
        })
        return this.results[newLength - 1]
      }
      return item
    },
    reset () {
      this.results = []
      this.eventBus.$emit('reset')
      this.furniture = false
    },
    submit () {
      if (!this.isGacha && (!this.valid || this.results.length === 0)) {
        this.dialog.enabled = true
        this.$ga.event('report', 'show_warning', this.selected.stage, 1)
      } else {
        this.doSubmit()
      }
    },
    async doSubmit () {
      this.submitted = false
      this.submitting = true
      const timer = performance.timer.ctx(
        report.submitReport({
          stageId: this.selected.stage,
          drops: this.results
        })
          .then(({ data }) => {
            this.reset()
            this.submitted = true
            this.$ga.event('report', 'submit_single', this.selected.stage, 1)

            this.lastSubmissionId = data
          })
          .catch(() => {
            snackbar.networkError()
          })
          .finally(() => {
            this.submitting = false
          })
      )
      // Console.debug("Report", "report with context: got performance timer promise", timer)
      timer.then(timeDelta => {
        Console.info('Performance', `report submit request last ${timeDelta}ms to complete`)
        this.$ga.time({
          timingCategory: 'report',
          timingVar: 'submit',
          timingValue: timeDelta
        })
      })
    },
    confirmSubmit () {
      this.dialog.enabled = false
      this.$ga.event('report', 'ignore_warning', this.selected.stage, 1)
      this.doSubmit()
    },
    async undo () {
      this.undoing = true
      await report.recallReport(this.lastSubmissionId)
      this.submitted = false
      this.undoing = false
      this.undid = true
      this.$ga.event('report', 'undo', this.$store.getters['auth/loggedIn'], 1)
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
