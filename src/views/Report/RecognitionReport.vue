<template>
  <v-container
    fluid
    class="fill-height"
  >
    <RecognitionImageDialog v-model="expandImage.src" />

    <!--    <v-dialog-->
    <!--      v-model="submitDialog.open"-->
    <!--      persistent-->
    <!--    >-->
    <!--      <v-card class="d-flex fill-height">-->
    <!--        <v-card-text>-->
    <!--          <v-row-->
    <!--            align="center"-->
    <!--            justify="center"-->
    <!--          >-->
    <!--            <v-col-->
    <!--              cols="12"-->
    <!--              class="px-1 py-12 text-center"-->
    <!--              style="width: 100%"-->
    <!--            >-->
    <!--              <PreloaderInline class="mx-auto mb-6" />-->
    <!--              <h1 class="title">-->
    <!--                {{ $t("report.recognition.states.submitting") }}-->
    <!--              </h1>-->
    <!--              <v-row>-->
    <!--                <v-col>-->
    <!--                  <v-progress-linear-->
    <!--                    indeterminate-->
    <!--                    class="mx-auto"-->
    <!--                    style="width: 90%"-->
    <!--                  />-->
    <!--                </v-col>-->
    <!--              </v-row>-->
    <!--            </v-col>-->
    <!--          </v-row>-->
    <!--        </v-card-text>-->
    <!--      </v-card>-->
    <!--    </v-dialog>-->

    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col cols="12">
        <v-card class="bkop-medium">
          <v-card-title
            class="px-6"
            :class="{ 'grey lighten-3': !dark, secondary: dark }"
          >
            {{ $t("menu.report.recognition") }}

            <!--            <div-->
            <!--              class="chip-label ml-1"-->
            <!--            >-->
            <!--              <v-icon-->
            <!--                x-small-->
            <!--                class="mr-1"-->
            <!--              >-->
            <!--                mdi-beta-->
            <!--              </v-icon>-->
            <!--              {{ $t('menu._beta') }}-->
            <!--            </div>-->
          </v-card-title>
          <v-card-subtitle
            class="px-6"
            :class="{ 'grey lighten-3': !dark, secondary: dark }"
          >
            {{ $t("report.recognition.description") }}
          </v-card-subtitle>

          <v-fade-transition mode="out-in">
            <BrowserDeprecated
              v-if="recognition.support !== true"
              :reason="recognition.support"
            />
            <v-stepper
              v-else
              v-model="step"
              class="bkop-light pt-2 pb-4 transparent elevation-0"
              :class="{ 'dense-stepper': $vuetify.breakpoint.xs }"
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
                    color="primary"
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
                    @valid="(valid) => (isFilesValid = valid)"
                  />

                  <DynamicSizeBtn
                    :loading="step === 2"
                    :reason="
                      files.length
                        ? $t('report.recognition.tips.hasInvalidFile')
                        : $t('report.recognition.tips.emptyFile')
                    "
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
                    <div
                      class="d-flex flex-column flex-md-row flex-lg-row flex-xl-row justify-center align-center mx-auto"
                    >
                      <PreloaderInline :size="120" />
                      <div class="d-flex flex-column py-4 ml-4">
                        <h2 class="headline">
                          {{
                            $t("report.recognition.states." + recognition.state)
                          }}
                        </h2>

                        <span
                          class="monospace-pure my-2"
                          style="word-break: keep-all; text-overflow: ellipsis; line-height: 20px; height: 20px; max-width: 50vw; white-space: nowrap"
                        >
                          {{
                            recognition.state === "rendering"
                              ? $t("report.recognition.states.rendering")
                              : recognition.current ||
                                $t("report.recognition.recognize.noFilename")
                          }}
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
                            :content="
                              $t('report.recognition.recognize.imagePerSecond', {
                                count: recognition.timer.imagePerSecond,
                              })
                            "
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
                      (
                        (results.length /
                          (files.length === 0 ? 1 : files.length)) *
                        100
                      ).toFixed(0)
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
                        v-for="(notice, i) in $t(
                          'report.recognition.notices.confirm'
                        )"
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
                    {{
                      $t("report.recognition.tips.abnormal", {
                        count: filterResults(["ERROR"]).length,
                      })
                    }}
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
                      <template #header>
                        {{ $t("report.recognition.filter") }}
                      </template>
                      <template #content>
                        <v-checkbox
                          v-for="filter in itemFilters"
                          :key="filter.value"
                          v-model="filterValue"
                          v-haptic
                          hide-details
                          :label="
                            filter.text +
                              ` (${filterResults([filter.value]).length})`
                          "
                          class="mt-0 pt-0 mr-4"
                          :value="filter.value"
                          :class="{ 'mr-2': $vuetify.breakpoint.smAndUp }"
                        />
                      </template>
                    </TitledRow>

                    <v-row v-if="results.length">
                      <v-col
                        v-for="result in filteredResults"
                        :key="result.id"
                        cols="12"
                        md="6"
                        lg="4"
                        xl="3"
                        class="align-self-stretch"
                      >
                        <RecognitionResultCard
                          v-model="selectedResultsIndex"
                          :result="result"
                          :index="result.id"
                          @popup="(e) => (expandImage.src = e)"
                        />
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
                      {{ $t("report.recognition.confirm.noResult") }}
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
                      {{
                        $t("report.recognition.confirm.submit", {
                          count: selectedResults.length,
                        })
                      }}
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
                          {{ $t("report.recognition.report.total") }}
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

                  <v-expand-transition>
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
                      <span>
                        {{
                          $t("report.recognition.report.submit", {
                            count: selectedResults.length,
                          })
                        }}
                      </span>
                    </v-btn>
                  </v-expand-transition>

                  <v-expand-transition>
                    <RecognitionSubmitVisualizer
                      v-if="submission.state !== 'pending'"
                      :state="submission.state"
                      :total="submission.total"
                      :submitted="submission.submitted"
                    />
                  </v-expand-transition>
                </template>
              </v-stepper-content>
            </v-stepper>
          </v-fade-transition>
          <div 
            class="monospace degraded-opacity px-6 pb-6 pt-2"
            style="font-size: x-small"
          >
            {{ recognizerVersion }} //
            frontend::{{ env.version }}+{{ env.commit }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Item from "@/components/global/Item";
import Recognizer from "@/utils/recognizer";
import PreloaderInline from "@/components/global/PreloaderInline";
import CDN from "@/mixins/CDN";
import config from '@/config';
import Theme from "@/mixins/Theme";
import ImageInput from "@/components/recognition/ImageInput";
import RecognitionResultOverview from "@/components/recognition/RecognitionResultOverview";
import get from "@/utils/getters";
import DynamicSizeBtn from "@/components/global/DynamicSizeBtn";
import OffTitle from "@/components/global/OffTitle";
import FactTable from "@/components/stats/fact-table/FactTable";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";
import { mapGetters } from "vuex";
import RecognitionImageDialog from "@/components/recognition/RecognitionImageDialog";
import TitledRow from "@/components/global/TitledRow";
import ConfirmLeave from "@/mixins/ConfirmLeave";
import environment from "@/utils/environment";
import BrowserDeprecated from "@/components/global/BrowserDeprecated";
import RecognitionResultCard from "@/components/recognition/RecognitionResultCard";
import RecognitionSubmitVisualizer from "@/components/recognition/RecognitionSubmitVisualizer";
import * as Sentry from "@sentry/vue";
import Console from "@/utils/Console";

let recognitionSubmitter;
try {
  recognitionSubmitter = require("../../utils/vendors/recognitionSubmitter");
} catch (e) {
  recognitionSubmitter = () => Promise.reject('recognition submitter not found');
}

const transaction = Sentry.startTransaction({
  name: "Event_ReportRecognition",
});
Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(transaction));

