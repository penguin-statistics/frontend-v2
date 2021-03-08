<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col cols="12">
        <v-dialog
          v-model="expandImage.dialog"
          :origin="dialogOrigin"
          max-width="1800px"
          scrollable
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
            >
            <v-card-subtitle class="text-center mt-4">
              {{ $t("report.recognition.tips.copyImage") }}
            </v-card-subtitle>
            <!--          <v-card-actions>-->
            <!--            <v-btn large block text @click="expandImage.dialog = false">-->
            <!--              关闭-->
            <!--            </v-btn>-->
            <!--          </v-card-actions>-->
          </v-card>
        </v-dialog>
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
                    {{ $t("report.recognition.submiting") }}
                  </h1>
                  <v-row>
                    <v-col>
                      <v-progress-linear
                        :indeterminate="true"
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
            class="px-6 secondary"
            :class="{'lighten-5': !dark}"
          >
            {{ $t('menu.report.recognition') }}
          </v-card-title>
          <v-card-subtitle
            class="px-6 secondary"
            :class="{'lighten-5': !dark}"
          >
            仅需选择结算页面截图即可上传所有掉率，不再需要一次次手动选择。
          </v-card-subtitle>
          <v-stepper
            v-model="step"
            class="bkop-light pt-2 transparent elevation-0"
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
                class="mx-2"
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
              
              <v-form class="ml-6">
                <ImageInput
                  v-model="files"
                  @valid="valid => isFilesValid = valid"
                />
              </v-form>

              <DynamicSizeBtn
                :loading="step > 1"
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
              <PreloaderInline class="mx-auto mb-6" />
              <h3 class="grey--text my-2">
                {{ $t("report.recognition.progress") }}
              </h3>
              <v-progress-linear
                v-if="initializing"
                indeterminate
                class="quick-transition"
                stream
                height="28"
                striped
                rounded
              >
                {{ $t("report.recognition.initializing") }}
              </v-progress-linear>
              <v-progress-linear
                v-else
                class="quick-transition"
                :value="(results.length / files.length) * 100"
                :buffer-value="((results.length + 1) / files.length) * 100"
                stream
                height="28"
                striped
              >
                {{ results.length }} / {{ files.length }} ({{
                  ((results.length / (files.length === 0 ? 1 : files.length)) * 100).toFixed(0)
                }}%)
              </v-progress-linear>
            </v-stepper-content>

            <v-stepper-step
              :complete="step > 3"
              step="3"
            >
              {{ $t("report.recognition.step.confirm") }}
            </v-stepper-step>

            <v-stepper-content
              step="3"
              class="pt-0"
            >
              <OffTitle
                content="结果概览"
                small
              />

              <v-card
                outlined
                class="pa-6 pt-7 background-transparent"
              >
                <RecognitionResultOverview
                  :success="filterResults(['SUCCESS']).length"
                  :warning="filterResults(['WARNING']).length"
                  :error="filterResults(['ERROR']).length"
                  :total="results.length"
                />
              </v-card>

              <v-alert
                v-if="filterResults(['SUCCESS']).length !== results.length"
                color="warning"
                prominent
                border="left"
                class="mt-0"
                :icon="
                  filterResults(['WARNING', 'ERROR']).length <= 10
                    ? `mdi-numeric-${filterResults(['WARNING', 'ERROR']).length}-box-multiple-outline`
                    : 'mdi-content-copy'
                "
              >
                识别结果中存在警报或错误，暂时无法上报这些图片，共计
                {{ filterResults(['WARNING', 'ERROR']).length }} 张
                <!--                <br>-->
                <!--                <v-btn-->
                <!--                  color="primary"-->
                <!--                  @click="askCrispForHelp()"-->
                <!--                >-->
                <!--                  与客服联系-->
                <!--                  <v-icon right>-->
                <!--                    mdi-chat-->
                <!--                  </v-icon>-->
                <!--                </v-btn>-->
                <!--                以帮助我们解决你所遇到的问题-->
              </v-alert>
              
              <OffTitle
                content="结果详情"
                small
              />
              
              <v-card
                outlined
                class="position-relative pt-6 px-4 background-transparent"
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

                <v-row v-if="results.length">
                  <v-col
                    v-for="(result, index) in results"
                    :key="index"
                    :class="[filteredResults.includes(result) ? 'd-flex' : 'd-none', 'align-self-stretch']"
                    cols="12"
                    md="6"
                    lg="6"
                    xl="4"
                  >
                    <v-card
                      outlined
                      :color="
                        result.result.errors.length
                          ? 'rgba(241,97,87,0.5)'
                          : result.result.warnings.length
                            ? 'warning'
                            : ''"
                      style="width: 100%"
                    >
                      <v-img
                        v-ripple
                        :src="result.blobUrl"
                        contain
                        style="cursor: zoom-in"
                        @click="e => enlargeImage(result.blobUrl, e)"
                      />
                      <v-card-title class="d-flex flex-row align-center">
                        <div class="d-flex align-baseline">
                          <small class="mr-2">{{ $t("stage.name") }}</small>
                          <span class="monospace">{{ result.result.stageId ? getStage(result.result.stageId).code : "无法识别" }}</span>
                        </div>
                        <v-spacer />
                        <v-checkbox
                          v-model="selectedResultsIndex"
                          :value="index"
                          :disabled="resultHasErrorOrWarning[index]"
                          :off-icon="resultHasErrorOrWarning[index] ? 'mdi-close-box' : '$checkboxOff'"
                          :label="resultHasErrorOrWarning[index] ? '无法选择有问题的图片' : '是否上传'"
                        />
                      </v-card-title>
                      <v-card-subtitle class="d-flex flex-row align-center">
                        <div class="d-flex align-baseline">
                          {{ $t("report.recognition.filename") }}：<span class="font-weight-bold">{{
                            result.file.name || "(文件名未知)"
                          }}</span>
                        </div>
                        <v-spacer />
                        <v-chip
                          label
                          rounded
                          small
                        >
                          {{ $t("report.recognition.cost") }}
                          {{ result.duration.toFixed(2) }}ms
                        </v-chip>
                      </v-card-subtitle>
                      <v-card-text>
                        <div
                          v-for="item in result.result.drops"
                          :key="item.itemId"
                          class="d-inline-flex align-center justify-center flex-column pa-2 mr-2"
                          style="border-radius: 4px"
                          :style="{
                            border: `1px solid ${dark ? '#fff' : '#000'}`
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
                            <Item :item="getItem(item.itemId)" />
                          </v-badge>
                        </div>
                        <v-alert
                          v-if="resultHasErrorOrWarning[index]"
                          outlined
                          color="white"
                          border="left"
                          icon="mdi-alert-circle"
                          class="my-4"
                        >
                          识别时有错误发生，无法为您上报该图片
                          <br>
                          <template v-if="result.result.errors.length">
                            <v-chip
                              v-for="(error, index) in result.result.errors"
                              :key="`error-${index}`"
                              class="ma-2"
                              color="red darken-3"
                              text-color="white"
                            >
                              <v-icon left>
                                mdi-bug
                              </v-icon>
                              {{ error.type }}
                            </v-chip>
                            <br>
                          </template>
                          <template v-if="result.result.warnings.length">
                            <v-chip
                              v-for="(warning, index) in result.result.warnings"
                              :key="`warning-${index}`"
                              class="ma-2"
                              color="yellow darken-3"
                              text-color="white"
                            >
                              <v-icon left>
                                mdi-alert
                              </v-icon>
                              {{ warning.type }}
                            </v-chip>
                            <br>
                          </template>
                        </v-alert>
                      </v-card-text>
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
                  暂时没有识别结果
                </v-alert>
              </v-card>
              <div class="mt-4">
                <v-btn
                  color="primary"
                  class="mr-2"
                  :disabled="!selectedResults.length"
                  @click="step = 4"
                >
                  {{ $t("report.recognition.confirm", [selectedResults.length]) }}
                  <v-icon
                    right
                    dark
                  >
                    mdi-upload
                  </v-icon>
                </v-btn>
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
                        {{ $t("report.recognition.allresult.stagetime") }}
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
                        {{ $t("report.recognition.allresult.drops") }}
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
                        {{ $t("report.recognition.allresult.sanity") }}
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

