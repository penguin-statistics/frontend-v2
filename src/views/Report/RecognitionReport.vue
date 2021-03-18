<!--suppress NestedConditionalExpressionJS -->
<template>
  <v-container
    fluid
    class="fill-height"
  >
    <RecognitionImageDialog v-model="expandImage.src" />

    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col cols="12">
        <v-dialog
          v-model="submitDialog.open"
          persistent
        >
          <v-card class="d-flex fill-height">
            <v-card-text>
              <v-row
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  class="px-1 py-12 text-center"
                  style="width: 100%"
                >
                  <PreloaderInline class="mx-auto mb-6" />
                  <h1 class="title">
                    {{ $t("report.recognition.states.submitting") }}
                  </h1>
                  <v-row>
                    <v-col>
                      <v-progress-linear
                        indeterminate
                        class="mx-auto"
                        style="width: 90%"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-card class="bkop-medium">
          <v-card-title
            class="px-6"
            :class="{'grey lighten-3': !dark, 'secondary': dark}"
          >
            {{ $t('menu.report.recognition') }}
          </v-card-title>
          <v-card-subtitle
            class="px-6"
            :class="{'grey lighten-3': !dark, 'secondary': dark}"
          >
            {{ $t('report.recognition.description') }}
          </v-card-subtitle>
          <v-stepper
            v-model="step"
            class="bkop-light pt-2 transparent elevation-0"
            :class="{'dense-stepper': $vuetify.breakpoint.xs}"
            vertical
          >
            <v-stepper-step
              :complete="step > 1"
              step="1"
            >
              {{ $t("report.recognition.step.select") }}
            </v-stepper-step>

            <v-stepper-content step="1">
              <template v-if="step === 1">
                <v-alert
                  color="orange darken-3"
                  border="left"
                  outlined
                  class="mb-2"
                >
                  <ol>
                    <li
                      v-for="notice in $t('report.recognition.notices.welcome')"
                      :key="notice"
                      v-marked
                      class="markdown-content-inline"
                      v-text="notice"
                    />
                  </ol>
                </v-alert>

                <ImageInput
                  v-model="files"
                  @valid="valid => isFilesValid = valid"
                />

                <DynamicSizeBtn
                  :loading="step === 2"
                  :reason="files.length ? $t('report.recognition.tips.hasInvalidFile') : $t('report.recognition.tips.emptyFile')"
                  :disabled="!files.length || !isFilesValid"
                  :length="files.length"
                  @click="initAndRecognize"
                />
              </template>
            </v-stepper-content>

            <v-stepper-step
              :complete="step > 2"
              step="2"
            >
              {{ $t("report.recognition.step.recognize") }}
            </v-stepper-step>

            <v-stepper-content step="2">
              <template v-if="step === 2">
                <div class="d-flex flex-column py-10">
                  <div class="d-flex flex-column flex-md-row flex-lg-row flex-xl-row justify-center align-center mx-auto">
                    <PreloaderInline :size="120" />
                    <div class="d-flex flex-column py-4 ml-4">
                      <h2 class="headline">
                        {{ $t('report.recognition.states.' + recognition.state) }}
                      </h2>

                      <span
                        class="monospace-pure my-2"
                        style="word-break: keep-all; text-overflow: ellipsis; line-height: 20px; height: 20px; max-width: 50vw; white-space: nowrap"
                      >
                        {{ recognition.state === 'rendering' ? $t('report.recognition.states.rendering') : (recognition.current || $t('report.recognition.recognize.noFilename')) }}
                      </span>

                      <FactTable>
                        <FactTableItem
                          :title="$t('report.recognition.recognize.elapsed')"
                          :content="recognition.timer.elapsed + 's'"
                          content-class="monospace"
                        />
                        <FactTableItem
                          :title="$t('report.recognition.recognize.remaining')"
                          :content="recognition.timer.remaining + 's'"
                          content-class="monospace"
                        />
                        <FactTableItem
                          :title="$t('report.recognition.recognize.speed')"
                          :content="$t('report.recognition.recognize.imagePerSecond', {count: (recognition.timer.imagePerSecond || 0).toFixed(1)})"
                          content-class="monospace"
                        />
                      </FactTable>
                    </div>
                  </div>
                </div>
                <v-progress-linear
                  v-if="recognition.state === 'initializing'"
                  indeterminate
                  class="quick-transition"
                  stream
                  height="28"
                  striped
                  rounded
                >
                  {{ $t("report.recognition.states.initializing") }}
                </v-progress-linear>
                <v-progress-linear
                  v-else
                  class="quick-transition"
                  :value="(results.length / (files.length || 1)) * 100"
                  stream
                  height="28"
                  striped
                  rounded
                >
                  {{ results.length }} / {{ files.length }} ({{
                    ((results.length / (files.length === 0 ? 1 : files.length)) * 100).toFixed(0)
                  }}%)
                </v-progress-linear>
              </template>
            </v-stepper-content>

            <v-stepper-step
              :complete="step > 3"
              step="3"
            >
              {{ $t("report.recognition.step.confirm") }}
            </v-stepper-step>

            <v-stepper-content step="3">
              <template v-if="step === 3">
                <v-alert
                  type="info"
                  border="left"
                  outlined
                  class="mb-2 markdown-content-inline"
                >
                  <ul>
                    <li
                      v-for="(notice, i) in $t('report.recognition.notices.confirm')"
                      :key="i"
                      v-marked
                      v-text="notice"
                    />
                  </ul>
                </v-alert>

                <OffTitle
                  :content="$t('report.recognition.confirm.overview._name')"
                  small
                />

                <v-card
                  outlined
                  class="position-relative pa-6 pt-7 background-transparent overflow-hidden"
                >
                  <div class="backdrop-icon">
                    <v-icon :size="60">
                      mdi-image-multiple
                    </v-icon>
                  </div>

                  <RecognitionResultOverview
                    :success="filterResults(['SUCCESS']).length"
                    :error="filterResults(['ERROR']).length"
                    :duration="recognition.durationPerImage"
                    :total="results.length"
                  />
                </v-card>

                <v-alert
                  v-if="filterResults(['SUCCESS']).length !== results.length"
                  color="warning"
                  dense
                  outlined
                  border="left"
                  class="mt-4"
                  icon="mdi-bug"
                >
                  {{ $t('report.recognition.tips.abnormal', {count: filterResults(['ERROR']).length}) }}
                </v-alert>

                <OffTitle
                  :content="$t('report.recognition.confirm.details')"
                  small
                />

                <v-card
                  flat
                  class="position-relative pt-6 transparent"
                  style="min-height: 100px"
                >
                  <TitledRow
                    reactive
                    dense
                    class="px-4 py-3 mx-0 border-outlined radius-1"
                  >
                    <template v-slot:header>
                      {{ $t('report.recognition.filter') }}
                    </template>
                    <template v-slot:content>
                      <v-checkbox
                        v-for="filter in itemFilters"
                        :key="filter.value"

                        v-model="filterValue"
                        v-haptic
                        hide-details
                        :label="filter.text + ` (${filterResults([filter.value]).length})`"
                        class="mt-0 pt-0 mr-4"
                        :value="filter.value"
                        :class="{'mr-2': $vuetify.breakpoint.smAndUp}"
                      />
                    </template>
                  </TitledRow>

                  <v-row v-if="results.length">
                    <v-col
                      v-for="(result, index) in results"
                      :key="index"
                      :class="[filteredResults.includes(result) ? 'd-flex' : 'd-none', 'align-self-stretch']"
                      cols="12"
                      md="6"
                      lg="4"
                      xl="3"
                      class="align-self-stretch"
                    >
                      <v-card
                        outlined
                        :color="
                          resultHasErrorOrWarning[index]
                            ? (dark ? 'rgba(241,97,87,0.5)' : 'rgba(241,97,87,0.3)')
                            : ''"
                        style="width: 100%"
                        class="align-self-stretch fill-height d-flex flex-column justify-start overflow-hidden"
                      >
                        <div class="bkop-medium">
                          <v-img
                            v-ripple
                            :src="result.blobUrl"
                            contain
                            style="cursor: zoom-in"
                            min-height="120px"
                            max-height="240px"
                            class="unknown-ratio-glow"
                            @click="expandImage.src = result.blobUrl"
                          >
                            <template #placeholder>
                              <div class="d-flex align-center justify-center fill-height caption">
                                {{ $t('meta.loading') }}
                              </div>
                            </template>
                            <template #default>
                              <div class="d-flex flex-row full-width justify-end fallthrough">
                                <span
                                  class="monospace font-weight-bold bkop-medium text-right border-outlined img-side-tag elevation-4"
                                >
                                  {{ result.file.lastModified | timeAbsolute }}
                                  <span
                                    class="d-block text-right"
                                    style="font-size: small; line-height: 1.5em"
                                  >
                                    {{ result.file.lastModified | timeRelative }}
                                  </span>
                                </span>
                              </div>
                            </template>
                          </v-img>
                        </div>
                        <v-divider />

                        <v-card-title class="align-start">
                          <div
                            v-if="result.result.stageId"
                            class="d-inline-flex flex-row align-start"
                          >
                            <FactTableItem>
                              <template #title>
                                <span class="textDarken--text">{{ $t('stage.name') }}</span>
                              </template>
                              <template #content>
                                <span class="monospace font-weight-bold">
                                  {{ getStage(result.result.stageId).code }}
                                </span>
                              </template>
                            </FactTableItem>
                            <FactTableItem>
                              <template #title>
                                <span class="textDarken--text">{{ $t('report.recognition.confirm.itemsTotal') }}</span>
                              </template>
                              <template #content>
                                <span class="monospace font-weight-bold">
                                  ×{{ result.result.drops.reduce((prev, curr) => prev + curr.quantity, 0) }}
                                </span>
                              </template>
                            </FactTableItem>
                          </div>

                          <div
                            v-else
                            class="align-self-start mr-4"
                          >
                            {{ $t('report.recognition.confirm.unknownStage') }}
                          </div>
                        </v-card-title>

                        <v-divider />

                        <v-card-text
                          class="pt-2 transition-all"
                          :class="{
                            'reco-result__wrapper--invalid': resultHasErrorOrWarning[index],
                            'reco-result__wrapper--invalid-no-results': !result.result.drops.length
                          }"
                        >
                          <div class="reco-result__details">
                            <div
                              v-for="item in result.result.drops"
                              :key="item.itemId"
                              class="d-inline-flex align-center justify-center flex-column pa-2 mt-2 mr-2 border-outlined"
                              style="border-radius: 4px"
                            >
                              <div>
                                {{ dropTypeToString(item.dropType) }}
                              </div>

                              <v-badge
                                bottom
                                overlap
                                bordered
                                label
                                color="indigo"
                                :offset-x="24"
                                :offset-y="20"
                                :content="`×${item.quantity}`"
                              >
                                <Item
                                  :item="getItem(item.itemId)"
                                  disable-overview-card
                                />
                              </v-badge>
                            </div>
                          </div>
                          <v-alert
                            v-if="resultHasErrorOrWarning[index]"
                            outlined
                            color="text"
                            border="left"
                            class="my-4 reco-result__alert"
                            type="error"
                          >
                            <div>
                              <div>{{ $t('report.recognition.confirm.abnormal.' + (result.result.stageId ? 'error' : 'fatal')) }}</div>

                              <div
                                v-if="result.result.drops.length"
                                class="d-inline-flex caption chip-label"
                              >
                                <v-icon
                                  left
                                  small
                                >
                                  mdi-cursor-default-click
                                </v-icon>
                                {{ $t('report.recognition.confirm.abnormal.hover') }}
                              </div>
                            </div>

                            <RecognizeResultAlertCard
                              :alerts="result.result.errors"
                              color="red darken-3"
                              icon="mdi-alert-decagram"
                            />
                            <RecognizeResultAlertCard
                              :alerts="result.result.warnings"
                              color="warning darken-2"
                              icon="mdi-alert-circle"
                            />
                          </v-alert>
                        </v-card-text>

                        <v-spacer />

                        <v-divider />

                        <v-card-actions class="pa-2">
                          <v-card
                            v-ripple="!resultHasErrorOrWarning[index]"
                            dark
                            class="background-transparent font-weight-bold elevation-2 pa-2"
                            :class="`${resultHasErrorOrWarning[index] ? 'transparent elevation-0' : (selectedResultsIndex.includes(index) ? 'success darken-2' : 'warning darken-3')}`"
                            style="width: 100%"
                          >
                            <v-checkbox
                              v-model="selectedResultsIndex"
                              hide-details
                              color="white"
                              :value="index"
                              class="pt-0 mt-0 white--text"
                              :disabled="resultHasErrorOrWarning[index]"
                              :off-icon="resultHasErrorOrWarning[index] ? 'mdi-close-box' : '$checkboxOff'"
                              :label="
                                resultHasErrorOrWarning[index] ?
                                  $t('report.recognition.confirm.cherryPick.disabled') :
                                  (selectedResultsIndex.includes(index) ?
                                    $t('report.recognition.confirm.cherryPick.accepted') :
                                    $t('report.recognition.confirm.cherryPick.rejected')
                                  )
                              "
                            />
                          </v-card>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-alert
                    v-else
                    color="secondary"
                    prominent
                    border="left"
                    class="mt-0"
                    icon="mdi-numeric-0-box-multiple-outline"
                  >
                    {{ $t('report.recognition.confirm.noResult') }}
                  </v-alert>
                </v-card>
                <div class="my-2">
                  <v-btn
                    large
                    rounded
                    color="primary"
                    class="px-6"
                    :block="$vuetify.breakpoint.xs"
                    :disabled="!selectedResults.length"
                    @click="step = 4"
                  >
                    <v-icon left>
                      mdi-upload
                    </v-icon>
                    {{ $t("report.recognition.confirm.submit", {count: selectedResults.length}) }}
                  </v-btn>
                </div>
              </template>
            </v-stepper-content>

            <v-stepper-step step="4">
              {{ $t("report.recognition.step.report") }}
            </v-stepper-step>

            <v-stepper-content step="4">
              <template v-if="step === 4">
                <OffTitle
                  small
                  :content="$t('report.recognition.report.title')"
                />
                <v-data-table
                  :headers="reportTable.headers"
                  :items="reportTableData.results"
                  :options="reportTable.options.table"
                  :footer-props="reportTable.options.footer"

                  must-sort
                  sort-by="times"
                  :sort-desc="true"
                  :locale="$i18n.locale"
                  :hide-default-footer="reportTableData.results.length <= 20"

                  :mobile-breakpoint="0"

                  class="elevation-0 table--with-footer transparentTable container--fluid pt-4 position-relative border-outlined mb-8 overflow-hidden"
                >
                  <template #item="{ item }">
                    <tr>
                      <td :class="reportTable.cellClass">
                        {{ item.stage }}
                      </td>
                      <td :class="reportTable.cellClass">
                        {{ item.times }}
                      </td>
                      <td :class="reportTable.cellClass">
                        {{ item.apCost }}
                      </td>
                      <td
                        :class="reportTable.cellClass"
                        class="d-flex align-center"
                      >
                        <v-badge
                          v-for="[itemId, count] in Object.entries(item.items)"
                          :key="itemId"

                          bottom
                          overlap
                          bordered
                          label
                          color="secondary"
                          :offset-x="24"
                          :offset-y="20"
                          :content="count"
                        >
                          <Item
                            disable-overview-card
                            :ratio="0.65"
                            :item="getItem(itemId)"
                          />
                        </v-badge>
                      </td>
                    </tr>
                  </template>
                  <template #body.append>
                    <tr>
                      <td
                        :class="reportTable.cellClass"
                        class="grey--text"
                      >
                        {{ $t('report.recognition.report.total') }}
                      </td>
                      <td :class="reportTable.cellClass">
                        <v-icon small>
                          mdi-chess-rook
                        </v-icon>
                        × {{ reportTableData.total.times }}
                      </td>
                      <td :class="reportTable.cellClass">
                        <v-icon small>
                          mdi-brain
                        </v-icon>
                        × {{ reportTableData.total.apCost }}
                      </td>
                      <td :class="reportTable.cellClass">
                        <v-icon small>
                          mdi-treasure-chest
                        </v-icon>

                        × {{ reportTableData.total.items }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>

                <v-btn
                  rounded
                  x-large
                  color="primary"
                  :disabled="submitDialog.open"
                  @click="submit"
                >
                  <div class="d-inline-flex align-center justify-center">
                    <v-icon small>
                      mdi-server
                    </v-icon>
                    <span class="caption ml-1">
                      {{ $t("server.servers." + this.$store.getters["dataSource/server"]) }}
                    </span>
                  </div>
                  <v-divider
                    vertical
                    class="mx-2"
                  />
                  <span> {{ $t("report.recognition.submit") }} </span>
                </v-btn>
              </template>
            </v-stepper-content>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Item from '@/components/global/Item'
import Recognizer from '@/utils/recognizer'
import PreloaderInline from '@/components/global/PreloaderInline'
import snackbar from '@/utils/snackbar'
import CDN from '@/mixins/CDN'
import Theme from '@/mixins/Theme'
import ImageInput from '@/components/recognition/ImageInput'
import RecognitionResultOverview from '@/components/recognition/RecognitionResultOverview'
import config from '@/config'
import get from '@/utils/getters'
import Cookies from 'js-cookie'
import DynamicSizeBtn from "@/components/global/DynamicSizeBtn";
import OffTitle from "@/components/global/OffTitle";
import FactTable from "@/components/stats/fact-table/FactTable";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";
import {mapGetters} from "vuex";
import RecognizeResultAlertCard from "@/components/recognition/RecognizeResultAlertCard";
import RecognitionImageDialog from "@/components/recognition/RecognitionImageDialog";
import TitledRow from "@/components/global/TitledRow";
import ConfirmLeave from "@/mixins/ConfirmLeave";

let recognitionSubmitter;
try {
  recognitionSubmitter = require("../../utils/vendors/recognitionSubmitter");
} catch(e) {
  recognitionSubmitter = () => (Promise.reject())
}

export default {
  name: 'RecognitionReport',
  components: {
    TitledRow,
    RecognitionImageDialog,
    RecognizeResultAlertCard,
    FactTableItem,
    FactTable, OffTitle, DynamicSizeBtn, Item, ImageInput, RecognitionResultOverview, PreloaderInline },
  mixins: [Theme, CDN, ConfirmLeave],
  data () {
    return {
      step: 1,
      recognizer: null,
      files: [],
      results: [],
      selectedResultsIndex: [],
      expandImage: {
        src: ''
      },
      recognition: {
        state: 'pending',
        busy: false,
        server: '',
        durationPerImage: '#',
        current: '',
        timer: {
          started: -1,
          elapsed: -1,
          remaining: -1,
          imagePerSecond: -1,
          timer: null
        }
      },
      dialogOrigin: '',
      filterValue: ['SUCCESS', 'ERROR'],
      submitDialog: {
        open: false,
        finish: false,
        error: false
      },
      changeServerTip: 0,
      isFilesValid: true,
      reportTable: {
        headers: [
          {
            text: this.$t('stats.headers.stage'),
            value: 'stage',
            align: 'left',
            sortable: false,
            width: '80px',
          },
          {
            text: this.$t('stats.headers.times'),
            value: 'times',
            align: 'left',
            sortable: true,
            width: '100px'
          },
          {
            text: this.$t('stats.headers.apCost'),
            value: 'apCost',
            align: 'left',
            sortable: true,
            width: '100px'
          },
          {
            text: this.$t('stats.headers.itemDrops'),
            value: 'items',
            align: 'left',
            sortable: false,
            width: '300px'
          }
        ],
        options: {
          table: {
            itemsPerPage: 20
          },
          footer: {
            itemsPerPageOptions: [10, 20, 40, -1],
            showCurrentPage: true
          }
        },
        cellClass: 'font-weight-bold monospace',
      },
    }
  },
  computed: {
    filteredResults () {
      return this.filterResults(this.filterValue)
    },
    itemFilters () {
      return [
        {
          text: this.$t('report.recognition.status.success'),
          value: 'SUCCESS'
        },
        // {
        //   text: this.$t('report.recognition.status.warning'),
        //   value: 'WARNING'
        // },
        {
          text: this.$t('report.recognition.status.error'),
          value: 'ERROR'
        }
      ]
    },
    reportTableData () {
      console.time('reportTableData')
      const map = {}
      for (const recognitionResult of this.selectedResults) {
        const stage = get.stages.byStageId(recognitionResult.result.stageId)
        const stageCode = stage.code
        if (!map[stageCode]) {
          map[stageCode] = {
            items: {},
            apCost: 0,
            times: 0
          }
        }
        for (const item of recognitionResult.result.drops) {
          if (item.itemId && item.quantity) {
            if (!map[stageCode].items[item.itemId]) map[stageCode].items[item.itemId] = 0
            map[stageCode].items[item.itemId] += item.quantity
          }
        }
        map[stageCode].times++
        map[stageCode].apCost = stage.apCost * map[stageCode].times
      }

      const results = []
      for (const [stage, val] of Object.entries(map)) results.push({ stage, ...val })
      console.timeEnd('reportTableData')
      return {
        results,
        total: {
          times: results.reduce((prev, curr) => prev + curr.times, 0),
          apCost: results.reduce((prev, curr) => prev + curr.apCost, 0),
          items: results.reduce((prev, curr) => prev + Object.values(curr.items).reduce((a, b) => a + b), 0),
        }
      }
    },
    server () {
      return this.$store.getters['dataSource/server']
    },
    selectedResults () {
      return this.results.filter((result, index) => {
        return this.selectedResultsIndex.includes(index)
      })
    },
    resultHasErrorOrWarning () {
      return this.results.map((result) => {
        return !!(result.result.errors.length || result.result.warnings.length)
      })
    }
  },
  watch: {
    step: {
      immediate: true,
      handler (val) {
        if (val >= 2) {
          this.confirmLeaveActive = true
          this.$store.commit('ui/lockServer')
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.stopTimer()
    this.$store.commit('ui/unlockServer')
  },
  methods: {
    ...mapGetters('ui', ['serverLocked']),
    startTimer () {
      if (this.recognition.timer.timer !== null) return
      this.recognition.timer.started = Date.now()
      this.recognition.timer.timer = setInterval(() => {
        requestAnimationFrame(() => this.updateTimer())
      }, 1000)
      this.updateTimer()
    },
    updateTimer () {
      const finished = this.results.length || 0
      const total = this.files.length || 1
      const elapsed = (Date.now() - this.recognition.timer.started) / 1000
      const imagePerSecond = finished / elapsed
      this.recognition.timer.elapsed = Math.floor(elapsed)
      this.recognition.timer.imagePerSecond = imagePerSecond
      this.recognition.timer.remaining = Math.ceil((total - finished) / (imagePerSecond || 1))
    },
    stopTimer () {
      if (this.recognition.timer.timer) clearInterval(this.recognition.timer.timer)
      this.recognition.timer.remaining = 0
    },
    async doSubmit () {
      const userId = Cookies.get(config.authorization.userId.cookieKey)
      recognitionSubmitter(this).then(() => {
        const reportedUserId = Cookies.get(config.authorization.userId.cookieKey)
        if (userId !== reportedUserId) {
          this.$store.dispatch('auth/login', {
            userId: reportedUserId
          })
        }
        this.$ga.event('report', 'submit_recognition', this.selectedResults.map((result) => { return result.stageId }), 1)
      }).finally(() => {
        this.submitDialog.finish = true
        this.submitDialog.error = false
      }).catch((e) => {
        console.log(e)
        snackbar.networkError()
        this.submitDialog.error = true
      })
    },
    submit () {
      this.submitDialog.open = true
      this.recognition.state = 'uploading'
      this.doSubmit()
    },
    async init () {
      this.recognition.state = 'initializing'
      this.recognizer = new Recognizer()

      await this.recognizer
        .initialize(this.server)
        .then(() => {
          this.recognition.state = 'initialized'
          this.recognition.server = this.server
          // console.log('initialization completed')
        })
        .finally(() => {
          this.recognition.state = 'pending'
        })
    },
    getItem (itemId) {
      return get.items.byItemId(itemId, false, false) || {}
    },
    async recognize () {
      this.results = []

      const typeOrder = ['NORMAL_DROP', 'SPECIAL_DROP', 'EXTRA_DROP']
      typeOrder.reverse()

      this.startTimer()

      this.files.sort((a, b) => a.lastModified - b.lastModified)

      await this.recognizer.recognize(this.files, result => {
        this.recognition.current = result.file.name
        result.result.drops
          .forEach(el => {
            el.quantity = parseInt(el.quantity)
            if (!el.itemId) el.itemId = `unrecognized_${Math.random()}`
          })
        result.result.drops
          .sort((a, b) => {
            return -typeOrder.indexOf(a.dropType) - -typeOrder.indexOf(b.dropType)
          })
        this.results.push(result)
      })

      this.stopTimer()
    },
    dropTypeToString (type) {
      return this.$t(`stage.loots.${type}`) || type
    },
    getStage (stageId) {
      return get.stages.byStageId(stageId) || { code: '(internal error)' }
    },
    async initAndRecognize () {
      this.step = 2
      if (this.recognition.state !== 'initialized') await this.init()
      this.recognition.state = 'recognizing'
      await this.recognize()
      this.applyPostRecognitionRules(this.results)
      const selectedResultsIndex = []
      this.results.forEach((result, index) => {
        if (!(result.result.warnings.length || result.result.errors.length)) selectedResultsIndex.push(index)
      })
      this.selectedResultsIndex = selectedResultsIndex
      this.recognition.durationPerImage = (this.results.reduce((prev, curr) => {
        return prev + (curr.duration || 0)
      }, 0) / this.results.length).toFixed(2)
      this.recognition.state = 'rendering'
      setTimeout(() => {
        this.$nextTick(() => {
          this.step = 3
        })
      }, 0)
    },
    filterResults (filter) {
      return this.results.filter(result => {
        for (let key of filter) {
          switch (key) {
            case 'SUCCESS':
              if (!(result.result.warnings.length || result.result.errors.length)) return true
              break
            // case 'WARNING':
            //   if (result.result.warnings.length) return true
            //   break
            case 'ERROR':
              if (result.result.warnings.length || result.result.errors.length) return true
              break
            default:
              return false
          }
        }
        return false
      })
    },
    applyPostRecognitionRules (results) {
      const timestamps = results
          .map(value => {
            return value.file.lastModified
          })

      const fingerprints = results
          .map(value => {
            return value.result.fingerprint
          })

      results.forEach((value, index) => {
        // Apply timestamp check, <10s will add warning
        let closeTimestamps = false;
        timestamps.forEach((timestamp, i) => {
          if (Math.abs(timestamp - value.file.lastModified) < 10 * 1000 && i !== index) {
            closeTimestamps = true
          }
        })
        if (closeTimestamps) {
          value.result.warnings.push({ type: 'FileTimestamp::TooClose' })
        }
        // Apply same fingerprint check, same will add warning
        let sameFingerprint = false;
        fingerprints.forEach((fingerprint, i) => {
          if (fingerprint !== "" && fingerprint !== undefined && fingerprint === value.result.fingerprint && i !== index) {
            sameFingerprint = true
          }
        })
        if (sameFingerprint) {
          value.result.errors.push({ type: 'Fingerprint::Same' })
        }
      })
      return Object.freeze(results)
    }
  }
}
</script>

<style scoped lang="scss">
  .cursor-pointer .v-file-input__text,
  .v-overlay__scrim {
    cursor: pointer !important;
  }
  .quick-transition {
    transition-duration: 20ms !important;
  }

  .reco-result {
    &__wrapper--invalid:not(.reco-result__wrapper--invalid-no-results) {
      position: relative;
      transform-origin: top center;
      $easing: cubic-bezier(0, 0.55, 0.45, 1);

      & .reco-result__details {
        transition: all .225s $easing;
        max-height: 108px;
        opacity: 0.7;
        transform: scale(0.94);
        filter: brightness(0.8) contrast(0.6);
      }
      & .reco-result__alert {
        transition: all .225s $easing;
        margin-top: -68px !important;
        background: rgba(128, 34, 25, .85) !important;
        .theme--light & {
          background: rgba(230, 103, 92, .85) !important;
        }
      }

      &:hover {
        & .reco-result__details {
          max-height: 600px;
          opacity: 1;
          transform: scale(1);
          filter: brightness(1);
        }
        & .reco-result__alert {
          pointer-events: none;
          margin-top: -68px !important;
          filter: blur(5px);
          opacity: 0.12;
          background: rgba(128, 34, 25, .2) !important;
          transform: scale(1.047);
        }
      }
    }
  }

  .backdrop-icon {
    position: absolute;
    bottom: .5rem;
    right: .75rem;
    user-select: none;
    z-index: 0;
    opacity: 0.05;
  }

  .dense-stepper {
    & .v-stepper__content {
      border-left: none !important;
      margin-left: 0 !important;
    }

    & .v-stepper__step--complete {
      //filter: saturate(0.25);
      opacity: 0.3;

      & + div {
        display: none !important;
      }
    }

    & .v-stepper__step--inactive {
      opacity: 0.3;

      & + div {
        display: none !important;
      }
    }
  }

  .img-side-tag {
    padding: 3px 9px 2px 8px;
    border-radius: 0 0 0 8px;
    border-right-width: 0 !important;
    border-top-width: 0 !important;
  }
</style>