export default {
  name: "RecognitionReport",
  components: {
    RecognitionSubmitVisualizer,
    RecognitionResultCard,
    BrowserDeprecated,
    TitledRow,
    RecognitionImageDialog,
    FactTableItem,
    FactTable,
    OffTitle,
    DynamicSizeBtn,
    Item,
    ImageInput,
    RecognitionResultOverview,
    PreloaderInline,
},
  mixins: [Theme, CDN, ConfirmLeave],
  data() {
    return {
      step: 1,
      recognizer: null,
      files: [],
      results: [],
      selectedResultsIndex: [],
      expandImage: {
        src: "",
      },
      recognition: {
        support: environment.wasmSupport,
        state: "pending",
        busy: false,
        server: "",
        durationPerImage: "#",
        current: "",
        timer: {
          started: -1,
          elapsed: -1,
          remaining: -1,
          imagePerSecond: -1,
          timer: null,
        },
      },
      submission: {
        state: "pending",
        submitted: [],
        total: -1,
      },
      dialogOrigin: "",
      filterValue: ["SUCCESS", "ERROR"],
      submitDialog: {
        open: false,
        finish: false,
        error: false,
      },
      changeServerTip: 0,
      isFilesValid: true,
      recognizerVersion: 'recognizer::pending',
      reportTable: {
        headers: [
          {
            text: this.$t("stats.headers.stage"),
            value: "stage",
            align: "left",
            sortable: false,
            width: "80px",
          },
          {
            text: this.$t("stats.headers.times"),
            value: "times",
            align: "left",
            sortable: true,
            width: "100px",
          },
          {
            text: this.$t("stats.headers.apCost"),
            value: "apCost",
            align: "left",
            sortable: true,
            width: "100px",
          },
          {
            text: this.$t("stats.headers.itemDrops"),
            value: "items",
            align: "left",
            sortable: false,
            width: "300px",
          },
        ],
        options: {
          table: {
            itemsPerPage: 20,
          },
          footer: {
            itemsPerPageOptions: [10, 20, 40, -1],
            showCurrentPage: true,
          },
        },
        cellClass: "font-weight-bold monospace",
      },
    };
  },
  computed: {
    env() {
      return {
        version: config.version,
        commit: GIT_COMMIT.trim() || 'unknown'
      };
    },
    filteredResults() {
      return this.filterResults(this.filterValue);
    },
    itemFilters() {
      return [
        {
          text: this.$t("report.recognition.status.success"),
          value: "SUCCESS",
        },
        // {
        //   text: this.$t('report.recognition.status.warning'),
        //   value: 'WARNING'
        // },
        {
          text: this.$t("report.recognition.status.error"),
          value: "ERROR",
        },
      ];
    },
    reportTableData() {
      const map = {};
      for (const recognitionResult of this.selectedResults) {
        const stage = get.stages.byStageId(
          recognitionResult.result.stage.stageId
        );
        const stageCode = stage.code;
        if (!map[stageCode]) {
          map[stageCode] = {
            items: {},
            apCost: 0,
            times: 0,
          };
        }
        for (const item of recognitionResult.result.dropArea.drops) {
          if (item.itemId && item.quantity) {
            if (!map[stageCode].items[item.itemId])
              map[stageCode].items[item.itemId] = 0;
            map[stageCode].items[item.itemId] += item.quantity;
          }
        }
        map[stageCode].times++;
        map[stageCode].apCost = stage.apCost * map[stageCode].times;
      }

      const results = [];
      for (const [stage, val] of Object.entries(map))
        results.push({ stage, ...val });
      return {
        results,
        total: {
          times: results.reduce((prev, curr) => prev + curr.times, 0),
          apCost: results.reduce((prev, curr) => prev + curr.apCost, 0),
          items: results.reduce(
            (prev, curr) =>
              prev + Object.values(curr.items).reduce((a, b) => a + b, 0),
            0
          ),
        },
      };
    },
    selectedResults() {
      return this.results.filter((result) => {
        return this.selectedResultsIndex.includes(result.id);
      });
    },
  },
  watch: {
    step: {
      immediate: true,
      handler(val) {
        if (val >= 2) {
          this.confirmLeaveActive = true;
          this.$store.commit("ui/lockServer");
        }
      },
    },
  },
  beforeDestroy() {
    this.stopTimer();
    this.$store.commit("ui/unlockServer");
  },
  methods: {
    ...mapGetters("ui", ["serverLocked"]),
    startTimer() {
      if (this.recognition.timer.timer !== null) return;
      this.recognition.timer.started = Date.now();
      this.recognition.timer.timer = setInterval(() => {
        requestAnimationFrame(() => this.updateTimer());
      }, 1000);
      this.updateTimer();
    },
    updateTimer() {
      const finished = this.results.length || 0;
      const total = this.files.length || 1;
      const elapsed = (Date.now() - this.recognition.timer.started) / 1000;
      const imagePerSecond = finished / elapsed || 0;
      this.recognition.timer.elapsed = elapsed.toFixed(0);
      this.recognition.timer.imagePerSecond = imagePerSecond.toFixed(1);
      this.recognition.timer.remaining = (
        (total - finished) /
        (imagePerSecond || 1)
      ).toFixed(0);
    },
    stopTimer() {
      if (this.recognition.timer.timer)
        clearInterval(this.recognition.timer.timer);
      this.recognition.timer.remaining = 0;
    },
    async submit() {
      const span = transaction.startChild({
        op: "recognizer.submitting",
        data: {
          fileLength: this.files.length,
        },
      });

      this.recognition.state = "uploading";
      this.submission.state = "uploading";
      this.submission.total = this.selectedResults.length;

      try {
        const version = this.recognizer.getVersion()
        await recognitionSubmitter(this, {
          recognizerVersion: version.recognizerVersion,
          recognizerAssetsVersion: version.recognizerAssetsVersion
        }, (state, chunk) => {
          if (state === "resolve") {
            this.submission.submitted.push(chunk);
            this.$ga.event(
              "report",
              "submit_batch",
              "submit_batch",
              this.selectedResults.length
            );
          } else if (state === "reject") {
            this.submission.submitted.push(-chunk);
          }
        });
      } catch (e) {
        this.submission.submitted.push(-this.selectedResults.length);

        Console.error(
          "ReportRecognition",
          "error occurred while submitting",
          e
        );
        span.setData("error", e.message);
        span.setData("errorCount", this.selectedResults.length);

        span.setStatus("unknown_error");
      }

      this.recognition.state = "uploaded";
      this.submission.state = "uploaded";
      this.confirmLeaveDestroy();

      span.finish();
    },
    async init() {
      const span = transaction.startChild({
        op: "recognizer.init",
      });

      this.recognition.state = "initializing";
      this.recognizer = new Recognizer();
      this.recognition.server = this.$store.getters["dataSource/server"];

      await this.recognizer
        .initialize(this.$store.getters["dataSource/server"])
        .then(() => {
          this.recognition.state = "initialized";
          this.recognizerVersion = this.recognizer.getVersionDescription()
          span.setStatus("ok");
        })
        .catch((err) => {
          Console.error("ReportRecognition", "error while initializing", err);
          span.setStatus("unknown_error");
        })
        .finally(() => {
          this.recognition.state = "pending";
          span.finish();
        });
    },
    getItem(itemId) {
      return get.items.byItemId(itemId, false, false) || {};
    },
    async recognize() {
      const containingSpan = transaction.startChild({
        op: "recognizer.recognize",
      });
      containingSpan.setData("queueLength", this.files.length);

      this.results = [];

      const typeOrder = ["NORMAL_DROP", "SPECIAL_DROP", "EXTRA_DROP"];
      typeOrder.reverse();

      this.startTimer();

      this.files.sort((a, b) => a.lastModified - b.lastModified);

      await this.recognizer.recognize(this.files, (result) => {
        this.recognition.current = result.file.name;
        result.result.dropArea.drops.forEach((el) => {
          el.quantity = parseInt(el.quantity);
          if (!el.itemId) el.itemId = `unrecognized_${Math.random()}`;
        });
        result.result.dropArea.drops.sort((a, b) => {
          return (
            -typeOrder.indexOf(a.dropType) - -typeOrder.indexOf(b.dropType)
          );
        });
        this.results.push(result);
      });

      containingSpan.finish();

      this.stopTimer();
    },
    getStage(stageId) {
      return get.stages.byStageId(stageId) || { code: "(internal error)" };
    },
    async initAndRecognize() {
      this.step = 2;
      if (this.recognition.state !== "initialized") await this.init();
      this.recognition.state = "recognizing";
      await this.recognize();
      this.applyPostRecognitionRules(this.results);
      const selectedResultsIndex = [];
      for (const result of this.results)
        if (!result.result.exceptions.length)
          selectedResultsIndex.push(result.id);
      this.selectedResultsIndex = selectedResultsIndex;
      this.recognition.durationPerImage = (
        this.results.reduce((prev, curr) => {
          return prev + (curr.duration || 0);
        }, 0) / this.results.length
      ).toFixed(2);
      const span = transaction.startChild({
        op: "recognizer.rendering",
      });
      this.recognition.state = "rendering";
      setTimeout(() => {
        this.$nextTick(() => {
          this.step = 3;
          span.finish();
        });
      }, 0);
    },
    filterResults(filter) {
      return this.results.filter((result) => {
        for (let key of filter) {
          switch (key) {
            case "SUCCESS":
              if (!result.result.exceptions.length) return true;
              break;
            // case 'WARNING':
            //   if (result.result.warnings.length) return true
            //   break
            case "ERROR":
              if (result.result.exceptions.length) return true;
              break;
            default:
              return false;
          }
        }
        return false;
      });
    },
    applyPostRecognitionRules(results) {
      // const timestamps = results.map(value => value.file.lastModified)
      // const fingerprints = results.map(value => value.result.fingerprint)
      //
      // results.forEach((value, index) => {
      //   // Apply timestamp check, <10s will add warning
      //   let closeTimestamps = false;
      //   timestamps.forEach((timestamp, i) => {
      //     if (Math.abs(timestamp - value.file.lastModified) < 10 * 1000 && i !== index) {
      //       closeTimestamps = true
      //     }
      //   })
      //   if (closeTimestamps) {
      //     value.result.exceptions.push({ what: 'FileTimestamp::TooClose' })
      //   }
      //
      //   // Apply same fingerprint check, same will add warning
      //   let sameFingerprint = false;
      //   fingerprints.forEach((fingerprint, i) => {
      //     if (fingerprint !== "" && fingerprint !== undefined && fingerprint === value.result.fingerprint && i !== index) {
      //       sameFingerprint = true
      //     }
      //   })
      //   if (sameFingerprint) {
      //     value.result.exceptions.push({ what: 'Fingerprint::Same' })
      //   }
      // })
      return Object.freeze(results);
    },
  },
};
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
  bottom: 0.5rem;
  right: 0.75rem;
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