export default {
  name: 'RecognitionReport',
  components: {OffTitle, DynamicSizeBtn, Item, ImageInput, RecognitionResultOverview, PreloaderInline },
  mixins: [Theme, CDN],
  data () {
    return {
      recognizer: null,
      files: [],
      results: [],
      initializing: false,
      initialized: false,
      expandImage: {
        dialog: false,
        src: ''
      },
      recognition: {
        busy: false,
        server: ''
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
    serverLocked () {
      return this.$store.getters['dataSource/serverLocked']
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
    serverLocked (value) {
      if (value === 2) {
        this.$store.commit('dataSource/lockServer')
        this.changeServerTip = true
      }
    }
  },
  mounted () {
    this.$store.commit('dataSource/unlockServer')
  },
  destroyed () {
    this.$store.commit('dataSource/unlockServer')
  },
  methods: {
    reload () {
      // keep wasm initialzation state
      const newData = {
        ...this.$data,
        files: [],
        results: [],
        expandImage: {
          dialog: false,
          src: ''
        },
        recognition: {
          busy: false,
          server: ''
        },
        dialogOrigin: '',
        lots: false,
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
      Object.assign(this.$data, newData)
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
      this.initializing = true

      this.recognizer = new Recognizer()

      await this.recognizer
        .initialize(this.server)
        .then(() => {
          this.$store.commit('dataSource/lockServer')
          this.initialized = true
          this.recognition.server = this.server
          console.log('initialization completed')
        })
        .finally(() => {
          this.initializing = false
        })
    },
    getItem (ItemId) {
      return get.items.byItemId(ItemId, false, false) || {}
    },
    stringify (s) {
      return JSON.stringify(s, null, 4)
    },
    async recognize () {
      this.results = []
      this.recognition.busy = true

      const typeOrder = ['NORMAL_DROP', 'SPECIAL_DROP', 'EXTRA_DROP']
      typeOrder.reverse()

      await this.recognizer.recognize(this.files, result => {
        result.result.drops
          .map(el => {
            el.confidence = parseFloat(el.confidence)
            el.quantity = parseFloat(el.quantity)
          })
          .sort((a, b) => {
            return -typeOrder.indexOf(a.dropType) - -typeOrder.indexOf(b.dropType)
          })
        this.results.push(result)
      })

      console.log(this.results)

      this.recognition.busy = false
    },
    dropTypeToString (type) {
      return this.$t(`stage.loots.${type}`, false) || type
    },
    enlargeImage (url, event) {
      console.log(event)
      this.dialogOrigin = `${event.clientX}px ${event.clientY}px`
      this.$nextTick(() => {
        this.expandImage.dialog = true
        this.expandImage.src = url
      })
    },
    getStage (stageId) {
      return get.stages.byStageId(stageId) || { code: '(识别失败)' }
    },
    async initAndRecognize () {
      this.step = 2
      if (!this.initialized) {
        await this.init()
      }
      await this.recognize()
      const selectedResultsIndex = [];
      this.results.map((result, index) => {
        if (!(result.result.warnings.length || result.result.errors.length)) selectedResultsIndex.push(index)
      })
      this.selectedResultsIndex = selectedResultsIndex
      this.applyPostRecognitionRules()
      this.step = 3
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
        const ImgElement = new Image()
        ImgElement.onload = () => {
          resolve(ImgElement)
        }
        ImgElement.onerror = (e) => {
          reject(e)
        }
        ImgElement.src = src
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
    applyPostRecognitionRules () {
      const timestamps = this.results.map(value => {
        return value.file.lastModified
      })
      const fingerprints = this.results.map(value => {
        return value.result.fingerprint
      })
      this.results.forEach((value, index) => {
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
    }
  }
}
</script>

<style scoped>
  .cursor-pointer .v-file-input__text,
  .v-overlay__scrim {
    cursor: pointer !important;
  }
  .quick-transition {
    transition-duration: 20ms !important;
  }
</style>
