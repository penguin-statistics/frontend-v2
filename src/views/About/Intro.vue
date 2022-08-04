<i18n>
{
	"en": {
		"intro": {
			"intro_0": "Welcome to Penguin Statistics!",
			"intro_1": "Penguin Statistics is the Department of Data Analysis of Penguin Logistics. We devote ourselves to item drop analysis.",
      "intro_2": "The current Penguin Statistics dataset consists reports from manual reports, screenshot recognitions via website and uploads from automated tools via our public APIs. To ensure accuracy of the dataset, Penguin Statistics team will perform automatic, scheduled and manual dataset maintenances for various reasons.",
      "intro_3": "To ensure dataset transparency and list out dataset changes, Dataset Invalidation Transparency Report is now planned to be implemented."
		}
	},
	"ja": {
		"intro": {
			"intro_0": "ペンギン急便データ統計処理部門へようこそ！",
			"intro_1": "Penguin Statisticsはペンギン急便のデータ処理部門であり(嘘)、各作戦での素材ドロップの統計分析を行っています。",
			"intro_2": "現在ほとんどのデータはユーザーの手によって手動でアップロードされており、誤った情報による影響を最小限に抑えるため、アップロードされた情報について多角的に審査しています。"
		}
	},
	"ko": {
		"intro": {
			"intro_0": "펭귄 물류 데이터 분석 부서에 오신 것을 환영합니다!",
			"intro_1": "저희는 펭귄 물류의 데이터 분석 부서입니다. 저희는 아이템 드랍에 대한 분석을 맡고 있습니다.",
			"intro_2": "대부분의 데이터는 박사들에 의해 수동으로 제출되었으며, 저희 부서는 잘못된 보고서나 잘못된 결과를 방지하기 위해 전체적인 데이터 검사를 실시하고 있습니다."
		}
	},
	"zh": {
		"intro": {
			"intro_0": "欢迎来到企鹅物流数据统计！",
			"intro_1": "企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于明日方舟各素材的掉率统计。",
			"intro_2": "企鹅物流的现有数据集由玩家手动上报、截图识别与多方自动化工具自动上报合力维护。为了尽力保证数据集的准确性，企鹅物流数据团队会对掉落数据集进行多种方式的自动、定时及手动维护。",
      "intro_3": "为保证数据集透明度、向用户说明数据集更改，数据作废透明度报告已在计划中。"
		}
	}
}
</i18n>

<template>
  <v-card
    elevation="0"
    class="transparent pt-0 mb-1"
  >
    <v-row
      align="center"
      justify="center"
      justify-lg="start"
    >
      <v-card-title
        class="justify-start"
        style="word-break:normal"
      >
        <v-img
          :src="cdnDeliver('/logos/penguin_stats_logo.png')"
          aspect-ratio="1"
          height="128px"
          width="128px"
          contain
          :position="$vuetify.breakpoint.mdAndDown ? 'center center' : 'left center'"
          class="my-6"
        />
        <v-col cols="12">
          <h1
            :class="{
              'display-2': $vuetify.breakpoint.mdAndUp,
              'display-1': $vuetify.breakpoint.smAndDown
            }"
            class="font-weight-bold mb-4 display-1"
          >
            {{ $t('intro.intro_0') }}
          </h1>
          <p class="subtitle-1 line-height-wide">
            {{ $t('intro.intro_1') }}
            <br>
            {{ $t('intro.intro_2') }}
          </p>
        </v-col>

        <div
          cols="12"
          class="contrib-banner"
        >
          <div class="contrib-banner-inner">
            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/frontend-v2"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.frontend") }}</div>
                  <div class="overline degraded-opacity">
                    Vue 2
                  </div>
                </div>
              </div>
            </v-btn>

            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/frontend-next"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
              v-on="on"
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.frontendV4") }}</div>
                  <div class="overline degraded-opacity">
                    React 18
                  </div>
                </div>
              </div>
            </v-btn>


            <!-- <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/frontend-next"
              target="_blank"
              rel="noopener"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.frontend") }} Alpha <small>(锐意开发中)</small></div>
                  <div class="overline degraded-opacity">
                    React 18
                  </div>
                </div>
              </div>
            </v-btn> -->

            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/backend-next"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.backend") }}</div>
                  <div class="overline degraded-opacity">
                    Go 1.18
                  </div>
                </div>
              </div>
            </v-btn>

            <!-- <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/livehouse"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.livehouse") }}</div>
                  <div class="overline degraded-opacity">
                    Go 1.18
                  </div>
                </div>
              </div>
            </v-btn> -->

            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/recognizer"
              target="_blank"
              rel="noopener"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.recognizer") }}</div>
                  <div class="overline degraded-opacity">
                    C++17
                  </div>
                </div>
              </div>
            </v-btn>
          </div>
          <div class="caption px-3 pt-2 pb-1 degraded-opacity">
            {{ $t('contribute.caption') }}
          </div>
        </div>
      </v-card-title>
    </v-row>
  </v-card>
</template>

<script>
import CDN from '@/mixins/CDN'

export default {
  name: 'Intro',
  mixins: [CDN]
}
</script>

<style scoped>
.contrib-banner {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2) !important;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  margin: 0 8px;
  max-width: 800px;

  background: rgba(240, 240, 240, .05);
  color: inherit;
  /* box-shadow: none; */
  backdrop-filter: blur(20px) brightness(1.2);
}
.theme--dark .contrib-banner {
  background: rgba(0, 0, 0, .05);
  backdrop-filter: blur(20px) brightness(0.8);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.contrib-banner-inner {
  display: inline-block;
}

/* .contrib-banner-inner > * {
  display: inline-block;
} */

@media (max-width: 770px) {
  /* .contrib-banner-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 4px;
  }

  .contrib-banner-inner > * {
    justify-content: start;
  } */

  small {
    display: none;
  }
}

</style>
