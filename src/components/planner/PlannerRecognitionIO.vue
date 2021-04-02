<template>
  <v-card>
    <v-card-title>
      {{ $t('planner.actions.importExport') }}
    </v-card-title>

    <v-card-text>
      <BrowserDeprecated
        v-if="recognition.support !== true"
        :reason="recognition.support.toString()"
      />
      <template
        v-else
      >
        <Subheader>
          使用截图导入
        </Subheader>

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
                        :content="$t('report.recognition.recognize.imagePerSecond', {count: recognition.timer.imagePerSecond})"
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
              <!-- <v-progress-linear
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
              </v-progress-linear> -->
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
              <OffTitle
                :content="$t('report.recognition.confirm.details')"
                small
              />
              <div
                v-if="hasException"
                class="pt-2 transition-all position-relative"
                :class="{
                  'reco-result__wrapper--invalid': hasException,
                }"
              >
                <v-alert
                  outlined
                  dense
                  color="text"
                  border="left"
                  class="my-4 reco-result__alert"
                  type="error"
                >
                  <div>
                    <div>{{ $t('report.recognition.confirm.abnormal.fatal') }}</div>

                    <!--          <div-->
                    <!--            v-if="result.result.drops.length"-->
                    <!--            class="d-inline-flex caption chip-label"-->
                    <!--          >-->
                    <!--            <v-icon-->
                    <!--              left-->
                    <!--              small-->
                    <!--            >-->
                    <!--              mdi-cursor-default-click-->
                    <!--            </v-icon>-->
                    <!--            {{ $t('report.recognition.confirm.abnormal.hover') }}-->
                    <!--          </div>-->
                  </div>

                  <RecognizeResultAlertCard :alerts="depotResult.exceptions" />
                </v-alert>
              </div>
              <v-alert
                type="info"
                border="left"
                outlined
                class="mb-2 markdown-content-inline"
              >
                <ul>
                  <li>请核对仓库识别结果</li>
                  <li>目前暂不支持修改识别结果。如有BUG，请与我们反馈</li>
                  <li />
                  <li
                    v-for="(notice, i) in $t('report.recognition.notices.confirm')"
                    :key="i"
                    v-marked
                    v-text="notice"
                  />
                </ul>
              </v-alert>

              <DepotResult :items="depotResult.items" />

              <v-btn
                large
                rounded
                color="primary"
                class="px-6 mt-2"
                :block="$vuetify.breakpoint.xs"
                @click="step = 4"
              >
                <v-icon left>
                  mdi-check-decagram
                </v-icon>
                确认
              </v-btn>
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
                :headers="depotDifferenceTable.headers"
                :items="depotDifferenceTableData"
                :options="depotDifferenceTable.options.table"
                :footer-props="depotDifferenceTable.options.footer"

                must-sort
                sort-by="times"
                :sort-desc="true"
                :locale="$i18n.locale"
                :hide-default-footer="depotDifferenceTableData.length <= 20"

                :mobile-breakpoint="0"

                class="elevation-0 table--with-footer transparentTable container--fluid pt-4 position-relative border-outlined mb-8 overflow-hidden"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-spacer />
                    <v-switch
                      v-model="onlyShowChanges"
                      label="只显示有变化的数据"
                      class="mt-2"
                    />
                  </v-toolbar>
                </template>
                <template #item="{ item }">
                  <tr>
                    <td :class="depotDifferenceTable.cellClass">
                      <Item
                        disable-overview-card
                        :ratio="0.65"
                        :item="getItem(item.id)"
                      />
                    </td>
                    <td :class="depotDifferenceTable.cellClass">
                      {{ item.old }}
                      <v-icon
                        small
                        style="vertical-align: text-bottom"
                      >
                        mdi-arrow-right-bold
                      </v-icon>
                      {{ item.new }}
                    </td>
                    <td
                      :class="depotDifferenceTable.cellClass + (item.difference > 0 ? ' green--text' : (item.difference === 0 ? '': ' red--text'))"
                    >
                      {{ Math.sign(item.difference) === 1 ? '+' : '' }}{{ item.difference }}
                    </td>
                    <!--
                    <td
                      :class="depotDifferenceTable.cellClass"
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
                          :item="getItem('21')"
                        />
                      </v-badge>
                    </td> -->
                  </tr>
                </template>
                <!-- <template #[`body.append`]>
                  <tr>
                    <td
                      :class="depotDifferenceTable.cellClass"
                      class="grey--text"
                    >
                      {{ $t('report.recognition.report.total') }}
                    </td>
                    <td :class="depotDifferenceTable.cellClass">
                      <v-icon small>
                        mdi-chess-rook
                      </v-icon>
                      × {{ depotDifferenceTableData.total.times }}
                    </td>
                    <td :class="depotDifferenceTable.cellClass">
                      <v-icon small>
                        mdi-brain
                      </v-icon>
                      × {{ depotDifferenceTableData.total.apCost }}
                    </td>
                    <td :class="depotDifferenceTable.cellClass">
                      <v-icon small>
                        mdi-treasure-chest
                      </v-icon>

                      × {{ depotDifferenceTableData.total.items }}
                    </td>
                  </tr>
                </template> -->
              </v-data-table>
              <v-btn
                large
                rounded
                color="primary"
                class="px-6 mt-2"
                :block="$vuetify.breakpoint.xs"
                @click="applyDepotRecognition"
              >
                <v-icon left>
                  mdi-source-merge
                </v-icon>
                应用识别结果
              </v-btn>
              <!-- <v-expand-transition>
                <v-btn
                  v-if="submission.state !== 'uploaded'"
                  rounded
                  x-large
                  color="primary"
                  :block="$vuetify.breakpoint.xs"
                  :loading="submission.state === 'uploading'"
                  :disabled="submission.state !== 'pending'"
                  class="mb-4"
                  @click="submit"
                >
                  <div class="d-inline-flex align-center justify-center">
                    <v-icon small>
                      mdi-server
                    </v-icon>
                    <span class="caption ml-1">
                      {{ $t("server.servers." + recognition.server) }}
                    </span>
                  </div>
                  <v-divider
                    vertical
                    class="mx-2"
                  />
                  <span> {{ $t("report.recognition.report.submit", {count: selectedResults.length}) }} </span>
                </v-btn>
              </v-expand-transition> -->

              <!-- <v-expand-transition>
                <RecognitionSubmitVisualizer
                  v-if="submission.state !== 'pending'"
                  :state="submission.state"
                  :total="submission.total"
                  :submitted="submission.submitted"
                />
              </v-expand-transition> -->
            </template>
          </v-stepper-content>
        </v-stepper>
      </template>

      <!--
      <div class="d-flex justify-end">
        <v-btn
          v-haptic
          outlined
          block
          large
          color="blue-grey"
          class="d-flex"
          style="border-radius: 0 0 4px 4px; margin-top: -1px"
          @click="doImport"
        >
          <v-divider style="opacity: 0.2" />
          <span class="mx-6 d-flex align-center">
            <v-icon left>
              mdi-file-import
            </v-icon>
            {{ $t('planner.actions.import') }}
          </span>
          <v-divider style="opacity: 0.2" />
        </v-btn>
      </div>

      <v-textarea
        v-model="importConfig"
        :label="$t('planner.actions.config.import')"
        dense
        hide-details
        outlined
        rows="14"
        clearable
        class="monospace-pure planner-import-export"
        placeholder="{&quot;@type&quot;:&quot;@penguin-statistics/planner/config&quot;,&quot;items&quot;:[{&quot;id&quot;:&quot;42&quot;,&quot;need&quot;:42,&quot;have&quot;:42},...],&quot;options&quot;:{...},&quot;excludes&quot;:[]}"
        style="border-radius: 4px 4px 0 0; z-index: 10"
        data-gramm="false"
      />

      <div class="d-flex justify-end">
        <v-btn
          v-haptic
          outlined
          block
          large
          color="blue-grey"
          class="d-flex"
          style="border-radius: 0 0 4px 4px; margin-top: -1px"
          @click="doImport"
        >
          <v-divider style="opacity: 0.2" />
          <span class="mx-6 d-flex align-center">
            <v-icon left>
              mdi-file-import
            </v-icon>
            {{ $t('planner.actions.import') }}
          </span>
          <v-divider style="opacity: 0.2" />
        </v-btn>
      </div>
    </v-card-text> -->

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          @click="$emit('close')"
        >
          {{ $t('meta.dialog.close') }}
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import * as clipboard from 'clipboard-polyfill'
import Subheader from '@/components/global/Subheader'
import snackbar from '@/utils/snackbar'
import marshaller from '@/utils/marshaller'
// import unmarshaller from '@/utils/unmarshaller'
// import Console from '@/utils/Console'
import ImageInput from '@/components/recognition/ImageInput'
import DynamicSizeBtn from '@/components/global/DynamicSizeBtn'
// import Cookies from 'js-cookie'
import OffTitle from '@/components/global/OffTitle'
import FactTable from '@/components/stats/fact-table/FactTable'
import FactTableItem from '@/components/stats/fact-table/FactTableItem'
import { mapGetters } from 'vuex'
// import config from '@/config'
import get from '@/utils/getters'
import Recognizer from '@/utils/recognizer'
import environment from '@/utils/environment'
import BrowserDeprecated from '@/components/global/BrowserDeprecated'
import PreloaderInline from '@/components/global/PreloaderInline'
import RecognizeResultAlertCard from '@/components/recognition/RecognizeResultAlertCard'
import DepotResult from '@/components/planner/DepotResult'
import Item from '@/components/global/Item'

