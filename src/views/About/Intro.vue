<i18n>
{
	"en": {
		"intro": {
			"intro_0": "Welcome to Penguin Statistics!",
			"intro_1": "Penguin Statistics is the Department of Data Analysis of Penguin Logistics. We devote ourselves to item drop analysis.",
			"intro_2": "Item drop data are submitted by the players. Our team conduct comprehensive review on the submitted data to reduce the impact of false reports."
		}
	},
	"ja": {
		"intro": {
			"intro_0": "ペンギン急便データ統計処理部門へようこそ！",
			"intro_1": "Penguin Statisticsはペンギン急便のデータ処理部門であり(嘘)、各作戦での素材ドロップの統計分析を行っています。",
			"intro_2": "現在ほとんどのデータはユーザーの手によって手動でアップロードされており、誤った情報や誤った情報による影響を最小限に抑えるためにペンギンデータアナライズチームはドロップアイテムについて様々な確度から審査しています。"
		}
	},
	"ko": {
		"intro": {
			"intro_0": "펭귄 물류 데이터 분석 부서에 오신것을 환영합니다!",
			"intro_1": "저희는 펭귄 물류의 데이터 분석 부서입니다. 저희는 아이템 드랍에 대한 분석을 맡고 있습니다.",
			"intro_2": "대부분의 데이터는 박사들에 의해 수동으로 제출되었으며, 저희 부서는 잘못된 보고서나 잘못된 결과를 방지하기 위해 전체적인 데이터 검사를 실시하고 있습니다."
		}
	},
	"zh": {
		"intro": {
			"intro_0": "欢迎来到企鹅物流数据统计！",
			"intro_1": "企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于各作战素材掉落统计分析。",
			"intro_2": "目前绝大部分数据由玩家手动汇报，为了尽量减少谎报、误报对结果的影响，企鹅数据团队会对掉落进行多方位的审查。"
		}
	}
}
</i18n>

<template>
  <v-card 
    elevation="0"
    class="transparent pt-0 my-1"
  >
    <v-row
      align="center"
      justify="start"
    >
      <v-card-title
        class="justify-start"
        style="word-break:normal"
      >
        <v-img
          :src="cdnResource('/logos/penguin_stats_logo.png')"
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
      </v-card-title>
    </v-row>
  </v-card>
</template>

<script>
import CDN from "@/mixins/CDN";

export default {
  name: 'Intro',
  mixins: [CDN]
}
</script>

<style scoped>

</style>
