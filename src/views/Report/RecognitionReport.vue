<!--suppress NestedConditionalExpressionJS -->
<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-dialog
      v-model="expandImage.dialog"
      :origin="dialogOrigin"
      max-width="1800px"
      max-height="80vh"
      :overlay-opacity="0.8"
      overlay-color="rgba(0, 0, 0, 1)"
    >
      <v-card
        v-ripple="false"
        style="cursor: zoom-out"
        @click="expandImage.dialog = false"
      >
        <img
          :src="expandImage.src"
          alt="enlarged"
          class="mx-auto d-block"
          style="max-width: 100%; max-height: 80vh"
        >
        <v-card-subtitle class="text-center mt-4">
          {{ $t("report.recognition.tips.copyImage") }}
        </v-card-subtitle>
      </v-card>
    </v-dialog>
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
          <v-card
            v-if="!submitDialog.finish"
            class="d-flex fill-height"
          >
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
          <v-card
            v-else
            class="d-flex fill-height"
          >
            <v-card-text>
              <v-alert
                v-if="submitDialog.error"
                type="error"
                class="mt-4"
              >
                Error
              </v-alert>
              <v-alert
                v-else
                type="success"
                class="mt-4"
              >
                Finish
              </v-alert>
              <v-card-actions class="elevation-4">
                <v-btn
                  text
                  block
                  large
                  @click="reload"
                >
                  <v-divider style="opacity: 0.3" />
                  <span class="mx-4 d-flex align-center">
                    <v-icon left>mdi-close</v-icon>{{ $t("report.recognition.reload") }}
                  </span>
                  <v-divider style="opacity: 0.3" />
                </v-btn>
              </v-card-actions>
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
                  <div class="d-flex flex-row justify-center align-center mx-auto">
                    <PreloaderInline :size="120" />
                    <div class="d-flex flex-column py-4 ml-4">
                      <h2 class="headline">
                        {{ $t('report.recognition.states.' + recognition.state) }}
                      </h2>

                      <span
                        class="monospace-pure my-2"
                        style="word-break: keep-all; text-overflow: ellipsis; line-height: 20px; height: 20px; max-width: 50vw; white-space: nowrap"
                      >
                        {{ recognition.state === 'rendering' ? $t('report.recognition.states.rendering') : (recognition.current || '暂无文件名') }}
                      </span>

                      <FactTable>
                        <FactTableItem
                          title="识别进度"
                          content-class="monospace"
                          :content="results.length + ' / ' + files.length"
                        />
                        <FactTableItem
                          title="已用时间"
                          :content="recognition.timer.elapsed + 's'"
                          content-class="monospace"
                        />
                        <FactTableItem
                          title="预计剩余"
                          :content="recognition.timer.remaining + 's'"
                          content-class="monospace"
                        />
                        <FactTableItem
                          title="平均速度"
                          :content="(recognition.timer.imagePerSecond || 0).toFixed(1) + '图/秒'"
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

            <v-stepper-content
              step="3"
              :class="{'pt-0': step === 3}"
            >
              <div v-if="step === 3">
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
                    :error="filterResults(['WARNING', 'ERROR']).length"
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
                  {{ $t('report.recognition.tips.abnormal', {count: filterResults(['WARNING', 'ERROR']).length}) }}
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
                  <v-select
                    v-model="filterValue"
                    :items="itemFilters"
                    item-text="text"
                    item-value="value"
                    attach
                    chips
                    label="Filter"
                    multiple
                    prepend-icon="mdi-filter-variant"
                  />

                  <v-row
                    v-if="results.length"
                  >
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
                            @click="enlargeImage(result.blobUrl)"
                          >
                            <template #placeholder>
                              <div class="d-flex align-center justify-center fill-height caption">
                                {{ $t('meta.loading') }}
                              </div>
                            </template>
                          </v-img>
                        </div>
                        <v-divider />

                        <v-card-title class="d-flex flex-column align-center justify-center">
                          <!--                        <div class="d-flex align-baseline">-->
                          <!--                          <small class="mr-2">{{ $t("stage.name") }}</small>-->

                          <!--                        </div>-->

                          <FactTable
                            v-if="result.result.stageId"
                            style="width: 100%"
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
                          </FactTable>

                          <div
                            v-else
                            class="align-self-start"
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
                              class="d-inline-flex align-center justify-center flex-column pa-2 mt-2 mr-2"
                              style="border-radius: 4px"
                              :style="{
                                border: `1px solid ${dark ? 'rgba(255, 255, 255, .4)' : '#000'}`
                              }"
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
                            class="background-transparent elevation-4 pa-2"
                            :class="`${resultHasErrorOrWarning[index] ? 'transparent elevation-0' : (selectedResultsIndex.includes(index) ? 'success darken-2' : 'warning darken-4')}`"
                            style="width: 100%"
                          >
                            <v-checkbox
                              v-model="selectedResultsIndex"
                              color="text"
                              hide-details
                              :value="index"
                              class="pt-0 mt-0"
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
                <div class="mt-4">
                  <v-btn
                    color="primary"
                    class="mr-2"
                    :disabled="!selectedResults.length"
                    @click="step = 4"
                  >
                    {{ $t("report.recognition.confirm.submit", {count: selectedResults.length}) }}
                    <v-icon
                      right
                      dark
                    >
                      mdi-upload
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </v-stepper-content>

            <v-stepper-step step="4">
              {{ $t("report.recognition.step.report") }}
            </v-stepper-step>

            <v-stepper-content step="4">
              <v-row
                align="center"
                justify="center"
                no-gutters
                class="my-2"
              >
                <v-col
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                  xl="4"
                >
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-chess-rook</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="monospace">
                        {{ allTime }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t("report.recognition.allResult.stageTime") }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                  xl="4"
                >
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-treasure-chest</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="monospace">
                        {{ allDropsCount }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t("report.recognition.allResult.drops") }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                  xl="4"
                >
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-brain</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="monospace">
                        {{ allSanity }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t("report.recognition.allResult.sanity") }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="([stageCode, stage], index) in Object.entries(stageCombineData)"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div
                        class="title d-flex justify-center"
                        style="margin-top: -4px"
                      >
                        <span
                          v-ripple
                          class="font-weight-bold headline d-flex align-center card-item-title__clickable"
                          style="border-radius: 4px"
                        >
                          {{ stageCode }}
                        </span>
                        <v-spacer />
                        <small>#{{ index + 1 }}</small>
                      </div>
                      <div class="display-1 text-center monospace font-weight-bold my-2">
                        {{ stage.Time }}
                        <small class="title">{{ $t("planner.calculation.times") }}</small>
                      </div>
                      <div class="d-flex flex-wrap justify-start">
                        <div
                          v-for="([itemId, count], itemIndex) in Object.entries(stage.items)"
                          :key="itemIndex"
                          class="d-inline-flex mx-2 my-1"
                        >
                          <v-badge
                            bottom
                            overlap
                            bordered
                            label
                            color="indigo"
                            :offset-x="24"
                            :offset-y="20"
                            :content="`×${count}`"
                          >
                            <Item :item="getItem(itemId)" />
                          </v-badge>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    rounded
                    block
                    color="success"
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
                </v-col>
              </v-row>
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
import report from '@/apis/report'
import DynamicSizeBtn from "@/components/global/DynamicSizeBtn";
import OffTitle from "@/components/global/OffTitle";
import FactTable from "@/components/stats/fact-table/FactTable";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";
import {mapGetters} from "vuex";
import RecognizeResultAlertCard from "@/components/recognition/RecognizeResultAlertCard";

