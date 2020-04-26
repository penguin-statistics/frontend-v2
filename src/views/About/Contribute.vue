<i18n>
{
	"en": {
		"contribute": {
			"backend": "Backend",
			"contribute_0": "If you have experience with any of the following skills, and want to contribute to Penguin Statistics, please feel free to contact us.",
			"contribute_1": "This is a nonprofit and open source project",
			"frontend": "Frontend",
			"qq_group": "QQ Group: "
		}
	},
	"ja": {
		"contribute": {
			"backend": "バックエンド",
			"contribute_0": "以下のような開発の経験があるのであれば、Penguin Statisticsに自身の力を使ってみませんか？",
			"contribute_1": "本プロジェクトは無償のオープンソースプロジェクトです",
			"frontend": "フロントエンド",
			"qq_group": "QQグループ："
		}
	},
	"ko": {
		"contribute": {
			"backend": "백엔드",
			"contribute_0": "다음 기술중 하나라도 경험이 있고, 펭귄 물류에 기여하고자 한다면.",
			"contribute_1": "펭귄 물류 데이터 분석 부서는 비영리 오픈소스 프로젝트 입니다",
			"frontend": "프론트엔드",
			"qq_group": "QQ 그룹 : "
		}
	},
	"zh": {
		"contribute": {
			"backend": "后端",
			"contribute_0": "如果您有以下一项或多项经验，愿意为企鹅数据贡献自己的一份力量，欢迎联系我们。",
			"contribute_1": "本项目为无偿开源项目",
			"frontend": "前端",
			"qq_group": "QQ群："
		}
	}
}
</i18n>

<template>
  <v-card
    elevation="5"
    class="bkop-light pa-6"
    style="height: 100%"
  >
    <h1 class="headline">
      {{ $t('menu.about.contribute') }}
    </h1>
    <div class="caption my-2">
      * {{ $t('contribute.contribute_1') }}
    </div>

    <v-row
      class="mx-0 py-1 transparent outline"
      align="center"
      justify="center"
    >
      <v-btn
        href="https://github.com/penguin-statistics/frontend-v2"
        target="_blank"
        :class="{
          'mx-2': $vuetify.breakpoint.smAndUp,
          'mx-1': $vuetify.breakpoint.xsOnly
        }"
        text
      >
        {{ $t('contribute.frontend') }}
        <v-icon right>
          mdi-github-circle
        </v-icon>
      </v-btn>

      <v-divider vertical />

      <v-btn
        href="https://github.com/penguin-statistics/backend"
        target="_blank"
        :class="{
          'mx-2': $vuetify.breakpoint.smAndUp,
          'mx-1': $vuetify.breakpoint.xsOnly
        }"
        text
      >
        {{ $t('contribute.backend') }}
        <v-icon right>
          mdi-github-circle
        </v-icon>
      </v-btn>
    </v-row>

    <v-divider class="my-4" />

    <p class="subtitle-1 pl-0">
      {{ $t('contribute.contribute_0') }}
    </p>

    <ul class="ml-2 mb-4">
      <li>
        <v-icon
          small
        >
          mdi-penguin
        </v-icon>
        {{ $t('contribute.qq_group') }}747099627
      </li>
      <li>
        <v-chip
          link
          small
          href="https://discord.gg/uEXJcue"
          target="_blank"
        >
          <v-icon
            left
            small
          >
            mdi-discord
          </v-icon>
          Discord
        </v-chip>
      </li>
    </ul>

    <ul class="ml-2">
      <li
        v-for="(skill, key) in skills"
        :key="key"
        class="subtitle-2"
      >
        {{ $t(`contribute.skills.${skill}`) }}
      </li>
    </ul>
  </v-card>
</template>

<script>
export default {
  name: 'Contribute',
  data() {
    return {
      skills: [
        'frontend',
        'backend',
        'maintenance',
        'design',
        'analysis',
        'others'
      ]
    }
  }
}
</script>

<style scoped>
  .outline {
    box-shadow: 0 0 0 2px rgba(0,0,0,0.54) !important;
    border-radius: 4px
  }
</style>
