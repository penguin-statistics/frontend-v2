<template>
  <v-stepper
    v-model="step"
    :alt-labels="!small"
    class="transparent elevation-0 full-width pa-4"
  >
    <v-stepper-header
      class="bkop-light elevation-4"
      style="border-radius: 4px;"
    >
      <v-stepper-step :step="1">
        <span class="text-center">
          {{ $t("report.recognition.step.first") }}
        </span>
      </v-stepper-step>
      <v-divider />
      <v-stepper-step :step="2">
        <span class="text-center">
          {{ $t("report.recognition.step.second") }}
        </span>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step :step="3">
        {{ $t("report.recognition.step.third") }}
      </v-stepper-step>
      <v-divider />

      <v-stepper-step :step="4">
        {{ $t("report.recognition.step.fourth") }}
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-content :step="1">
      <v-progress-linear
        :indeterminate="true"
        height="25"
      >
        <strong>正在加载数据</strong>
      </v-progress-linear>
    </v-stepper-content>
    <v-stepper-content :step="2">
      <v-form @submit="prepareRecognition">
        <v-row style="margin-bottom: 15px;">
          <input
            ref="fileinput"
            type="file"
            multiple
            style="display: none;"
            accept="image/png,image/jpeg,image/bmp,image/webp"
            @change="UpdateFile"
          >
          <v-btn
            block
            @click="fileinput.click()"
          >
            {{
              ImageFiles.length == 0
                ? $t("report.recognition.file")
                : $t("report.recognition.filechosen", {
                  count: ImageFiles.length,
                })
            }}
          </v-btn>
        </v-row>
        <v-row>
          <v-btn
            type="submit"
            block
          >
            {{ $t("report.recognition.start") }}
          </v-btn>
        </v-row>
      </v-form>
    </v-stepper-content>
    <v-stepper-content step="3">
      <v-row
        justify="center"
        align="center"
      >
        <v-progress-circular
          :size="280"
          :width="15"
          :indeterminate="true"
        >
          {{ QueueIndex }}/{{ ImageFiles.length }}
        </v-progress-circular>
      </v-row>
    </v-stepper-content>
    <v-stepper-content
      :step="4"
      :class="'nopadding'"
    >
      <v-row justify="center">
        <v-col v-bind="cols.overview">
          <BackdropCard>
            <template v-slot:backdrop>
              <svg
                height="128"
                width="128"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 238.08 227.73"
              >
                <path
                  style="fill: currentColor;"
                  d="M160.58,142.88c1.95-2.61,3.21-5,5.15-6.64a10.53,10.53,0,0,1,5.76-1.92c16.88-1.07,33.78-2,51.33-3L208,105.29l-36.9,25-.76-.86c1.76-1.77,3.3-3.85,5.3-5.26,7.71-5.42,15.57-10.62,23.37-15.91a4.68,4.68,0,0,0,1.71-1.83c-10.29,2.29-20.55,4.75-30.89,6.82-8.53,1.72-17.14,3-25.73,4.41a18.85,18.85,0,0,1-3.14-.12,35.6,35.6,0,0,1,3.05-4.33Q162.53,94.2,181.17,75.2c.71-.73,1.4-1.47,2.58-2.71l-24.33-6.57c.53-2.45.54-2.5,2.79-1.9,6.76,1.8,13.51,3.66,20.86,5.65-.77-1.4-1.19-2.27-1.71-3.08q-9.75-15-19.51-30c-2.6-4-5.4-4.62-9.33-2.11-8.71,5.57-17.38,11.19-26.17,16.64-1.54,1-3.54,1.21-5.33,1.78l-.42-1.06,30.7-19.57L90.61,24.43,119.4,51.89l-.56,1c-1.41-.68-3.09-1.08-4.19-2.11-9-8.48-17.94-17.09-26.91-25.64-2.27-2.16-3.48-2-4,.73C81.87,35.45,80.2,45,78.34,55.22L99.23,54c1,2,0,2.49-1.85,2.6-6.23.37-12.46.83-19.32,1.3l15.45,37c1.2-1.74,2.07-3,2.95-4.27l.6.23c-1.25,5.88-2.7,11.72-3.72,17.63-1.07,6.25-1.74,12.57-2.62,19.17l2.37-.11v7.27l-2.2-1.27c-.16.17-.44.32-.44.47q-.08,22.33-.09,44.68c0,2.32,2.32,3.51,5.21,2.67,5-1.45,10-3,15-4.46.63-.19,1.28-.29,1.93-.43l.61.74c-.88.78-1.63,2-2.65,2.28-4.95,1.63-10,3-14.95,4.58-1,.31-2.34,1.44-2.35,2.22-.15,10.42-.1,20.84-.1,31.25l12.23-16.74c-1.83,16.93-10.88,30.08-21.84,42.65,0-1.49,0-2.78,0-4.06.56-16.36,1.09-32.72,1.73-49.08.08-2.09-.66-2.58-2.63-2.93-16.49-2.92-33-6-49.61-9.05-1.42-10.63-2.81-21.18-4.28-31.72a10.74,10.74,0,0,0-1.32-3.77C21.58,133,15.81,123.06,9.88,113.24a5.15,5.15,0,0,1-.18-5.59c8-16.44,15.77-32.94,23.69-49.4a11.67,11.67,0,0,1,2.68-3.82Q58.15,35.69,80.4,17.16a7.54,7.54,0,0,1,5.17-1.34c17.11,2.07,34.2,4.33,51.3,6.54,7.2.93,14.4,1.81,21.59,2.81a12.31,12.31,0,0,1,3.5,1.24q30.47,14.4,60.86,28.92A8.19,8.19,0,0,1,226.44,59c6.74,14.87,13.29,29.83,20,44.72a5.12,5.12,0,0,1-.27,5.33q-8.16,13.77-16,27.74a4.15,4.15,0,0,1-4,2.36c-21.22,1.18-42.43,2.47-63.64,3.73C162.09,142.91,161.65,142.88,160.58,142.88Zm25.49-69.06c-13.75,14.06-27.29,27.9-40.82,41.75l.42.56,60.61-13.48ZM91.38,96.59l-15-36.13L47.49,94.08ZM90.21,99,46.43,96.61c2.56,11.81,5,23,7.52,34.71Zm-2.36,33.78-24.53,25.6c7.35,7,14.38,13.72,21.48,20.4a14.38,14.38,0,0,0,3,1.61ZM166.2,37.24l-.5.64c6.72,10.37,13.42,20.76,20.24,31.06a3.06,3.06,0,0,0,2.74.63c4-1.23,7.93-2.7,11.89-4,4.67-1.6,9.35-3.17,14.72-5Zm-120.61,55L74,58c-10.7.43-20.55.71-30.38,1.3-2.8.16-3.66,2.52-3.22,5C42,73.43,43.76,82.51,45.59,92.27ZM188.3,72.51c3.34,4.78,6.5,9.32,9.68,13.85l10,14.13c.52-1.54.85-2.48,1.16-3.44,3.35-10.56,6.71-21.12,10-31.7a6,6,0,0,0,0-2.77,2.66,2.66,0,0,0-1.75-.15C207.75,65.72,198.18,69.07,188.3,72.51Zm-170.74,37c1.18,2.94,30.35,20.59,33.53,20.61-2.37-10.91-4.75-21.81-7.2-33.07Zm192.55-7.2,27.82,2.16c-5.62-12.62-11-24.7-16.68-37.49C217.43,79.11,213.87,90.42,210.11,102.34ZM46.69,55.87c.48.28.74.57,1,.57,8.74-.26,17.48-.47,26.21-.93.81,0,2-1.59,2.22-2.61,1-4.31,1.61-8.68,2.4-13C79.23,36,80,32,80.73,28.11L80,27.8Zm45,45.29L57.78,131.34l.39.54L88,128.45C89.21,119.57,90.37,110.84,91.65,101.16ZM38.21,66.72,19.54,105.84l14.51-7c3-1.43,7.29-2.18,8.47-4.51s-.4-6.47-1-9.77C40.58,79,39.45,73.34,38.21,66.72ZM62,156.09l23.83-24.81L54.9,134.8ZM224.89,129.8c4.42-7.72,8.62-15,13-22.7l-27.18-2.2C215.56,113.39,220.11,121.41,224.89,129.8ZM81.6,179.2,61.29,160.1,43.17,172.17Zm-41.56-8,18.9-12.6L36.88,147.17C38,155.4,39,163,40,171.19ZM22.4,117.29l-.44.56,13.41,22.69,15-6.94Zm36.86,38.64c-2.49-7.39-4.66-13.8-6.92-20.47l-17,8Z"
                  transform="translate(-8.96 -15.77)"
                />
                <path
                  style="fill: currentColor;"
                  d="M114.16,193.83c6.08-20.36,12.15-40.72,18.33-61.46H99.58c1.91-24.72,3.8-49.09,5.7-73.66h49.85L133,123.37h34.75l-53.11,70.69Z"
                  transform="translate(-8.96 -15.77)"
                />
              </svg>
            </template>
            <v-card-title class="display-2">
              <span class="monospace">{{ totalApCost }}</span>
            </v-card-title>
            <v-card-subtitle class="subtitle-2 d-flex">
              <span class="subtitle-1">
                {{ $t("stats.site.total.sanity") }}
              </span>
            </v-card-subtitle>
          </BackdropCard>
        </v-col>

        <v-col v-bind="cols.overview">
          <BackdropCard>
            <template v-slot:backdrop>
              <v-icon>
                mdi-treasure-chest
              </v-icon>
            </template>
            <v-card-title class="display-2">
              <span class="monospace">{{ totalReport }}</span>
            </v-card-title>
            <v-card-subtitle class="subtitle-2 d-flex">
              <span class="subtitle-1">
                {{ $t("stats.site.total.report") }}
              </span>
            </v-card-subtitle>
          </BackdropCard>
        </v-col>

        <v-col v-bind="cols.overview">
          <BackdropCard>
            <template v-slot:backdrop>
              <v-icon>
                mdi-cube
              </v-icon>
            </template>
            <v-card-title class="display-2">
              <span class="monospace">{{ totalItemCount }}</span>
            </v-card-title>
            <v-card-subtitle class="subtitle-2 d-flex">
              <span class="subtitle-1">
                {{ $t("stats.site.total.items") }}
              </span>
            </v-card-subtitle>
          </BackdropCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <v-card style="margin: 0 10px;">
            <v-data-table
              :headers="Header"
              :items="TrustData"
              :items-per-page="50"
            >
              <template v-slot:item.Stage.Code="{ item }">
                <v-row
                  align="center"
                  class="cursor-pointer item-name pl-2 monospace font-weight-bold"
                >
                  <span class="ml-2">
                    {{ item.Stage.Code }}
                  </span>
                  <v-divider class="mx-4 item-name--line" />
                </v-row>
              </template>
              <template v-slot:item.Items="{ item }">
                <v-row>
                  <template v-for="(ArkItem, idx) of item.Items">
                    <ItemStepper
                      v-if="
                        !!ArkItem.ItemId &&
                          (!!ArkItem.Count || ArkItem.Count == 0)
                      "
                      :key="idx"
                      v-model="ArkItem.Count"
                      :item="getItemById(ArkItem.ItemId)"
                      :bus="eventBus"
                    />
                  </template>
                </v-row>
              </template>
              <template v-slot:item.function="{ item }">
                <v-row>
                  <v-col :cols="6">
                    <v-btn @click.stop="showImage(item)">
                      {{ $t("report.recognition.showimage") }}
                    </v-btn>
                  </v-col>
                  <v-col :cols="6">
                    <v-btn @click="item.trust = false">
                      {{ $t("report.recognition.mark.untrust") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <v-card style="margin: 0 10px;">
            <v-data-table
              :headers="Header"
              :items="UnTrustData"
              :items-per-page="50"
            >
              <template v-slot:item.Stage.Code="{ item }">
                <v-row
                  align="center"
                  class="cursor-pointer item-name pl-2 monospace font-weight-bold"
                >
                  <span class="ml-2">
                    {{ item.Stage.Code }}
                  </span>
                  <v-divider class="mx-4 item-name--line" />
                </v-row>
              </template>
              <template v-slot:item.Items="{ item }">
                <v-row>
                  <template v-for="(ArkItem, idx) of item.Items">
                    <ItemStepper
                      v-if="
                        !!ArkItem.ItemId &&
                          (!!ArkItem.Count || ArkItem.Count == 0)
                      "
                      :key="idx"
                      v-model="ArkItem.Count"
                      :item="getItemById(ArkItem.ItemId)"
                      :bus="eventBus"
                    />
                  </template>
                </v-row>
              </template>
              <template v-slot:item.function="{ item }">
                <v-row>
                  <v-col :cols="6">
                    <v-btn @click.stop="showImage(item)">
                      {{ $t("report.recognition.showimage") }}
                    </v-btn>
                  </v-col>
                  <v-col :cols="6">
                    <v-btn @click="item.trust = true">
                      {{ $t("report.recognition.mark.trust") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-btn
        :block="true"
        @click="report()"
      >
        {{ $t("report.recognition.submit") }}
      </v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import CDN from "@/mixins/CDN";
import get from "@/utils/getters";
import BackdropCard from "@/components/global/BackdropCard";
import ItemStepper from "@/components/global/ItemStepper";
import { DropRecognition, FontLoaded } from "@/vendors/DropRecognition";
import axios from "axios";
import Vue from "vue";
import strings from "@/utils/strings";
export default {
  name: "Recognition",
  components: { BackdropCard, ItemStepper },
  mixins: [CDN],
  data() {
    return {
      step: 1,
      ImageFiles: [],
      ItemImageLoaded: 0,
      ItemImageCount: 0,
      QueueIndex: 0,
      Result: [],
      Stages: {},
      cols: {
        overview: {
          cols: 12,
          sm: 6,
          md: 4,
        },
        details: {
          cols: 12,
          sm: 6,
          md: 4,
        },
      },
      eventBus: new Vue(),
      Header: [
        {
          text: this.$t("stage.name"),
          value: "Stage.Code",
        },
        {
          text: this.$t("stats.headers.item"),
          value: "Items",
        },
        {
          text: this.$t("report.recognition.function"),
          value: "function",
        },
      ],
    };
  },
  computed: {
    small() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    totalItemCount() {
      return this.TrustData.reduce((a, b) => {
        if (b.trust) {
          return (
            a +
            b.Items.reduce((c, d) => {
              if (d.Count) {
                return c + d.Count;
              }
              return c;
            }, 0)
          );
        }
        return a;
      }, 0);
    },
    totalApCost() {
      return this.TrustData.reduce((a, b) => {
        if (b.trust) {
          return a + this.Stages[b.Stage.Code].apCost;
        }
        return a;
      }, 0);
    },
    totalReport() {
      return this.TrustData.reduce((a, b) => {
        if (b.trust) {
          return a + 1;
        }
        return a;
      }, 0);
    },
    TrustData() {
      return this.Result.filter((a) => {
        return (
          a.trust &&
          !a.Items.every((b) => {
            return b.Count == 0 || !b.ItemId || isNaN(b.Count);
          })
        );
      });
    },
    UnTrustData() {
      return this.Result.filter((a) => {
        return (
          !a.trust &&
          !a.Items.every((b) => {
            return b.Count == 0 || !b.ItemId || isNaN(b.Count);
          })
        );
      });
    },
    strings() {
      return strings;
    },
    fileinput() {
      return this.$refs.fileinput;
    },
  },
  mounted() {
    let stages = {};
    let stageArray = get.stages.all();
    for (let stage of stageArray) {
      stages[stage.code] = stage;
    }
    DropRecognition.init("Stage", stages);
    this.Stages = stages;
    FontLoaded.then(() => {
      this.$nextTick(function () {
        axios.get("/Items.dHash", { responseType: "blob" }).then((Hashs) => {
          DropRecognition.init("ItemHashs", Hashs.data);
          this.step = 2;
        });
      });
    });
  },
  methods: {
    checkType(value) {
      return (
        value.every((val) => {
          return !val || /^image\/.*$/.test(val.type);
        }) || this.$t("report.recognition.error.type")
      );
    },
    report() {
      this.$emit("report", this.TrustData);
    },
    UpdateFile() {
      this.ImageFiles = [...this.$refs.fileinput.files].filter((a) =>
        /image\/.*/.test(a.type)
      );
    },
    prepareRecognition(e) {
      e.preventDefault();
      if (this.ImageFiles.length == 0) return;

      this.step = 3;
      this.QueueIndex = 0;
      this.Result = [];
      this.nextItem();
      return false;
    },
    getItemById(Id) {
      return get.items.byItemId(Id, false, false);
    },
    showImage(Item) {
      this.$emit("showImage", Item.imgURL);
    },
    nextItem() {
      this.Recognition(
        URL.createObjectURL(this.ImageFiles[this.QueueIndex])
      ).then((DropRecognitionResult) => {
        Vue.set(this.Result, this.QueueIndex, DropRecognitionResult);
        if (this.QueueIndex < this.ImageFiles.length) {
          this.QueueIndex++;
          if (this.QueueIndex == this.ImageFiles.length) {
            this.step = 4;
            return;
          }
          this.$nextTick(function () {
            this.nextItem();
          });
        }
      });
    },
    ConfidenceFilter(RecognitionResult) {
      if (RecognitionResult.Stage.Confidence < 0.85) {
        return false;
      }
      if (!(RecognitionResult.Stage.Code in this.Stages)) return false;
      return RecognitionResult.Items.every((Item) => {
        if (Item.Confidence) {
          if (Item.Confidence < 0.6) return false;
          if (Item.Confidence.Count.some((Num) => Num.Confidence < 0.75))
            return false;
        }
        if (Item.ItemId == "") return false;
        if (Item.Count && isNaN(Item.Count)) return false;
        return true;
      });
    },
    Recognition(dataURL) {
      return new Promise((resolve) => {
        let Img = new Image();
        let Result;
        Img.src = dataURL;
        Img.onload = () => {
          try {
            Result = new DropRecognition(Img);
          } catch (e) {
            Result = { error: e };
          }
          Result.imgURL = dataURL;
          Result.trust = this.ConfidenceFilter(Result);
          if (Result.Stage.Code in this.Stages) {
            Result.zone = this.Stages[Result.Stage.Code].zoneId;
            Result.stageId = this.Stages[Result.Stage.Code].stageId;
          }
          resolve(Result);
        };
      });
    },
    async loadImages(Items, onProgress) {
      let Count = 0;
      let ImageEle = {};
      await new Promise((resolve) => {
        for (let Name of Items) {
          let Img = new Image();
          Img.crossOrigin = "Anonymous";
          ImageEle[Name] = Img;
          Img.onload = function () {
            if (++Count == Items.length) {
              if (onProgress) onProgress(Count);
              resolve();
            }
            if (onProgress) onProgress(Count);
          };
          Img.onerror = function () {
            setTimeout(() => {
              let I = new Image();
              ImageEle[Name] = I;
              I.crossOrigin = "Anonymous";
              I.onerror = this.onerror;
              I.onload = this.onload;
              Img.src = "https://static.bbaasite.cn/akitems/" + Name + ".png";
            }, 1000);
          };
          Img.src = "https://static.bbaasite.cn/akitems/" + Name + ".png";
        }
      });
      return ImageEle;
    },
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
@media screen and (max-width: 700px) {
  .nopadding {
    padding: 0;
  }
}
</style>