export default {
  name: 'RecognitionReport',
  components: {
    RecognizeResultAlertCard,
    FactTableItem,
    FactTable, OffTitle, DynamicSizeBtn, Item, ImageInput, RecognitionResultOverview, PreloaderInline },
  mixins: [Theme, CDN],
  data () {
    return {
      recognizer: null,
      files: [],
      results: [],
      expandImage: {
        dialog: false,
        src: ''
      },
      recognition: {
        state: 'PENDING',
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
      step: 1,
      filterValue: ['SUCCESS', 'WARNING', 'ERROR'],
      submitDialog: {
        open: false,
        finish: false,
        error: false
      },
      changeServerTip: 0,
      isFilesValid: true,
      selectedResultsIndex: []
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
        {
          text: this.$t('report.recognition.status.warning'),
          value: 'WARNING'
        },
        {
          text: this.$t('report.recognition.status.error'),
          value: 'ERROR'
        }
      ]
    },
    allTime () {
      return this.selectedResults.length
    },
    allDropsCount () {
      return this.selectedResults.reduce((prev, now) => {
        return (
          prev +
            now.result.drops.reduce((p, n) => {
              if (n.quantity) {
                return p + n.quantity
              }
              return p
            }, 0)
        )
      }, 0)
    },
    allSanity () {
      return this.selectedResults.reduce((prev, now) => {
        return prev + get.stages.byStageId(now.result.stageId).apCost
      }, 0)
    },
    stageCombineData () {
      const results = this.selectedResults
      const result = {}
      for (const recognitionResult of results) {
        const stageCode = get.stages.byStageId(recognitionResult.result.stageId).code
        if (!result[stageCode]) {
          result[stageCode] = {
            items: {},
            time: 0
          }
        }
        result[stageCode].time++
        for (const item of recognitionResult.result.drops) {
          if (item.itemId && item.quantity) {
            if (!result[stageCode].items[item.itemId]) {
              result[stageCode].items[item.itemId] = 0
            }
            result[stageCode].items[item.itemId] += item.quantity
          }
        }
      }
      return result
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
      const batchDrops = await this.formatResults(this.selectedResults);
      const userId = Cookies.get(config.authorization.userId.cookieKey)
      return report.submitRecognitionReport(batchDrops, { source: 'frontend-v2-recognition' }).then(() => {
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
      this.doSubmit()
    },
    async init () {
      this.recognition.state = 'initializing'
      this.recognizer = new Recognizer()

      await this.recognizer
        .initialize(this.server)
        .then(() => {
          this.$store.commit('ui/lockServer')
          this.recognition.state = 'initialized'
          this.recognition.server = this.server
          console.log('initialization completed')
        })
        .finally(() => {
          this.recognition.state = 'pending'
        })
    },
    getItem (ItemId) {
      return get.items.byItemId(ItemId, false, false) || {}
    },
    async recognize () {
      this.results = []
      this.recognition.busy = true

      const typeOrder = ['NORMAL_DROP', 'SPECIAL_DROP', 'EXTRA_DROP']
      typeOrder.reverse()

      this.startTimer()

      await this.recognizer.recognize(this.files, result => {
        this.recognition.current = result.file.name
        result.result.drops
          .map(el => {
            el.confidence = parseFloat(el.confidence)
            el.quantity = parseFloat(el.quantity)
          })
          .sort((a, b) => {
            return -typeOrder.indexOf(a.dropType) - -typeOrder.indexOf(b.dropType)
          })
        this.results.push(Object.freeze(result))
      })

      this.recognition.busy = false

      this.stopTimer()
    },
    dropTypeToString (type) {
      return this.$t(`stage.loots.${type}`) || type
    },
    enlargeImage (url) {
      this.expandImage.dialog = true
      this.expandImage.src = url
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
      this.results.map((result, index) => {
        if (!(result.result.warnings.length || result.result.errors.length)) selectedResultsIndex.push(index)
      })
      this.selectedResultsIndex = selectedResultsIndex
      this.recognition.durationPerImage = (this.results.reduce((prev, curr) => {
        return prev + (curr.duration || 0)
      }, 0) / this.results.length).toFixed(2)
      this.recognition.state = 'rendering'
      console.log(this.recognition.state)
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
              if (!(result.result.warnings.length || result.result.errors.length)) {
                return true
              }
              break
            case 'WARNING':
              if (result.result.warnings.length) {
                return true
              }
              break
            case 'ERROR':
              if (result.result.errors.length) {
                return true
              }
              break
            default:
              return false
          }
        }
        return false
      })
    },
    async loadImage (src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          resolve(img)
        }
        img.onerror = (e) => {
          reject(e)
        }
        img.src = src
      })
    },
    async formatResults (results) {
      const formatted = []
      const images = []
      for (const [index, result] of results.entries()) {
        images[index] = this.loadImage(result.blobUrl)
      }
      await Promise.all(images)
      for (const [index, result] of results.entries()) {
        formatted.push({
          drops: result.result.drops.map(drop => {
            delete drop.confidence
            return drop
          }),
          stageId: result.result.stageId,
          metadata: {
            fingerprint: result.result.fingerprint,
            md5: result.result.md5,
            fileName: result.file.name,
            lastModified: result.file.lastModified,
            // not providing due to backend
            // size: result.file.size,
            // type: result.file.type,
            // webkitRelativePath: result.file.webkitRelativePath,
            width: await (images[index]).width,
            height: await (images[index]).height
          }
        })
      }
      return formatted
    },
    // askCrispForHelp () {
    //   const $crisp = window.$crisp
    //   document.querySelector('div.crisp-client').style.setProperty('display', 'block', 'important')
    //   $crisp.push(['do', 'chat:open'])
    //   $crisp.push(['do', 'message:send', ['text', '掉落识别有问题，我该怎么办？']])
    // },
    applyPostRecognitionRules (results) {
      const timestamps = results.map(value => {
        return value.file.lastModified
      })
      const fingerprints = results.map(value => {
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
          if (fingerprint === value.result.fingerprint && i !== index) {
            sameFingerprint = true
          }
        })
        if (sameFingerprint) {
          value.result.errors.push({ type: 'Fingerprint::Same' })
        }
      })
      return results
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

      & .reco-result__details {
        transition: all .225s cubic-bezier(0.33, 1, 0.68, 1);
        max-height: 108px;
        opacity: 0.7;
        transform: scale(0.94);
        filter: brightness(0.8) contrast(0.6);
      }
      & .reco-result__alert {
        transition: all .225s cubic-bezier(0.33, 1, 0.68, 1);
        margin-top: -72px !important;
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
          margin-top: -72px !important;
          filter: blur(3px);
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
</style>