export default {
  name: 'PlannerRecognitionIO',
  components: { Subheader, ImageInput, DynamicSizeBtn, OffTitle, FactTable, FactTableItem, BrowserDeprecated, PreloaderInline, RecognizeResultAlertCard, DepotResult, Item },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      step: 1,
      files: [],
      isFilesValid: true,
      recognition: {
        support: environment.wasmSupport,
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
      depotResult: {
        exceptions: [],
        items: []
      },
      depotDifferenceTable: {
        headers: [
          {
            text: '物品',
            value: 'id',
            align: 'center',
            sortable: false,
            width: '40px'
          },
          {
            text: '数据变化',
            value: 'change',
            align: 'center',
            sortable: false,
            width: '80px'
          },
          {
            text: '数据差异',
            value: 'difference',
            align: 'center',
            sortable: true,
            width: '80px',
          }
          // {
          //   text: this.$t('stats.headers.times'),
          //   value: 'times',
          //   align: 'left',
          //   sortable: true,
          //   width: '100px'
          // },
          // {
          //   text: this.$t('stats.headers.apCost'),
          //   value: 'apCost',
          //   align: 'left',
          //   sortable: true,
          //   width: '100px'
          // },
          // {
          //   text: this.$t('stats.headers.itemDrops'),
          //   value: 'items',
          //   align: 'left',
          //   sortable: false,
          //   width: '300px'
          // }
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
        cellClass: 'font-weight-bold monospace'
      },
      onlyShowChanges: true,
      shortlink: {
        generating: false,
        content: null
      },
      importConfig: ''

    }
  },
  computed: {
    rendered () {
      return {
        config: JSON.stringify(marshaller.planner.config(this.config))
      }
    },
    hasException () {
      return this.depotResult.exceptions.length
    },
    depotDifferenceTableData () {
      var difference = []
      for (const item of this.config.items) {
        const newItem = this.depotResult.items.find(el => el.id === item.id) || { id: item.id, have: 0 }
        if (newItem.have - item.have !== 0 || !this.onlyShowChanges) {
          difference.push({
            id: item.id,
            old: item.have,
            new: newItem.have,
            difference: newItem.have - item.have
          })
        }
      }
      return difference
    }
  },
  watch: {
    config () {
      this.shortlink.content = null
    }
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
      const finished = this.depotResult.length || 0
      const total = this.files.length || 1
      const elapsed = (Date.now() - this.recognition.timer.started) / 1000
      const imagePerSecond = (finished / elapsed || 0)
      this.recognition.timer.elapsed = elapsed.toFixed(0)
      this.recognition.timer.imagePerSecond = imagePerSecond.toFixed(1)
      this.recognition.timer.remaining = ((total - finished) / (imagePerSecond || 1)).toFixed(0)
    },
    stopTimer () {
      if (this.recognition.timer.timer) clearInterval(this.recognition.timer.timer)
      this.recognition.timer.remaining = 0
    },
    async submit () {
      this.recognition.state = 'uploading'
      // this.submission.state = 'uploading'
      // this.submission.total = this.selectedResults.length

      // const userId = Cookies.get(config.authorization.userId.cookieKey)
      // try {
      //   await recognitionSubmitter(this, (state, chunk) => {
      //     if (state === 'resolve') {
      //       const reportedUserId = Cookies.get(config.authorization.userId.cookieKey)
      //       if (userId !== reportedUserId) {
      //         this.$store.dispatch('auth/login', {
      //           userId: reportedUserId
      //         })
      //       }
      //       this.submission.submitted.push(chunk)
      //       this.$ga.event('report', 'submit_batch', 'submit_batch', this.selectedResults.length)
      //     } else if (state === 'reject') {
      //       this.submission.submitted.push(- chunk)
      //     }
      //   })
      // } catch (e) {
      //   this.submission.submitted.push(- this.selectedResults.length)
      // }

      this.recognition.state = 'uploaded'
      // this.submission.state = 'uploaded'
      this.confirmLeaveDestroy()
    },
    async init () {
      this.recognition.state = 'initializing'
      this.recognizer = new Recognizer()
      this.recognition.server = this.$store.getters['dataSource/server']

      await this.recognizer
        .initialize(this.$store.getters['dataSource/server'])
        .then(() => {
          this.recognition.state = 'initialized'
        })
        .finally(() => {
          this.recognition.state = 'pending'
        })
    },
    getItem (itemId) {
      return get.items.byItemId(itemId, false, false) || {}
    },
    async recognize () {
      this.depotResult = []

      const typeOrder = ['NORMAL_DROP', 'SPECIAL_DROP', 'EXTRA_DROP']
      typeOrder.reverse()

      this.startTimer()

      this.files.sort((a, b) => a.lastModified - b.lastModified)

      await this.recognizer.recognize(this.files, result => {
        this.recognition.current = result.file.name
        // result.result.drops
        //   .forEach(el => {
        //     el.quantity = parseInt(el.quantity)
        //     if (!el.itemId) el.itemId = `unrecognized_${Math.random()}`
        //   })
        // result.result.drops
        //   .sort((a, b) => {
        //     return -typeOrder.indexOf(a.dropType) - -typeOrder.indexOf(b.dropType)
        //   })
        // this.results.push(result)
      })
      this.depotResult = {
        exceptions: [{ type: 'ERROR', where: 'result', what: 'Result::False', detail: { rect: [86, 813, 287, 182], isResult: false, hash: 'b3d3f77bb73ff73ef3fff4fdb3fce301e355e343e101e07fe01fe05fe04fe003', dist: 132 } }],
        // exceptions:[],
        items: [
          { id: '30135', have: 10 },
          { id: '30125', have: 100 },
          { id: '30084', have: 100 },
          { id: '30083', have: 99 },
          { id: '30094', have: 8880 },
          { id: '30014', have: 77770 },
          { id: '30135', have: 10 },
          { id: '30125', have: 100 },
          { id: '30084', have: 100 },
          { id: '30083', have: 99 },
          { id: '30094', have: 8880 },
          { id: '30135', have: 10 },
          { id: '30125', have: 100 },
          { id: '30084', have: 100 },
          { id: '30083', have: 99 },
          { id: '30094', have: 8880 },
          { id: '30135', have: 10 },
          { id: '30125', have: 100 },
          { id: '30084', have: 100 },
          { id: '30083', have: 99 },
          { id: '30094', have: 8880 },
          { id: '30135', have: 10 },
          { id: '30125', have: 100 },
          { id: '30084', have: 100 },
          { id: '30083', have: 99 },
          { id: '30094', have: 8880 },
          { id: '30135', have: 10 },
          { id: '30125', have: 100 },
          { id: '30084', have: 100 },
          { id: '30083', have: 99 },
          { id: '30094', have: 8880 },
          { id: '30014', have: 77770 }
        ]
      }

      this.stopTimer()
    },
    getStage (stageId) {
      return get.stages.byStageId(stageId) || { code: '(internal error)' }
    },
    async initAndRecognize () {
      this.step = 2
      if (this.recognition.state !== 'initialized') await this.init()
      this.recognition.state = 'recognizing'
      await this.recognize()

      // this.recognition.durationPerImage = (this.results.reduce((prev, curr) => {
      //   return prev + (curr.duration || 0)
      // }, 0) / this.results.length).toFixed(2)

      this.recognition.state = 'rendering'
      setTimeout(() => {
        this.$nextTick(() => {
          this.step = 3
        })
      }, 0)
    },
    copy (content) {
      clipboard.writeText(content)
        .then(() => {
          snackbar.launch('success', 5000, 'clipboard.success')
        })
        .catch(() => {
          snackbar.launch('error', 5000, 'clipboard.error')
        })
    },
    applyDepotRecognition () {
      const currentItems = this.$store.getters['planner/config'].items
      
      let importedCounter = 0

      for (const item of currentItems) {
        const toImportItem = this.depotResult.items.find(el => el.id === item.id) || { id: item.id, have: 0 }
        if (toImportItem.have - item.have !== 0 ) {
          item.have = toImportItem.have || 0
          importedCounter++
        }
      }

      this.$store.commit('planner/changeItems', currentItems)

      snackbar.launch('success', 5000, 'planner.import.success', {
        amount: importedCounter
      })

      this.$emit('close')
    },
    // doImport () {
    //   const unmarshalled = unmarshaller.planner.config.auto(this.importConfig)

    //   if (unmarshalled.exception) {
    //     return snackbar.launch('error', 5000, `planner.import.${unmarshalled.exception}`)
    //   }

    //   let importedCounter = 0

    //   const currentItems = this.$store.getters['planner/config'].items

    //   for (const item of currentItems) {
    //     const toImportItem = unmarshalled.converted.items.find(el => el.id === item.id)
    //     if (toImportItem) {
    //       item.have = toImportItem.have || 0
    //       item.need = toImportItem.need || 0
    //       importedCounter++
    //     }
    //   }

    //   this.$store.commit('planner/changeItems', currentItems)

    //   if (unmarshalled.converted.options) {
    //     const options = Object.assign(this.config.options, unmarshalled.converted.options)
    //     this.$store.commit('planner/changeOptions', options)
    //   }

    //   if (unmarshalled.converted.excludes) {
    //     this.$store.commit('planner/changeExcludes', unmarshalled.converted.excludes)
    //   }

    //   snackbar.launch('success', 5000, 'planner.import.success', {
    //     amount: importedCounter
    //   })

    //   Console.info('PlannerIO', 'unmarshalled import config', unmarshalled)
    // }
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
