<i18n>
  {
    "zh": {
      "options": {
        "_name": "选项",
        "byProduct": "考虑合成副产物",
        "requireExp": "大量需求经验",
        "requireLmb": "大量需求龙门币",
        "foreignServer": "不考虑第六章"
      },
      "actions": {
        "import": "导入",
        "export": "导出",
        "importExport": "@:(actions.import)/@:(actions.export)",
        "calculate": "计算规划"
      },
      "have": "已有",
      "need": "需要",
      "copy": "复制到剪贴板",
      "calculation": {
        "title": "规划结果",
        "tabs": {
          "stages": "关卡列表",
          "syntheses": "合成列表",
          "values": "素材价值"
        },
        "lmb": "预计龙门币收益",
        "sanity": "预计需要理智",
        "exp": "预计获得录像带经验",
        "times": "次",
        "level": "材料等级",
        "noStage": "未找到需要进行的作战。是不是忘记选择所需素材了？",
        "noSyntheses": "未找到需要合成的素材。是不是忘记选择所需素材了？"
      }
    },
    "en": {
      "options": {
        "_name": "Options",
        "byProduct": "Consider by-products",
        "requireExp": "Large demand for EXP",
        "requireLmb": "Large demand for LMD",
        "foreignServer": "Do not add Chapter 6 into calculation"
      },
      "actions": {
        "import": "Import",
        "export": "Export",
        "importExport": "@:(actions.import)/@:(actions.export)",
        "calculate": "Calculate"
      },
      "have": "Have",
      "need": "Need",
      "copy": "Copy to Clipboard",
      "calculation": {
        "title": "Calculation Result",
        "tabs": {
          "stages": "Stages",
          "syntheses": "Syntheses",
          "values": "Values"
        },
        "lmb": "Estimated LMD income",
        "sanity": "Estimated Sanity required",
        "exp": "Estimated EXP from Battle Records",
        "times": "battles",
        "level": "Material Level",
        "noStage": "No stage found. Have you selected any material yet?",
        "noSyntheses": "No syntheses found. Have you selected any material yet?"
      }
    },
    "ja": {
      "options": {
        "_name": "オプション",
        "byProduct": "加工副産物を考慮する",
        "requireExp": "大量の経験値が必要",
        "requireLmb": "大量の龍門幣が必要",
        "foreignServer": "第6章を計算に追加しません"
      },
      "actions": {
        "import": "インポート",
        "export": "エクスポート",
        "importExport": "@:(actions.import)/@:(actions.export)",
        "calculate": "計算を行う"
      },
      "have": "所持数",
      "need": "必要数",
      "copy": "クリップボードにコピー",
      "calculation": {
        "title": "計算結果",
        "tabs": {
          "stages": "ステージ",
          "syntheses": "素材加工",
          "values": "素材等級"
        },
        "lmb": "推定獲得龍門幣",
        "sanity": "推定必要理性",
        "exp": "戦闘で入手出来る経験値の推定",
        "times": "回",
        "level": "素材レベル",
        "noStage": "入力内容に不備があるため結果を表示出来ません。必要な素材の入力を忘れていませんか？",
        "noSyntheses": "入力内容に不備があるため結果を表示出来ません。必要な素材の入力を忘れていませんか？"
      }
    },
    "ko": {
      "options": {
        "_name": "설정",
        "byProduct": "부산물 획득 고려",
        "requireExp": "경험치 획득 고려",
        "requireLmb": "용문폐 획득 고려",
        "foreignServer": "에피소드 6을 계산에 넣지 마십시오"
      },
      "actions": {
        "import": "가져오기",
        "export": "내보내기",
        "importExport": "@:(actions.import)/@:(actions.export)",
        "calculate": "계산하기"
      },
      "have": "소유량",
      "need": "필요량",
      "copy": "클립보드에 복사",
      "calculation": {
        "title": "계산 결과",
        "tabs": {
          "stages": "작전 지역 기준",
          "syntheses": "재료 가공 기준",
          "values": "재료 등급 기준"
        },
        "lmb": "예상 용문폐 획득량",
        "sanity": "예상 이성 필요량",
        "exp": "예상 경험치 획득량",
        "times": "회",
        "level": "재료 등급",
        "noStage": "작전 지역을 찾을 수 없습니다. 필요한 재료를 선택하셨습니까?",
        "noSyntheses": "가공할 재료를 찾을 수 없습니다. 필요한 재료를 선택하셨습니까?"
      }
    }
  }
