<template>
  <v-row
    justify="center"
    align="center"
    class="ma-4 mt-0"
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
      <v-divider class="my-4" />

      <v-stepper
        v-model="step"
        alt-labels
        class="bkop-light"
      >
        <v-stepper-header>
          <v-stepper-step
            :complete="step > 1"
            step="1"
          >
            {{ $t("report.recognition.step.input") }}
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="step > 2"
            step="2"
          >
            {{ $t("report.recognition.step.recognizing") }}
          </v-stepper-step>
          <v-divider />

          <v-stepper-step
            :complete="step > 3"
            step="3"
          >
            {{ $t("report.recognition.step.check") }}
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="4">
            {{ $t("report.recognition.step.doreport") }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form class="ml-6">
              <imageDrop v-model="files" />

              <v-btn
                color="primary"
                large
                :disabled="!files.length"
                @click="initAndRecognize"
              >
                {{ $t("report.recognition.start") }}
                {{
                  files.length
                    ? ""
                    : `(${$t("report.recognition.tips.emptyFile")})`
                }}
              </v-btn>
            </v-form>
          </v-stepper-content>

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
                (
                  (results.length / (files.length === 0 ? 1 : files.length)) *
                  100
                ).toFixed(0)
              }}%)
            </v-progress-linear>
          </v-stepper-content>

          <v-stepper-content step="3">
            <RecognitionResult
              :success="filterResults(['Success']).length"
              :warning="filterResults(['Warning']).length"
              :error="filterResults(['Error']).length"
              :total="results.length"
            />
            <v-alert
              v-if="filterResults(['Success']).length !== results.length"
              color="warning"
              prominent
              border="left"
              class="mt-0"
              :icon="
                filterResults(['Warning', 'Error']).length <= 10
                  ? `mdi-numeric-${
                    filterResults(['Warning', 'Error']).length
                  }-box-multiple-outline`
                  : 'mdi-content-copy'
              "
            >
              识别结果中存在警报或错误，暂时无法上报这些图片，共计
              {{ filterResults(["Warning", "Error"]).length }} 张
              <br>
              <v-btn
                color="primary"
                href="https://shimo.im/forms/D6CK8dqcxvgrHxxC/fill?channel=web"
                target="_blank"
              >
                填写一个十分简短的表单
                <v-icon right>
                  mdi-open-in-new
                </v-icon>
              </v-btn>
              以帮助我们解决你所遇到的问题
            </v-alert>
            <v-select
              v-model="filterValue"
              :items="filterItems"
              item-text="text"
              item-value="value"
              attach
              chips
              label="Filter"
              multiple
              prepend-icon="mdi-filter-variant"
            />
            <div
              class="ml-6"
              style="min-height: 100px"
            >
              <v-row v-if="results.length">
                <v-col
                  v-for="result in filteredResults"
                  :key="result.file.name"
                  class="d-flex align-self-stretch"
                  cols="12"
                  md="6"
                  lg="4"
                  xl="4"
                >
                  <v-card
                    outlined
                    :color="
                      result.result.errors.length
                        ? 'rgba(241,97,87,0.5)'
                        : result.result.warnings.length
                          ? 'warning'
                          : ''
                    "
                    style="min-width: 270px"
                  >
                    <v-img
                      v-ripple
                      :src="result.blobUrl"
                      contain
                      style="cursor: zoom-in"
                      @click="(e) => enlargeImage(result.blobUrl, e)"
                    />
                    <v-card-title class="d-flex flex-row align-center">
                      <div class="d-flex align-baseline">
                        <small class="mr-2">{{ $t("stage.name") }}</small>
                        <span class="monospace">{{
                          getStage(result.result.stageId).code
                        }}</span>
                      </div>
                      <v-spacer />
                      <v-chip
                        label
                        class="subtitle-2"
                      >
                        {{ $t("report.recognition.cost") }}
                        {{ result.duration.toFixed(2) }}ms
                      </v-chip>
                    </v-card-title>
                    <v-card-subtitle>
                      {{ $t("report.recognition.filename") }}：<span
                        class="font-weight-bold"
                      >{{ result.file.name || "(文件名未知)" }}</span>
                    </v-card-subtitle>
                    <v-card-text>
                      <div
                        v-for="item in result.result.drops"
                        :key="item.itemId"
                        class="d-inline-flex align-center justify-center flex-column pa-2 mr-2"
                        style="border-radius: 4px"
                        :style="{
                          border: `1px solid ${dark ? '#fff' : '#000'}`,
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
                        v-if="
                          result.result.errors.length ||
                            result.result.warnings.length
                        "
                        outlined
                        color="white"
                        border="left"
                        icon="mdi-alert-circle"
                      >
                        识别时有错误发生，无法为您上报该图片
                        <ul>
                          <li v-if="result.result.errors.length">
                            Error: <br><code>{{ result.result.errors }}</code>
                          </li>
                          <li v-if="result.result.warnings.length">
                            Warning: <br><code>{{
                              result.result.warnings
                            }}</code>
                          </li>
                        </ul>
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
            </div>

            <v-btn
              color="primary mt-4"
              @click="step = 4"
            >
              {{ $t("report.recognition.confirm",[filterResults(["Success"]).length]) }}
              <v-icon
                right
                dark
              >
                mdi-upload
              </v-icon>
            </v-btn>
          </v-stepper-content>

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
                v-for="([StageCode, Stage], index) in Object.entries(
                  StageCombineData
                )"
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
                        {{ StageCode }}
                      </span>
                      <v-spacer />
                      <small>#{{ index + 1 }}</small>
                    </div>
                    <div
                      class="display-1 text-center monospace font-weight-bold my-2"
                    >
                      {{ Stage.Time }}
                      <small class="title">{{
                        $t("planner.calculation.times")
                      }}</small>
                    </div>
                    <div class="d-flex flex-wrap justify-start">
                      <div
                        v-for="([ItemId, Count], idx) in Object.entries(
                          Stage.Items
                        )"
                        :key="idx"
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
                          :content="`×${Count}`"
                        >
                          <Item :item="getItem(ItemId)" />
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
                  block
                  color="success"
                  :disabled="SubmitDialog.open"
                  @click="submit"
                >
                  {{ $t("report.recognition.submit") }} (单次api 仅测试使用 test6 测试帐号)
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
        <v-dialog
          v-model="SubmitDialog.open"
          persistent
        >
          <v-card
            v-if="!SubmitDialog.finish"
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
                        :value="
                          ((SubmitDialog.now + 1) / allTime) * 100
                        "
                        height="20"
                        class="mx-auto"
                        style="width: 90%"
                      >
                        {{ SubmitDialog.now + 1 }} / {{ allTime }}
                      </v-progress-linear>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card
            v-if="SubmitDialog.finish"
            class="d-flex fill-height"
          >
            <v-card-text>
              <v-alert
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
                    <v-icon left>mdi-close</v-icon>{{ $t("meta.dialog.close") }}
                  </span>
                  <v-divider style="opacity: 0.3" />
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-stepper>
    </v-col>
  </v-row>
