<i18n>
  {
    "zh": {
      "options": {
        "_name": "选项",
        "byProduct": "考虑合成副产物",
        "requireExp": "大量需求经验",
        "requireLmb": "大量需求龙门币"
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
        "requireLmb": "Large demand for LMD"
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
        "requireLmb": "大量の龍門幣が必要"
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
        "requireLmb": "용문폐 획득 고려"
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
                      <div class="title d-flex">
                        <span class="font-weight-bold headline">{{ synthesis.target.name }}</span>
                        <v-spacer />
                        <Item
                          :item="synthesis.target.item"
                          class="float-right"
                          disable-tooltip
                          :ratio="0.5"
                        />
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
                        @click="importToItemsData"
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
          done: true,
          data: {"cost":9818468,"gcost":65300331,"gold":117821629,"exp":78192312,"stages":[{"stage":"1-7","count":"121466","items":{"固源岩":"151180","源岩":"14435","破损装置":"4112","酯原料":"7282","双酮":"5588","异铁碎片":"5640","代糖":"6918"},"materials":[{"name":"初級源岩","item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"value":"151180"},{"name":"源岩鉱","item":{"itemId":"30011","name":"源岩","sortId":100015,"rarity":0,"itemType":"MATERIAL","spriteCoord":[4,0],"name_i18n":{"ja":"源岩鉱","en":"Orirock","zh":"源岩","ko":"원암"}},"value":"14435"},{"name":"破損装置","item":{"itemId":"30061","name":"破损装置","sortId":100019,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,4],"name_i18n":{"ja":"破損装置","en":"Damaged Device","zh":"破损装置","ko":"파손된 장치"}},"value":"4112"},{"name":"エステル原料","item":{"itemId":"30031","name":"酯原料","sortId":100023,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,2],"name_i18n":{"ja":"エステル原料","en":"Ester","zh":"酯原料","ko":"에스테르 원료"}},"value":"7282"},{"name":"アケトン試剤","item":{"itemId":"30051","name":"双酮","sortId":100035,"rarity":0,"itemType":"MATERIAL","spriteCoord":[3,3],"name_i18n":{"ja":"アケトン試剤","en":"Diketon","zh":"双酮","ko":"디케톤"}},"value":"5588"},{"name":"異鉄の欠片","item":{"itemId":"30041","name":"异铁碎片","sortId":100031,"rarity":0,"itemType":"MATERIAL","spriteCoord":[5,2],"name_i18n":{"ja":"異鉄の欠片","en":"Oriron Shard","zh":"异铁碎片","ko":"이철 조각"}},"value":"5640"},{"name":"ブドウ糖","item":{"itemId":"30021","name":"代糖","sortId":100027,"rarity":0,"itemType":"MATERIAL","spriteCoord":[2,1],"name_i18n":{"ja":"ブドウ糖","en":"Sugar Substitute","zh":"代糖","ko":"대체당"}},"value":"6918"}]},{"stage":"4-4","count":"138251","items":{"固源岩组":"3120","固源岩":"42358","源岩":"39460","装置":"17054","扭转醇":"51118","破损装置":"15412","白马醇":"6944"},"materials":[{"name":"中級源岩","item":{"itemId":"30013","name":"固源岩组","sortId":100013,"rarity":2,"itemType":"MATERIAL","spriteCoord":[0,1],"name_i18n":{"ja":"中級源岩","en":"Orirock Cluster","zh":"固源岩组","ko":"원암 큐브 번들"}},"value":"3120"},{"name":"初級源岩","item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"value":"42358"},{"name":"源岩鉱","item":{"itemId":"30011","name":"源岩","sortId":100015,"rarity":0,"itemType":"MATERIAL","spriteCoord":[4,0],"name_i18n":{"ja":"源岩鉱","en":"Orirock","zh":"源岩","ko":"원암"}},"value":"39460"},{"name":"初級装置","item":{"itemId":"30062","name":"装置","sortId":100018,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,4],"name_i18n":{"ja":"初級装置","en":"Device","zh":"装置","ko":"장치"}},"value":"17054"},{"name":"合成コール","item":{"itemId":"30073","name":"扭转醇","sortId":100005,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,4],"name_i18n":{"ja":"合成コール","en":"Loxic Kohl","zh":"扭转醇","ko":"로식 콜"}},"value":"51118"},{"name":"破損装置","item":{"itemId":"30061","name":"破损装置","sortId":100019,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,4],"name_i18n":{"ja":"破損装置","en":"Damaged Device","zh":"破损装置","ko":"파손된 장치"}},"value":"15412"},{"name":"上級合成コール","item":{"itemId":"30074","name":"白马醇","sortId":100004,"rarity":3,"itemType":"MATERIAL","spriteCoord":[0,5],"name_i18n":{"ja":"上級合成コール","en":"White Horse Kohl","zh":"白马醇","ko":"화이트 호스 콜"}},"value":"6944"}]},{"stage":"3-3","count":"88706","items":{"固源岩":"18075","源岩":"19253","研磨石":"28378","装置":"7326","破损装置":"7818","酯原料":"12483","聚酸酯":"12529"},"materials":[{"name":"初級源岩","item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"value":"18075"},{"name":"源岩鉱","item":{"itemId":"30011","name":"源岩","sortId":100015,"rarity":0,"itemType":"MATERIAL","spriteCoord":[4,0],"name_i18n":{"ja":"源岩鉱","en":"Orirock","zh":"源岩","ko":"원암"}},"value":"19253"},{"name":"砥石","item":{"itemId":"30093","name":"研磨石","sortId":100009,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,5],"name_i18n":{"ja":"砥石","en":"Grindstone","zh":"研磨石","ko":"연마석"}},"value":"28378"},{"name":"初級装置","item":{"itemId":"30062","name":"装置","sortId":100018,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,4],"name_i18n":{"ja":"初級装置","en":"Device","zh":"装置","ko":"장치"}},"value":"7326"},{"name":"破損装置","item":{"itemId":"30061","name":"破损装置","sortId":100019,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,4],"name_i18n":{"ja":"破損装置","en":"Damaged Device","zh":"破损装置","ko":"파손된 장치"}},"value":"7818"},{"name":"エステル原料","item":{"itemId":"30031","name":"酯原料","sortId":100023,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,2],"name_i18n":{"ja":"エステル原料","en":"Ester","zh":"酯原料","ko":"에스테르 원료"}},"value":"12483"},{"name":"初級エステル","item":{"itemId":"30032","name":"聚酸酯","sortId":100022,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,2],"name_i18n":{"ja":"初級エステル","en":"Polyester","zh":"聚酸酯","ko":"폴리에스테르"}},"value":"12529"}]},{"stage":"2-10","count":"189088","items":{"酮凝集":"19168","RMA70-12":"53056","双酮":"22669","异铁":"19425","异铁碎片":"23400","糖":"24520","代糖":"29830"},"materials":[{"name":"初級アケトン","item":{"itemId":"30052","name":"酮凝集","sortId":100034,"rarity":1,"itemType":"MATERIAL","spriteCoord":[4,3],"name_i18n":{"ja":"初級アケトン","en":"Polyketon","zh":"酮凝集","ko":"아케톤 응집체"}},"value":"19168"},{"name":"RMA70-12","item":{"itemId":"30103","name":"RMA70-12","sortId":100011,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,5],"name_i18n":{"ja":"RMA70-12","en":"RMA70-12","zh":"RMA70-12","ko":"RMA70-12"}},"value":"53056"},{"name":"アケトン試剤","item":{"itemId":"30051","name":"双酮","sortId":100035,"rarity":0,"itemType":"MATERIAL","spriteCoord":[3,3],"name_i18n":{"ja":"アケトン試剤","en":"Diketon","zh":"双酮","ko":"디케톤"}},"value":"22669"},{"name":"初級異鉄","item":{"itemId":"30042","name":"异铁","sortId":100030,"rarity":1,"itemType":"MATERIAL","spriteCoord":[0,3],"name_i18n":{"ja":"初級異鉄","en":"Oriron","zh":"异铁","ko":"이철"}},"value":"19425"},{"name":"異鉄の欠片","item":{"itemId":"30041","name":"异铁碎片","sortId":100031,"rarity":0,"itemType":"MATERIAL","spriteCoord":[5,2],"name_i18n":{"ja":"異鉄の欠片","en":"Oriron Shard","zh":"异铁碎片","ko":"이철 조각"}},"value":"23400"},{"name":"初級糖原","item":{"itemId":"30022","name":"糖","sortId":100026,"rarity":1,"itemType":"MATERIAL","spriteCoord":[3,1],"name_i18n":{"ja":"初級糖原","en":"Sugar","zh":"糖","ko":"포도당"}},"value":"24520"},{"name":"ブドウ糖","item":{"itemId":"30021","name":"代糖","sortId":100027,"rarity":0,"itemType":"MATERIAL","spriteCoord":[2,1],"name_i18n":{"ja":"ブドウ糖","en":"Sugar Substitute","zh":"代糖","ko":"대체당"}},"value":"29830"}]},{"stage":"4-10","count":"53290","items":{"全新装置":"15971","固源岩组":"1979","固源岩":"18396","源岩":"11686","装置":"7375","扭转醇":"1937","破损装置":"4393","改量装置":"1622"},"materials":[{"name":"中級装置","item":{"itemId":"30063","name":"全新装置","sortId":100017,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,4],"name_i18n":{"ja":"中級装置","en":"Integrated Device","zh":"全新装置","ko":"리뉴얼 장치"}},"value":"15971"},{"name":"中級源岩","item":{"itemId":"30013","name":"固源岩组","sortId":100013,"rarity":2,"itemType":"MATERIAL","spriteCoord":[0,1],"name_i18n":{"ja":"中級源岩","en":"Orirock Cluster","zh":"固源岩组","ko":"원암 큐브 번들"}},"value":"1979"},{"name":"初級源岩","item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"value":"18396"},{"name":"源岩鉱","item":{"itemId":"30011","name":"源岩","sortId":100015,"rarity":0,"itemType":"MATERIAL","spriteCoord":[4,0],"name_i18n":{"ja":"源岩鉱","en":"Orirock","zh":"源岩","ko":"원암"}},"value":"11686"},{"name":"初級装置","item":{"itemId":"30062","name":"装置","sortId":100018,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,4],"name_i18n":{"ja":"初級装置","en":"Device","zh":"装置","ko":"장치"}},"value":"7375"},{"name":"合成コール","item":{"itemId":"30073","name":"扭转醇","sortId":100005,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,4],"name_i18n":{"ja":"合成コール","en":"Loxic Kohl","zh":"扭转醇","ko":"로식 콜"}},"value":"1937"},{"name":"破損装置","item":{"itemId":"30061","name":"破损装置","sortId":100019,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,4],"name_i18n":{"ja":"破損装置","en":"Damaged Device","zh":"破损装置","ko":"파손된 장치"}},"value":"4393"},{"name":"上級装置","item":{"itemId":"30064","name":"改量装置","sortId":100016,"rarity":3,"itemType":"MATERIAL","spriteCoord":[4,4],"name_i18n":{"ja":"上級装置","en":"Optimized Device","zh":"改量装置","ko":"개량 장치"}},"value":"1622"}]},{"stage":"2-5","count":"109596","items":{"双酮":"21999","糖组":"40769","异铁碎片":"22430","糖":"3014","代糖":"28088"},"materials":[{"name":"アケトン試剤","item":{"itemId":"30051","name":"双酮","sortId":100035,"rarity":0,"itemType":"MATERIAL","spriteCoord":[3,3],"name_i18n":{"ja":"アケトン試剤","en":"Diketon","zh":"双酮","ko":"디케톤"}},"value":"21999"},{"name":"中級糖原","item":{"itemId":"30023","name":"糖组","sortId":100025,"rarity":2,"itemType":"MATERIAL","spriteCoord":[4,1],"name_i18n":{"ja":"中級糖原","en":"Sugar Pack","zh":"糖组","ko":"포도당 번들"}},"value":"40769"},{"name":"異鉄の欠片","item":{"itemId":"30041","name":"异铁碎片","sortId":100031,"rarity":0,"itemType":"MATERIAL","spriteCoord":[5,2],"name_i18n":{"ja":"異鉄の欠片","en":"Oriron Shard","zh":"异铁碎片","ko":"이철 조각"}},"value":"22430"},{"name":"初級糖原","item":{"itemId":"30022","name":"糖","sortId":100026,"rarity":1,"itemType":"MATERIAL","spriteCoord":[3,1],"name_i18n":{"ja":"初級糖原","en":"Sugar","zh":"糖","ko":"포도당"}},"value":"3014"},{"name":"ブドウ糖","item":{"itemId":"30021","name":"代糖","sortId":100027,"rarity":0,"itemType":"MATERIAL","spriteCoord":[2,1],"name_i18n":{"ja":"ブドウ糖","en":"Sugar Substitute","zh":"代糖","ko":"대체당"}},"value":"28088"}]}],"syntheses":[{"target":{"item":{"itemId":"30125","name":"双极纳米片","sortId":100002,"rarity":4,"itemType":"ARKPLANNER","spriteCoord":[4,9],"name_i18n":{"ja":"ナノフレーク","en":"Bipolar Nanoflake","zh":"双极纳米片","ko":"바이폴라 나노플레이크 칩"}},"name":"ナノフレーク"},"count":"30000","materials":{"改量装置":"30000","白马醇":"60000"},"items":[{"name":"上級装置","item":{"itemId":"30064","name":"改量装置","sortId":100016,"rarity":3,"itemType":"MATERIAL","spriteCoord":[4,4],"name_i18n":{"ja":"上級装置","en":"Optimized Device","zh":"改量装置","ko":"개량 장치"}},"value":"30000"},{"name":"上級合成コール","item":{"itemId":"30074","name":"白马醇","sortId":100004,"rarity":3,"itemType":"MATERIAL","spriteCoord":[0,5],"name_i18n":{"ja":"上級合成コール","en":"White Horse Kohl","zh":"白马醇","ko":"화이트 호스 콜"}},"value":"60000"}]},{"target":{"item":{"itemId":"30074","name":"白马醇","sortId":100004,"rarity":3,"itemType":"MATERIAL","spriteCoord":[0,5],"name_i18n":{"ja":"上級合成コール","en":"White Horse Kohl","zh":"白马醇","ko":"화이트 호스 콜"}},"name":"上級合成コール"},"count":"53056","materials":{"扭转醇":"53056","糖组":"53056","RMA70-12":"53056"},"items":[{"name":"合成コール","item":{"itemId":"30073","name":"扭转醇","sortId":100005,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,4],"name_i18n":{"ja":"合成コール","en":"Loxic Kohl","zh":"扭转醇","ko":"로식 콜"}},"value":"53056"},{"name":"中級糖原","item":{"itemId":"30023","name":"糖组","sortId":100025,"rarity":2,"itemType":"MATERIAL","spriteCoord":[4,1],"name_i18n":{"ja":"中級糖原","en":"Sugar Pack","zh":"糖组","ko":"포도당 번들"}},"value":"53056"},{"name":"RMA70-12","item":{"itemId":"30103","name":"RMA70-12","sortId":100011,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,5],"name_i18n":{"ja":"RMA70-12","en":"RMA70-12","zh":"RMA70-12","ko":"RMA70-12"}},"value":"53056"}]},{"target":{"item":{"itemId":"30062","name":"装置","sortId":100018,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,4],"name_i18n":{"ja":"初級装置","en":"Device","zh":"装置","ko":"장치"}},"name":"初級装置"},"count":"10579","materials":{"破损装置":"31737"},"items":[{"name":"破損装置","item":{"itemId":"30061","name":"破损装置","sortId":100019,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,4],"name_i18n":{"ja":"破損装置","en":"Damaged Device","zh":"破损装置","ko":"파손된 장치"}},"value":"31737"}]},{"target":{"item":{"itemId":"30063","name":"全新装置","sortId":100017,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,4],"name_i18n":{"ja":"中級装置","en":"Integrated Device","zh":"全新装置","ko":"리뉴얼 장치"}},"name":"中級装置"},"count":"10584","materials":{"装置":"42336"},"items":[{"name":"初級装置","item":{"itemId":"30062","name":"装置","sortId":100018,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,4],"name_i18n":{"ja":"初級装置","en":"Device","zh":"装置","ko":"장치"}},"value":"42336"}]},{"target":{"item":{"itemId":"30064","name":"改量装置","sortId":100016,"rarity":3,"itemType":"MATERIAL","spriteCoord":[4,4],"name_i18n":{"ja":"上級装置","en":"Optimized Device","zh":"改量装置","ko":"개량 장치"}},"name":"上級装置"},"count":"28379","materials":{"全新装置":"28379","固源岩组":"56758","研磨石":"28379"},"items":[{"name":"中級装置","item":{"itemId":"30063","name":"全新装置","sortId":100017,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,4],"name_i18n":{"ja":"中級装置","en":"Integrated Device","zh":"全新装置","ko":"리뉴얼 장치"}},"value":"28379"},{"name":"中級源岩","item":{"itemId":"30013","name":"固源岩组","sortId":100013,"rarity":2,"itemType":"MATERIAL","spriteCoord":[0,1],"name_i18n":{"ja":"中級源岩","en":"Orirock Cluster","zh":"固源岩组","ko":"원암 큐브 번들"}},"value":"56758"},{"name":"砥石","item":{"itemId":"30093","name":"研磨石","sortId":100009,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,5],"name_i18n":{"ja":"砥石","en":"Grindstone","zh":"研磨石","ko":"연마석"}},"value":"28379"}]},{"target":{"item":{"itemId":"30052","name":"酮凝集","sortId":100034,"rarity":1,"itemType":"MATERIAL","spriteCoord":[4,3],"name_i18n":{"ja":"初級アケトン","en":"Polyketon","zh":"酮凝集","ko":"아케톤 응집체"}},"name":"初級アケトン"},"count":"15561","materials":{"双酮":"46683"},"items":[{"name":"アケトン試剤","item":{"itemId":"30051","name":"双酮","sortId":100035,"rarity":0,"itemType":"MATERIAL","spriteCoord":[3,3],"name_i18n":{"ja":"アケトン試剤","en":"Diketon","zh":"双酮","ko":"디케톤"}},"value":"46683"}]},{"target":{"item":{"itemId":"30053","name":"酮凝集组","sortId":100033,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,3],"name_i18n":{"ja":"中級アケトン","en":"Aketon","zh":"酮凝集组","ko":"아케톤 응집체 번들"}},"name":"中級アケトン"},"count":"8311","materials":{"酮凝集":"33244"},"items":[{"name":"初級アケトン","item":{"itemId":"30052","name":"酮凝集","sortId":100034,"rarity":1,"itemType":"MATERIAL","spriteCoord":[4,3],"name_i18n":{"ja":"初級アケトン","en":"Polyketon","zh":"酮凝集","ko":"아케톤 응집체"}},"value":"33244"}]},{"target":{"item":{"itemId":"30042","name":"异铁","sortId":100030,"rarity":1,"itemType":"MATERIAL","spriteCoord":[0,3],"name_i18n":{"ja":"初級異鉄","en":"Oriron","zh":"异铁","ko":"이철"}},"name":"初級異鉄"},"count":"16049","materials":{"异铁碎片":"48147"},"items":[{"name":"異鉄の欠片","item":{"itemId":"30041","name":"异铁碎片","sortId":100031,"rarity":0,"itemType":"MATERIAL","spriteCoord":[5,2],"name_i18n":{"ja":"異鉄の欠片","en":"Oriron Shard","zh":"异铁碎片","ko":"이철 조각"}},"value":"48147"}]},{"target":{"item":{"itemId":"30043","name":"异铁组","sortId":100029,"rarity":2,"itemType":"MATERIAL","spriteCoord":[1,3],"name_i18n":{"ja":"中級異鉄","en":"Oriron Cluster","zh":"异铁组","ko":"이철 번들"}},"name":"中級異鉄"},"count":"8655","materials":{"异铁":"34620"},"items":[{"name":"初級異鉄","item":{"itemId":"30042","name":"异铁","sortId":100030,"rarity":1,"itemType":"MATERIAL","spriteCoord":[0,3],"name_i18n":{"ja":"初級異鉄","en":"Oriron","zh":"异铁","ko":"이철"}},"value":"34620"}]},{"target":{"item":{"itemId":"30032","name":"聚酸酯","sortId":100022,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,2],"name_i18n":{"ja":"初級エステル","en":"Polyester","zh":"聚酸酯","ko":"폴리에스테르"}},"name":"初級エステル"},"count":"5765","materials":{"酯原料":"17295"},"items":[{"name":"エステル原料","item":{"itemId":"30031","name":"酯原料","sortId":100023,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,2],"name_i18n":{"ja":"エステル原料","en":"Ester","zh":"酯原料","ko":"에스테르 원료"}},"value":"17295"}]},{"target":{"item":{"itemId":"30033","name":"聚酸酯组","sortId":100021,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,2],"name_i18n":{"ja":"中級エステル","en":"Polyester Pack","zh":"聚酸酯组","ko":"폴리에스테르 번들"}},"name":"中級エステル"},"count":"3937","materials":{"聚酸酯":"15748"},"items":[{"name":"初級エステル","item":{"itemId":"30032","name":"聚酸酯","sortId":100022,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,2],"name_i18n":{"ja":"初級エステル","en":"Polyester","zh":"聚酸酯","ko":"폴리에스테르"}},"value":"15748"}]},{"target":{"item":{"itemId":"30022","name":"糖","sortId":100026,"rarity":1,"itemType":"MATERIAL","spriteCoord":[3,1],"name_i18n":{"ja":"初級糖原","en":"Sugar","zh":"糖","ko":"포도당"}},"name":"初級糖原"},"count":"21613","materials":{"代糖":"64839"},"items":[{"name":"ブドウ糖","item":{"itemId":"30021","name":"代糖","sortId":100027,"rarity":0,"itemType":"MATERIAL","spriteCoord":[2,1],"name_i18n":{"ja":"ブドウ糖","en":"Sugar Substitute","zh":"代糖","ko":"대체당"}},"value":"64839"}]},{"target":{"item":{"itemId":"30023","name":"糖组","sortId":100025,"rarity":2,"itemType":"MATERIAL","spriteCoord":[4,1],"name_i18n":{"ja":"中級糖原","en":"Sugar Pack","zh":"糖组","ko":"포도당 번들"}},"name":"中級糖原"},"count":"12287","materials":{"糖":"49148"},"items":[{"name":"初級糖原","item":{"itemId":"30022","name":"糖","sortId":100026,"rarity":1,"itemType":"MATERIAL","spriteCoord":[3,1],"name_i18n":{"ja":"初級糖原","en":"Sugar","zh":"糖","ko":"포도당"}},"value":"49148"}]},{"target":{"item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"name":"初級源岩"},"count":"28279","materials":{"源岩":"84837"},"items":[{"name":"源岩鉱","item":{"itemId":"30011","name":"源岩","sortId":100015,"rarity":0,"itemType":"MATERIAL","spriteCoord":[4,0],"name_i18n":{"ja":"源岩鉱","en":"Orirock","zh":"源岩","ko":"원암"}},"value":"84837"}]},{"target":{"item":{"itemId":"30013","name":"固源岩组","sortId":100013,"rarity":2,"itemType":"MATERIAL","spriteCoord":[0,1],"name_i18n":{"ja":"中級源岩","en":"Orirock Cluster","zh":"固源岩组","ko":"원암 큐브 번들"}},"name":"中級源岩"},"count":"51658","materials":{"固源岩":"258290"},"items":[{"name":"初級源岩","item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"value":"258290"}]}],"values":[{"level":"5","items":[{"name":"双极纳米片","value":"327.28"},{"name":"D32钢","value":"64.39"},{"name":"聚合剂","value":"44.44"}],"materials":[{"name":"ナノフレーク","item":{"itemId":"30125","name":"双极纳米片","sortId":100002,"rarity":4,"itemType":"ARKPLANNER","spriteCoord":[4,9],"name_i18n":{"ja":"ナノフレーク","en":"Bipolar Nanoflake","zh":"双极纳米片","ko":"바이폴라 나노플레이크 칩"}},"value":"327.28"},{"name":"D32鋼","item":{"itemId":"30135","name":"D32钢","sortId":100001,"rarity":4,"itemType":"ARKPLANNER","spriteCoord":[5,9],"name_i18n":{"ja":"D32鋼","en":"D32 Steel","zh":"D32钢","ko":"D32강"}},"value":"64.39"},{"name":"融合剤","item":{"itemId":"30115","name":"聚合剂","sortId":100003,"rarity":4,"itemType":"ARKPLANNER","spriteCoord":[3,9],"name_i18n":{"ja":"融合剤","en":"Polymerization Preparation","zh":"聚合剂","ko":"중합제"}},"value":"44.44"}]},{"level":"4","items":[{"name":"改量装置","value":"124.35"},{"name":"白马醇","value":"101.47"},{"name":"RMA70-24","value":"48.42"},{"name":"五水研磨石","value":"47.31"},{"name":"炽合金块","value":"38.91"},{"name":"提纯源岩","value":"38.26"},{"name":"三水锰矿","value":"33.05"},{"name":"酮阵列","value":"28.70"},{"name":"异铁块","value":"21.91"},{"name":"糖聚块","value":"20.66"},{"name":"聚酸酯块","value":"11.09"},{"name":"聚合凝胶","value":"10.16"}],"materials":[{"name":"上級装置","item":{"itemId":"30064","name":"改量装置","sortId":100016,"rarity":3,"itemType":"MATERIAL","spriteCoord":[4,4],"name_i18n":{"ja":"上級装置","en":"Optimized Device","zh":"改量装置","ko":"개량 장치"}},"value":"124.35"},{"name":"上級合成コール","item":{"itemId":"30074","name":"白马醇","sortId":100004,"rarity":3,"itemType":"MATERIAL","spriteCoord":[0,5],"name_i18n":{"ja":"上級合成コール","en":"White Horse Kohl","zh":"白马醇","ko":"화이트 호스 콜"}},"value":"101.47"},{"name":"RMA70-24","item":{"itemId":"30104","name":"RMA70-24","sortId":100010,"rarity":3,"itemType":"MATERIAL","spriteCoord":[0,6],"name_i18n":{"ja":"RMA70-24","en":"RMA70-24","zh":"RMA70-24","ko":"RMA70-24"}},"value":"48.42"},{"name":"上級砥石","item":{"itemId":"30094","name":"五水研磨石","sortId":100008,"rarity":3,"itemType":"MATERIAL","spriteCoord":[4,5],"name_i18n":{"ja":"上級砥石","en":"Grindstone Pentahydrate","zh":"五水研磨石","ko":"고급연마석"}},"value":"47.31"},{"name":"炽合金块","item":{"itemId":"31024","name":"炽合金块","sortId":100038,"rarity":3,"itemType":"MATERIAL","addTimePoint":3,"spriteCoord":[4,8],"name_i18n":{"ja":"炽合金块","en":"炽合金块","zh":"炽合金块","ko":"炽合金块"}},"value":"38.91"},{"name":"上級源岩","item":{"itemId":"30014","name":"提纯源岩","sortId":100012,"rarity":3,"itemType":"MATERIAL","spriteCoord":[1,1],"name_i18n":{"ja":"上級源岩","en":"Orriock Concentration","zh":"提纯源岩","ko":"정제 원암"}},"value":"38.26"},{"name":"上級マンガン","item":{"itemId":"30084","name":"三水锰矿","sortId":100006,"rarity":3,"itemType":"MATERIAL","spriteCoord":[2,5],"name_i18n":{"ja":"上級マンガン","en":"Manganese Trihydrate","zh":"三水锰矿","ko":"망간 중합체"}},"value":"33.05"},{"name":"高級アケトン","item":{"itemId":"30054","name":"酮阵列","sortId":100032,"rarity":3,"itemType":"MATERIAL","spriteCoord":[0,4],"name_i18n":{"ja":"高級アケトン","en":"Keton Colloid","zh":"酮阵列","ko":"아케톤 팩"}},"value":"28.70"},{"name":"高級異鉄","item":{"itemId":"30044","name":"异铁块","sortId":100028,"rarity":3,"itemType":"MATERIAL","spriteCoord":[2,3],"name_i18n":{"ja":"高級異鉄","en":"Oriron Block","zh":"异铁块","ko":"이철 팩"}},"value":"21.91"},{"name":"高級糖原","item":{"itemId":"30024","name":"糖聚块","sortId":100024,"rarity":3,"itemType":"MATERIAL","spriteCoord":[5,1],"name_i18n":{"ja":"高級糖原","en":"Sugar Lump","zh":"糖聚块","ko":"포도당 팩"}},"value":"20.66"},{"name":"上級エステル","item":{"itemId":"30034","name":"聚酸酯块","sortId":100020,"rarity":3,"itemType":"MATERIAL","spriteCoord":[4,2],"name_i18n":{"ja":"上級エステル","en":"Polyester Lump","zh":"聚酸酯块","ko":"폴리에스테르 팩"}},"value":"11.09"},{"name":"聚合凝胶","item":{"itemId":"31014","name":"聚合凝胶","sortId":100036,"rarity":3,"itemType":"MATERIAL","addTimePoint":3,"spriteCoord":[2,8],"name_i18n":{"ja":"聚合凝胶","en":"聚合凝胶","zh":"聚合凝胶","ko":"聚合凝胶"}},"value":"10.16"}]},{"level":"3","items":[{"name":"RMA70-12","value":"48.59"},{"name":"全新装置","value":"40.10"},{"name":"研磨石","value":"39.52"},{"name":"糖组","value":"29.98"},{"name":"扭转醇","value":"22.89"},{"name":"固源岩组","value":"22.37"},{"name":"轻锰矿","value":"17.41"},{"name":"炽合金","value":"12.97"},{"name":"凝胶","value":"0.00000"},{"name":"酮凝集组","value":"0.00000"},{"name":"聚酸酯组","value":"0.00000"},{"name":"异铁组","value":"0.00000"}],"materials":[{"name":"RMA70-12","item":{"itemId":"30103","name":"RMA70-12","sortId":100011,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,5],"name_i18n":{"ja":"RMA70-12","en":"RMA70-12","zh":"RMA70-12","ko":"RMA70-12"}},"value":"48.59"},{"name":"中級装置","item":{"itemId":"30063","name":"全新装置","sortId":100017,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,4],"name_i18n":{"ja":"中級装置","en":"Integrated Device","zh":"全新装置","ko":"리뉴얼 장치"}},"value":"40.10"},{"name":"砥石","item":{"itemId":"30093","name":"研磨石","sortId":100009,"rarity":2,"itemType":"MATERIAL","spriteCoord":[3,5],"name_i18n":{"ja":"砥石","en":"Grindstone","zh":"研磨石","ko":"연마석"}},"value":"39.52"},{"name":"中級糖原","item":{"itemId":"30023","name":"糖组","sortId":100025,"rarity":2,"itemType":"MATERIAL","spriteCoord":[4,1],"name_i18n":{"ja":"中級糖原","en":"Sugar Pack","zh":"糖组","ko":"포도당 번들"}},"value":"29.98"},{"name":"合成コール","item":{"itemId":"30073","name":"扭转醇","sortId":100005,"rarity":2,"itemType":"MATERIAL","spriteCoord":[5,4],"name_i18n":{"ja":"合成コール","en":"Loxic Kohl","zh":"扭转醇","ko":"로식 콜"}},"value":"22.89"},{"name":"中級源岩","item":{"itemId":"30013","name":"固源岩组","sortId":100013,"rarity":2,"itemType":"MATERIAL","spriteCoord":[0,1],"name_i18n":{"ja":"中級源岩","en":"Orirock Cluster","zh":"固源岩组","ko":"원암 큐브 번들"}},"value":"22.37"},{"name":"マンガン","item":{"itemId":"30083","name":"轻锰矿","sortId":100007,"rarity":2,"itemType":"MATERIAL","spriteCoord":[1,5],"name_i18n":{"ja":"マンガン","en":"Manganese Ore","zh":"轻锰矿","ko":"망간 광석"}},"value":"17.41"},{"name":"炽合金","item":{"itemId":"31023","name":"炽合金","sortId":100039,"rarity":2,"itemType":"MATERIAL","addTimePoint":3,"spriteCoord":[3,8],"name_i18n":{"ja":"炽合金","en":"炽合金","zh":"炽合金","ko":"炽合金"}},"value":"12.97"}]},{"level":"2","items":[{"name":"装置","value":"10.03"},{"name":"糖","value":"7.50"},{"name":"固源岩","value":"4.47"},{"name":"酮凝集","value":"0.00000"},{"name":"聚酸酯","value":"0.00000"},{"name":"异铁","value":"0.00000"}],"materials":[{"name":"初級装置","item":{"itemId":"30062","name":"装置","sortId":100018,"rarity":1,"itemType":"MATERIAL","spriteCoord":[2,4],"name_i18n":{"ja":"初級装置","en":"Device","zh":"装置","ko":"장치"}},"value":"10.03"},{"name":"初級糖原","item":{"itemId":"30022","name":"糖","sortId":100026,"rarity":1,"itemType":"MATERIAL","spriteCoord":[3,1],"name_i18n":{"ja":"初級糖原","en":"Sugar","zh":"糖","ko":"포도당"}},"value":"7.50"},{"name":"初級源岩","item":{"itemId":"30012","name":"固源岩","sortId":100014,"rarity":1,"itemType":"MATERIAL","spriteCoord":[5,0],"name_i18n":{"ja":"初級源岩","en":"Orirock Cube","zh":"固源岩","ko":"원암 큐브"}},"value":"4.47"}]},{"level":"1","items":[{"name":"破损装置","value":"3.34"},{"name":"代糖","value":"2.50"},{"name":"源岩","value":"1.49"},{"name":"酯原料","value":"0.00000"},{"name":"双酮","value":"0.00000"},{"name":"异铁碎片","value":"0.00000"}],"materials":[{"name":"破損装置","item":{"itemId":"30061","name":"破损装置","sortId":100019,"rarity":0,"itemType":"MATERIAL","spriteCoord":[1,4],"name_i18n":{"ja":"破損装置","en":"Damaged Device","zh":"破损装置","ko":"파손된 장치"}},"value":"3.34"},{"name":"ブドウ糖","item":{"itemId":"30021","name":"代糖","sortId":100027,"rarity":0,"itemType":"MATERIAL","spriteCoord":[2,1],"name_i18n":{"ja":"ブドウ糖","en":"Sugar Substitute","zh":"代糖","ko":"대체당"}},"value":"2.50"},{"name":"源岩鉱","item":{"itemId":"30011","name":"源岩","sortId":100015,"rarity":0,"itemType":"MATERIAL","spriteCoord":[4,0],"name_i18n":{"ja":"源岩鉱","en":"Orirock","zh":"源岩","ko":"원암"}},"value":"1.49"}]}]},
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
          requireLmb: false
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
              for (let [name, value] of Object.entries(el.items)) {
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
              for (let [name, value] of Object.entries(el.materials)) {
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
              for (let {name, value} of el.items) {
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
            Console.log(data)
            this.$set(this.calculation, "data", data);
            this.calculation.done = true
          })
          .catch((err) => {
            Console.error(err)
            snackbar.networkError()
          })
          .finally(() => {
            this.calculation.pending = false;
          })
      },
      // fontSize (v) {
      //   return {fontSize: `${(16 + (v.toString().length * -1.8)) * (document.body.clientWidth / 800)}px`}
      //   // return {fontSize: `${2 - (v.toString().length - 1) * 0.5}ch`}
      // },
      importToItemsData() {
        let imported;
        try {
          imported = JSON.parse(this.importJson);
        } catch (e) {
          Console.error("json error", e)
          snackbar.launch("error", 5000, "planner.import.jsonError", {
            error: e.toString()
          });
          return
        }
        let convertedImported = [];
        for (const itemData of imported) {
          if (!(itemData.hasOwnProperty("need") && Number.isInteger(itemData.need) && itemData.need >= 0 &&
            itemData.hasOwnProperty("have") && Number.isInteger(itemData.have) && itemData.have >= 0)) {
            Console.warn("one of the item data is invalid. not importing this and continue to the next one (reason: need or have invalid): ", itemData)
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
              Console.warn("one of the item data is invalid. not importing this and continue to the next one (reason: no id and name): ", itemData)
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
            Console.warn("no item found with", item);
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
        console.log(itemId)
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
  }
  ::v-deep .number-input-theme .number-input__button:hover {
    transform: scale(1.12);
  }
  ::v-deep .number-input-theme .number-input__button:active {
    transform: scale(1.05);
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
    width: 75%;
  }
  ::v-deep .number-input-theme--dense .number-input__button {
    width: 20px !important;
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

</style>