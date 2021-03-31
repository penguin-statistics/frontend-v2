<i18n>
{
	"en": {
		"intro": {
			"intro_0": "Welcome to ℝeunion Statistics!",
			"intro_1": "ℝeunion Statistics is the Department of Data Analysis of ℝeunion Movement. We devote ourselves to item inventory statistics.",
			"intro_2": "Item drop data are submitted by reunion members. Our leader will conduct comprehensive review on the submitted data to reduce the impact of false reports."
		}
	},
	"ja": {
		"intro": {
			"intro_0": "レユニオンデータ統計処理部門へようこそ！",
			"intro_1": "ℝeunion Statisticsはレユニオン・ムーブメントのデータ処理部門であり、各素材の在庫状況の統計を行っています。",
			"intro_2": "現在ほとんどのデータはレユニオンのメンバーたちの手によって手動でアップロードされており、誤った情報による影響を最小限に抑えるため、アップロードされた情報について多角的に審査しています。"
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
			"intro_0": "欢迎来到整合运动数据统计！",
			"intro_1": "整合运动数据统计（ℝeunion Statistics）是整合运动旗下数据处理部门，致力于各素材的库存统计。",
			"intro_2": "目前绝大部分数据由整合运动成员手动汇报，为了尽量减少谎报、误报对结果的影响，组长们会对掉落进行多方位的审查。"
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
      justify="center"
      justify-lg="start"
    >
      <v-card-title
        class="justify-start"
        style="word-break:normal"
      >
        <v-img
          :src="cdnDeliver($store.getters['ui/aprilFools'] ? '/logos/20210401/reunion_logo.png' : '/logos/20210401/reunion_future.png')"
          aspect-ratio="1"
          height="128px"
          width="128px"
          contain
          :position="$vuetify.breakpoint.mdAndDown ? 'center center' : 'left center'"
          class="my-6"
          :style="{'filter': (!$store.getters['ui/aprilFools'] && !dark) ? 'invert(1)' : null }"
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
import CDN from '@/mixins/CDN'
import Theme from "@/mixins/Theme";

export default {
  name: 'Intro',
  mixins: [CDN, Theme]
}
</script>

<style scoped>

</style>