</i18n>

<template>
  <v-container
    fluid
    class="fill-height align-content-center justify-center"
  >
    <v-dialog
      v-model="calculation.done"
      scrollable
      max-width="calc(max(450px, 80vw))"
    >
      <v-card v-if="calculation.done">
        <v-card-title
          class="indigo pb-4 elevation-2 white--text"
          style="background: #a14042; line-height: 1.1;"
        >
          <div
            class="overline d-block"
            style="width: 100%"
          >
            ArkPlanner
          </div>
          <br>
          <div
            class="headline font-weight-bold d-block"
            style="width: 100%"
          >
            {{ $t('calculation.title') }}
          </div>
        </v-card-title>
        <v-card-text>
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
                  <v-icon>mdi-cash</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    {{ calculation.data.gold.toLocaleString() }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('calculation.lmb') }}
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
                    {{ calculation.data.cost.toLocaleString() }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('calculation.sanity') }}
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
                  <v-icon>mdi-card-bulleted</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    {{ calculation.data.exp.toLocaleString() }} EXP
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('calculation.exp') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-tabs
            v-model="calculation.tab"
            icons-and-text 
            grow
            centered
            class="elevated-tab"
          >
            <v-tabs-slider />
            <v-tab
              v-for="tab in calculation.tabs"
              :key="tab.id"
            >
              {{ $t(tab.text) }}
              <v-icon>{{ tab.icon }}</v-icon>
            </v-tab>
            <v-tab-item>
              <v-alert
                v-if="!calculation.data.stages.length"
                type="warning"
                border="left"
                class="mt-4"
              >
                {{ $t('calculation.noStage') }}
              </v-alert>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="[index, stage] in calculation.data.stages.entries()"
                  :key="stage.stage"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div class="title">
                        <span class="font-weight-bold headline">{{ stage.stage }}</span>
                        <small class="float-right">#{{ index + 1 }}</small>
                      </div>
                      <div class="display-1 text-center monospace font-weight-bold my-2">
                        {{ parseInt(stage.count).toLocaleString() }} <small class="title">{{ $t('calculation.times') }}</small>
                      </div>
                      <div>
                        <div
                          v-for="material in stage.materials"
                          :key="material.name"
                          class="d-inline-flex mx-2 my-1 cursor-pointer"
                          @click="redirectItem(material.item.itemId)"
                        >
                          <v-badge
                            bottom
                            overlap
                            bordered
                            label
                            color="indigo"
                            :offset-x="24"
                            :offset-y="20"
                            :content="`×${material.value}`"
                          >
                            <Item
                              :item="material.item"
                            />
                          </v-badge>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-alert
                v-if="!calculation.data.syntheses.length"
                type="warning"
                border="left"
                class="mt-4"
              >
                {{ $t('calculation.noSyntheses') }}
              </v-alert>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="synthesis in calculation.data.syntheses"
                  :key="synthesis.target.itemId"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div class="title d-block">
                        <Item
                          :item="synthesis.target.item"
                          disable-tooltip
                          class="float-right"
                          :ratio="0.5"
                        />
                        <span class="font-weight-bold headline">{{ synthesis.target.name }}</span>
                      </div>
                      <div class="display-1 text-center monospace font-weight-bold my-2">
                        &times;{{ parseInt(synthesis.count).toLocaleString() }}
                      </div>
                      <div
                        v-for="item in synthesis.items"
                        :key="item.name"
                        class="d-inline-flex mx-2 my-1 cursor-pointer"
                        @click="redirectItem(item.item.itemId)"
                      >
                        <v-badge
                          bottom
                          overlap
                          bordered
                          label
                          color="secondary"
                          :offset-x="24"
                          :offset-y="20"
                          :content="`×${item.value}`"
                        >
                          <Item
                            :item="item.item"
                          />
                        </v-badge>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row
                align="start"
                justify="start"
              >
                <v-col
                  v-for="value in calculation.data.values"
                  :key="value.level"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  class="align-self-stretch"
                >
                  <v-card class="card-item">
                    <v-card-text>
                      <div class="title">
                        <span class="font-weight-bold headline">{{ $t('calculation.level') }} {{ value.level }}</span>
                      </div>
                      <div
                        v-for="item in value.materials"
                        :key="item.name"
                        class="d-inline-flex mx-4 my-1 cursor-pointer"
                        @click="redirectItem(item.item.itemId)"
                      >
                        <v-badge
                          bottom
                          overlap
                          bordered
                          label
                          color="secondary"
                          :offset-x="24"
                          :offset-y="20"
                          :content="`${item.value}`"
                        >
                          <Item
                            :item="item.item"
                          />
                        </v-badge>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
        </v-card-text>

        <v-card-actions class="elevation-4">
          <v-btn
            text
            block
            large
            @click="calculation.done = false"
          >
            <v-divider style="opacity: 0.3" />
            <span class="mx-4">
              <v-icon left>mdi-close</v-icon>{{ $t('dialog.close') }}
            </span>
            <v-divider style="opacity: 0.3" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      fab
      bottom
      right
      fixed
      ripple
      color="primary"
      :loading="calculation.pending"
      @click="calculate"
    >
      <v-icon>
        mdi-calculator
      </v-icon>
    </v-btn>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="5"
        md="4"
        lg="3"
        xl="3"
        class="px-0"
      >
        <v-row
          no-gutters
          class="my-3 mx-6"
          align="center"
          justify="center"
        >
          <v-col cols="12">
            <span class="title">
              {{ $t('options._name') }}
            </span>
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.byProduct"
              :label="$t('options.byProduct')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.requireExp"
              :label="$t('options.requireExp')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.requireLmb"
              :label="$t('options.requireLmb')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="options.foreignServer"
              :label="$t('options.foreignServer')"
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="7"
        md="8"
        lg="9"
        xl="9"
        class="pt-0 pb-2 px-0"
      >
        <v-row
          no-gutters
          class="my-3 mx-6"
          align="center"
          justify="space-around"
        >
          <v-dialog
            v-model="importExportDialog"
            width="800"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="green white--text"
                class="my-1"
                large
                v-on="on"
              >
                <v-icon left>
                  mdi-file-restore
                </v-icon>
                {{ $t('actions.importExport') }}
              </v-btn>
            </template>
            <v-card>
              <v-tabs
                v-model="importExportDialogTab"
                icons-and-text
                grow
                centered
                background-color="green"
                color="white"
              >
                <v-tab>
                  {{ $t('actions.import') }}
                  <v-icon>
                    mdi-file-import
                  </v-icon>
                </v-tab>
                <v-tab>
                  {{ $t('actions.export') }}
                  <v-icon>mdi-file-export</v-icon>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="importExportDialogTab">
                <v-tab-item>
                  <v-card flat>
                    <v-container class="pa-4">
                      <v-textarea
                        v-model="importJson"
                        dense
                        hide-details
                        outlined
                        rows="14"
                        class="monospace planner-import-export"
                        placeholder="[{&quot;name&quot;:&quot;双极纳米片&quot;,&quot;need&quot;:4,&quot;have&quot;:0},{&quot;name&quot;:&quot;D32钢&quot;,&quot;need&quot;:4,&quot;have&quot;:0}...]"
                      />
                    </v-container>
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="green"
                        text
                        @click="importFromText"
                      >
                        {{ $t('actions.import') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card
                    flat
                  >
                    <v-card-text
                      class="monospace planner-import-export"
                    >
                      {{ exportJson }}
                    </v-card-text>
                    <v-divider />
                    <v-card-actions style="flex: 0 0 auto;">
                      <v-spacer />
                      <v-btn
                        color="green"
                        text
                        @click="copyExportJson"
                      >
                        {{ $t('copy') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-dialog>
          <!--          <v-dialog-->
          <!--            v-model="fundDressDialog"-->
          <!--            width="500"-->
          <!--          >-->
          <!--            <template v-slot:activator="{ on }">-->
          <!--              <v-btn-->
          <!--                color="yellow darken-3"-->
          <!--                class="my-1"-->
          <!--                v-on="on"-->
          <!--              >-->
          <!--                {{ $t('actions.becomeIdol') }}-->
          <!--              </v-btn>-->
          <!--            </template>-->
          <!--            <v-card>-->
          <!--              <v-card-title class="headline">-->
          <!--                {{ $t('actions.becomeIdol') }}-->
          <!--              </v-card-title>-->
          <!--              <v-card-actions>-->
          <!--                <v-spacer />-->
          <!--                <v-btn-->
          <!--                  color="primary"-->
          <!--                  text-->
          <!--                  @click="fundDressDialog = false"-->
          <!--                >-->
          <!--                  OK-->
          <!--                </v-btn>-->
          <!--              </v-card-actions>-->
          <!--            </v-card>-->
          <!--          </v-dialog>-->
          <v-btn
            color="red white--text"
            class="my-1"
            :loading="calculation.pending"
            large
            @click="calculate"
          >
            <v-icon left>
              mdi-calculator
            </v-icon>
            {{ $t('actions.calculate') }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      class="pt-2"
      dense
    >
      <v-col
        v-for="itemData in itemsData"
        :key="itemData.id"
        xl="1"
        md="2"
        sm="3"
        class="col-xs-1-2 col-md-1-10 col-lg-1-8"
        cols="4"
      >
        <v-card
          class="pa-2 ma-0 bkop-medium"
        >
          <v-container>
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <Item
                :item="items.get(itemData.id)"
                :ratio="1"
                disable-link
                tooltip-position="bottom"
              />
            </v-row>
          </v-container>
          <v-container class="px-0 pt-0 pb-1 ma-0">
            <v-row
              align="center"
              justify="center"
              no-gutters
              class="mb-2"
            >
              <v-col class="d-flex align-center">
                <div
                  class="d-flex"
                  style="position: relative"
                >
                  <span
                    class="caption no-break--text field-caption white--text"
                  >
                    {{ $t('have') }}
                  </span>
                </div>
                <number-input
                  v-model="itemData.have"
                  size="small"
                  center
                  controls
                  :placeholder="$t('have')"
                  class="monospace font-weight-bold number-input-theme transition-all"
                  :class="{'number-input-theme--dense': $vuetify.breakpoint.smAndDown}"
                  :min="0"
                />
              </v-col>
            </v-row>
            <v-row
              align="center"
              justify="center"
              no-gutters
            >
              <v-col class="d-flex align-center mt-2">
                <div
                  class="d-flex"
                  style="position: relative"
                >
                  <span
                    class="caption no-break--text field-caption white--text"
                  >
                    {{ $t('need') }}
                  </span>
                </div>
                <number-input
                  v-model="itemData.need"
                  size="small"
                  center
                  controls
                  :placeholder="$t('need')"
                  class="monospace font-weight-bold number-input-theme transition-all"
                  :class="{'number-input-theme--dense': $vuetify.breakpoint.smAndDown}"
                  :min="0"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import planner from "@/apis/planner";
  import get from "@/utils/getters";
  import i18n from "@/i18n";
  import Item from "@/components/global/Item";

  import * as clipboard from "clipboard-polyfill";
  import marshaller from "@/utils/marshaller";
  import snackbar from "@/utils/snackbar";
  import Console from "@/utils/Console";
  import strings from "@/utils/strings";

  export default {
    name: "Planner",
    components: {Item},
    data: () => {
      const items = get.items.all(true);
      return {
        fundDressDialog: false,
        importExportDialog: false,
        importExportDialogTab: null,
        importJson: "",
        items,
        itemsData: get.items.all(false)
          .filter(item => item.itemType === "MATERIAL" && item.itemId.length === 5 || item.itemType === "ARKPLANNER")
          .map(item => ({
            id: item.itemId,
            name: item.name,
            need: 0,
            have: 0,
          })),
        calculation: {
          pending: false,
          done: false,
          data: {},
          tab: null,
          tabs: [{
            id: "stages",
            icon: "mdi-cube",
            text: "calculation.tabs.stages"
          }, {
            id: "syntheses",
            icon: "mdi-treasure-chest",
            text: "calculation.tabs.syntheses"
          }, {
            id: "values",
            icon: "mdi-cash-usd",
            text: "calculation.tabs.values"
          }]
        },
        options: {
          byProduct: false,
          requireExp: false,
          requireLmb: false,
          foreignServer: i18n.locale !== "zh"
        },
        getItem: get.items
      }
    },
    computed: {
      exportJson() {
        return JSON.stringify(this.itemsData);
      }
    },
    methods: {
      calculate() {
        this.calculation.pending = true;
        planner.plan(
          marshaller.planner({
            items: this.itemsData,
            options: this.options
          })
        )
          .then(({data}) => {
            if (data.error === true) {
              return snackbar.launch("error", 15000, "planner.calculationError", {
                error: data.reason
              })
            }

            data.stages = data.stages.map(el => {
              el.materials = [];
              for (const [name, value] of Object.entries(el.items)) {
                const item = get.items.byName(name);
                el.materials.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            data.syntheses = data.syntheses.map(el => {
              el.target = {
                item: get.items.byName(el.target)
              };
              el.target.name = strings.translate(el.target.item, "name");
              el.items = [];
              for (const [name, value] of Object.entries(el.materials)) {
                const item = get.items.byName(name);
                el.items.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            data.values = data.values.map(el => {
              el.materials = [];
              for (const {name, value} of el.items) {
                if (parseFloat(value) === 0) continue;
                const itemObject = get.items.byName(name);
                el.materials.push({
                  name: strings.translate(itemObject, "name"),
                  item: itemObject,
                  value
                })
              }
              return el
            });
            Console.debug("Planner", data)
            this.$set(this.calculation, "data", data);
            this.calculation.done = true
          })
          .catch((err) => {
            Console.error("Planner", "failed to get plan", err)
            snackbar.networkError()
          })
          .finally(() => {
            this.calculation.pending = false;
          })
      },
      importFromText () {
        let imported;
        try {
          imported = JSON.parse(this.importJson);
        } catch (e) {
          Console.info("PlannerImport", "json error", e)
          snackbar.launch("error", 5000, "planner.import.jsonError", {
            error: e.toString()
          });
          return
        }
        this.importToItemsData(imported)
      },
      importToItemsData(imported) {
        const convertedImported = [];
        for (const itemData of imported) {
          if (!(itemData.hasOwnProperty("need") && Number.isInteger(itemData.need) && itemData.need >= 0 &&
            itemData.hasOwnProperty("have") && Number.isInteger(itemData.have) && itemData.have >= 0)) {
            Console.info("PlannerImport", "one of the item data is invalid. not importing this and continue to the next one (reason: need or have invalid): ", itemData)
            continue
          }
          const haveId = itemData.hasOwnProperty("id");
          const haveName = itemData.hasOwnProperty("name");
          if (haveId) {
            if (!haveName) {
              itemData.name = get.items.byItemId(itemData.id).name
            }
            convertedImported.push(itemData)
          } else if (!haveId) {
            if (!haveName) {
              Console.info("PlannerImport", "one of the item data is invalid. not importing this and continue to the next one (reason: no id and name): ", itemData)
              continue
            }
            const item = get.items.byName(itemData.name);
            convertedImported.push({
              id: item.itemId,
              name: item.name,
              need: itemData.need,
              have: itemData.have
            })
          }
        }

        let importedCounter = 0;

        for (const item of convertedImported) {
          const object = this.itemsData.find(el => el.id === item.id);
          if (!object) {
            Console.info("PlannerImport","no item found with", item);
            continue
          }
          object.have = item.have;
          object.need = item.need;
          importedCounter++;
        }

        this.importJson = "";
        this.importExportDialog = false;
        snackbar.launch("success", 5000, "planner.import.success", {
          amount: importedCounter
        })
      },
      copyExportJson() {
        clipboard.writeText(this.exportJson)
          .then(() => {
            snackbar.launch("success", 5000, "clipboard.success")
          })
          .catch(() => {
            snackbar.launch("error", 5000, "clipboard.error")
          })
      },
      redirectItem(itemId) {
        this.$router.push({
          name: "StatsByItem_SelectedItem",
          params: {
            itemId
          }
        })
      }
    }
  };
</script>

<style scoped>
  @media (max-width: 380px) {
    .col-xs-1-2 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      max-width: 50%;
    }
  }

  @media (min-width: 1264px) and (max-width: 1584px) {
    .col-lg-1-8 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 12.5%;
      flex: 0 0 12.5%;
      max-width: 12.5%
    }
  }

  @media (min-width: 1584px) and (max-width: 1904px) {
    .col-md-1-10 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 10%;
      flex: 0 0 10%;
      max-width: 10%
    }
  }

  .planner-import-export, ::v-deep .planner-import-export textarea {
    word-break: break-all;
    line-height: 1.2 !important;
    font-size: 12px;
  }

  ::v-deep .planner-import-export textarea {
    padding: 8px 0;
  }

  .fix-icon--left {
    transform: translate(-2px, -3.5px)
  }

  .fix-icon--right {
    transform: translate(2px, -3.5px)
  }

  ::v-deep .input-field input {
    text-align: center !important;
    /*font-family: SF Mono, "Droid Sans Mono", Ubuntu Mono, Consolas, Courier New, Courier, monospace;*/
    font-weight: bold;
  }

  ::v-deep .input-field .v-input__slot {
    padding: 0 6px !important;
  }

  ::v-deep .input-field legend {
    margin: 0 6px !important;
  }

  ::v-deep .input-field label {
    margin: 0 12px !important;
    max-width: none;
  }


  ::v-deep .input-field--is-zero input {
    opacity: 0.5
  }

  .card-item {
    border: 2px solid #4350b0;
    height: 100%
  }

  ::v-deep .number-input-theme .number-input__input {
    background: rgba(0, 0, 0, .2) !important;
    border: 1px solid #ddd;
    border-radius: 17px !important;
    top: 0 !important;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 30px !important;
    padding-right: 30px !important;
  }

  ::v-deep .number-input-theme .number-input__input:hover {
    background: rgba(0, 0, 0, .35) !important;
  }
  ::v-deep .number-input-theme .number-input__input:focus {
    background: rgba(0, 0, 0, .5) !important;
    border: 1px solid #0074d9;
    /*border: none;*/
    /*box-shadow: 0 0 0 1px #0074d9;*/
  }

  ::v-deep .theme--light .number-input-theme .number-input__input:hover {
    background: rgba(0, 0, 0, .17) !important;
  }
  ::v-deep .theme--light .number-input-theme .number-input__input:focus {
    background: rgba(0, 0, 0, .35) !important;
  }

  ::v-deep .number-input-theme .number-input__button {
    border: 1px solid #ddd !important;
    top: 2px !important;
    border-radius: 50% !important;
    height: 30px !important;
    width: 30px !important;
    transition: all .225s cubic-bezier(0.165, 0.84, 0.44, 1);
    touch-action: manipulation;
  }
  ::v-deep .number-input-theme .number-input__button:hover {
    transform: scale(1.12);
  }
  ::v-deep .number-input-theme .number-input__button:active {
    transform: scale(1.02);
  }

  ::v-deep .number-input-theme .number-input__button--minus {
    left: 2px !important;
  }
  ::v-deep .number-input-theme .number-input__button--plus {
    right: 2px !important;
  }

  ::v-deep .number-input-theme--dense .number-input__button--minus {
    border-radius: 15px 0 0 15px !important;
  }
  ::v-deep .number-input-theme--dense .number-input__button--plus {
    border-radius: 0 15px 15px 0 !important;
  }
  ::v-deep .number-input-theme--dense .number-input__button::before {
    width: 14px;
  }
  ::v-deep .number-input-theme--dense .number-input__button {
    width: 24px !important;
  }
  ::v-deep .number-input-theme--dense .number-input__button:hover {
    width: 30px !important;
  }
  ::v-deep .number-input-theme--dense .number-input__input {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .field-caption {
    top: -30px;
    left: 20px;
    position: absolute;
    background: rgba(0, 0, 0, .98);
    font-weight: bold;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 11px !important;
    z-index: 4;

    user-select: none;
  }

  ::v-deep .v-tabs .v-slide-group__prev {
    display: none !important;
  }


</style>