</template>
<script>
import Item from "@/components/global/Item";
import Recognizer from "@/utils/recognizer";
import PreloaderInline from "@/components/global/PreloaderInline";
import snackbar from "@/utils/snackbar";
import CDN from "@/mixins/CDN";
import Theme from "@/mixins/Theme";
import ImageDrop from "@/components/recognition/ImageDrop";
import RecognitionResult from "@/components/recognition/RecognitionResult";
import config from "@/config";
import get from "@/utils/getters";
import Cookies from "js-cookie";
import report from "@/apis/report";
export default {
  name: "RecognitionReport",
  components: { Item, ImageDrop, RecognitionResult, PreloaderInline },
  mixins: [Theme, CDN],
  data() {
    return {
      recognizer: null,
      files: [],
      results: [],
      rules: [
        (files) => {
          for (const file of files) {
            if (file.size > 50e6)
              return `"${file.name}" (${(file.size / 1e6).toFixed(
                1
              )}MB) ${this.$t("filetoobig")}`;
          }
          return true;
        },
      ],
      initializing: false,
      initialized: false,
      expandImage: {
        dialog: false,
        src: "",
      },
      recognition: {
        busy: false,
      },
      dialogOrigin: "",
      lots: false,
      step: 1,
      filterValue: ["Success", "Warning", "Error"],
      SubmitDialog: {
      open: false,
      now: 0,
      finish: false,
    },
    };
  },
  computed: {
    filteredResults() {
      return this.filterResults(this.filterValue);
    },
    filterItems() {
      return [
        {
          text: this.$t("report.recognition.status.success"),
          value: "Success",
        },
        {
          text: this.$t("report.recognition.status.warning"),
          value: "Warning",
        },
        { text: this.$t("report.recognition.status.error"), value: "Error" },
      ];
    },
    allTime() {
      return this.TrustedResults.length;
    },
    allDropsCount() {
      return this.TrustedResults.reduce((prev, now) => {
        return (
          prev +
          now.result.drops.reduce((p, n) => {
            if (n.quantity) {
              return p + n.quantity;
            }
            return p;
          }, 0)
        );
      }, 0);
    },
    allSanity() {
      return this.TrustedResults.reduce((prev, now) => {
        return prev + get.stages.byStageId(now.result.stageId).apCost;
      }, 0);
    },
    StageCombineData() {
      let Results=this.TrustedResults;
      let Result = {};
      for (let RecognitionResult of Results) {
        let StageCode=get.stages.byStageId(RecognitionResult.result.stageId).code;
        if (!Result[StageCode]) {
          Result[StageCode] = {
            Items: {},
            Time: 0,
          };
        }
          Result[StageCode].Time++;
          for (let Item of RecognitionResult.result.drops) {
            if (Item.itemId && Item.quantity) {
              if (!Result[StageCode].Items[Item.itemId]) {
                Result[StageCode].Items[Item.itemId] = 0;
              }
              Result[StageCode].Items[Item.itemId] += Item.quantity;
            }
        }
      }
      return Result;
    },
    TrustedResults(){
      return this.filterResults(["Success"])
    }
  },
  mounted() {
    const old = window.console.log;
    const logger = document.getElementById("console");
    const loggerWrapper = document.getElementsByClassName("console")[0];
    window.console.log = function (...message) {
      const item = document.createElement("li");
      item.innerText = `${new Date().toISOString()} ${message
        .join(" ")
        .toString()}`;
      if (logger) logger.appendChild(item);
      if (loggerWrapper) loggerWrapper.scrollTop = loggerWrapper.scrollHeight;
      old(...message);
    };
  },
  methods: {
    reload() {
      this.$emit("reload");
    },
    submit() {
      this.SubmitDialog.open = true;
      this.submitOneRecord()
        .then(() => {
          if (++this.SubmitDialog.now < this.TrustedResults.length) {
            this.submit();
          } else {
            this.SubmitDialog.finish = true;
          }
        })
        .catch(() => {
          setTimeout(() => {
            snackbar.launch("info", 1000, "report.recognition.retry");
            this.submit();
          }, 1000);
        });
    },
    submitOneRecord() {
      const userId = Cookies.get(config.authorization.userId.cookieKey);
      return report
        .submitReport(
          {
            stageId: this.TrustedResults[this.SubmitDialog.now].result.stageId,
            drops: this.ConvertData(
              this.TrustedResults[this.SubmitDialog.now].result.drops
            ),
          },
          { source: "RecognitionReport" }
        )
        .then(() => {
          const reportedUserId = Cookies.get(
            config.authorization.userId.cookieKey
          );
          if (userId !== reportedUserId) {
            this.$store.dispatch("auth/login", {
              userId: reportedUserId,
            });
          }
          this.$ga.event(
            "report",
            "submit_single",
            this.TrustedResults[this.SubmitDialog.now].result.stageId,
            1
          );

        });
    },
     ConvertData(Items) {
      return Items.map((Item) => {
        if (
          !["FURNITURE", "SPECIAL_DROP", "EXTRA_DROP", "NORMAL_DROP"].includes(
            Item.dropType
          )
        )
          return;
        return {
          quantity: Item.quantity,
          dropType: Item.dropType,
          itemId: Item.itemId,
        };
      }).filter((a) => a);
    },
    async init() {
      this.initializing = true;

      this.recognizer = new Recognizer();

      await this.recognizer
        .initialize()
        .then(() => {
          this.initialized = true;
          console.log("initialization completed");
        })
        .finally(() => {
          this.initializing = false;
        });
    },
    getItem(ItemId) {
      return get.items.byItemId(ItemId, false, false) || {};
    },
    draw() {
      for (const file of this.files) {
        this.drawImageToPreview(file);
      }
    },
    stringify(s) {
      return JSON.stringify(s, null, 4);
    },
    async recognize() {
      this.results = [];
      this.recognition.busy = true;

      const typeOrder = ["NORMAL_DROP", "SPECIAL_DROP", "EXTRA_DROP"];
      typeOrder.reverse();

      if (this.lots) {
        const repeated = [];
        for (const file of this.files) {
          repeated.push(...Array(100).fill(file));
        }
        console.log(repeated);
        this.files = repeated;
      }

      await this.recognizer.recognize(this.files, (result) => {
        result.result.drops
          .map((el) => {
            el.confidence = parseFloat(el.confidence);
            el.quantity = parseFloat(el.quantity);
          })
          .sort((a, b) => {
            return (
              -typeOrder.indexOf(a.dropType) - -typeOrder.indexOf(b.dropType)
            );
          });
        this.results.push(result);
      });

      console.log(this.results);

      this.recognition.busy = false;
    },
    async drawImageToPreview(blob) {
      const img = document.createElement("img");
      const c = document.querySelector("#canvases");
      if (c) c.prepend(img);
      img.src = URL.createObjectURL(blob);

      return new Promise((resolve) => {
        img.onload = function () {
          console.log(
            this.naturalWidth,
            this.naturalHeight,
            img.width,
            img.height
          );
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          // ctx.drawImage(img, 0, 0, img.width, img.height)
          ctx.drawImage(img, 0, 0);
          // const s = document.getElementById('canvases')
          // if (s) s.prepend(canvas)

          const image = ctx.getImageData(0, 0, img.width, img.height);
          console.log(blob.name, image.data.slice(272, 276));

          resolve();
        };
      });
    },
    clearCanvas() {
      this.$refs.canvases.innerHTML = "";
    },
    clearImages() {
      this.$refs.images.innerHTML = "";
    },
    dropTypeToString(type) {
      return this.$t(`stage.loots.${type}`, false) || type;
    },
    enlargeImage(url, event) {
      console.log(event);
      this.dialogOrigin = `${event.clientX}px ${event.clientY}px`;
      this.$nextTick(() => {
        this.expandImage.dialog = true;
        this.expandImage.src = url;
      });
    },
    getStage(stageId) {
      return get.stages.byStageId(stageId) || { code: "(识别失败)" };
    },
    async initAndRecognize() {
      this.step = 2;
      await this.init();
      await this.recognize();
      console.log(this.results);
      this.step = 3;
    },
    filterResults(filter) {
      return this.results.filter((result) => {
        for (var key of filter) {
          switch (key) {
            case "Success":
              if (
                !(result.result.warnings.length || result.result.errors.length)
              ) {
                return true;
              }
              break;
            case "Warning":
              if (result.result.warnings.length) {
                return true;
              }
              break;
            case "Error":
              if (result.result.errors.length) {
                return true;
              }
              break;
            default:
              return false;
          }
        }
        return false;
      });
    },
  },
};
</script>

<style scoped>
.cursor-pointer .v-file-input__text,
.v-overlay__scrim {
  cursor: pointer !important;
}
/*
.console,
.monospace-pure,
.monospace {
  font-family: ".AppleSystemUIFontMonospaced", Consolas, monospace;
  font-weight: bold;
  letter-spacing: -0.05rem;
}
.monospace {
  background: white;
  color: black;
  padding: 0 0.5em;
  border-radius: 4px;
}
*/
.quick-transition {
  transition-duration: 20ms !important;
}
</style>
