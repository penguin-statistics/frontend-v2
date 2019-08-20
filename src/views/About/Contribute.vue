<i18n>
  {
    "zh": {
      "contribute": {
        "repo": "项目仓库：",
        "frontend": "前端",
        "backend": "后端",
        "contribute_0": "如果您有以下一项或多项经验，愿意为企鹅数据贡献自己的一份力量，请加QQ群：747099627",
        "contribute_1": "本项目为无偿开源项目",
        "skills": {
          "skill_0": "网站前端开发 Vue.js",
          "skill_1": "网站后端开发 Java Spring Boot、MongoDB",
          "skill_2": "网站运维",
          "skill_3": "UI/UX设计",
          "skill_4": "数据统计分析"
        }
      }
    },
    "en": {
      "contribute": {
        "repo": "Project repositories: ",
        "frontend": "Front End",
        "backend": "Back End",
        "contribute_0": "If you have experience with any of the following skills, and want to contribute to Penguin Statistics, please add QQ group: 747099627.",
        "contribute_1": "This is a nonprofit and open source project",
        "skills": {
          "skill_0": "Front End Development (Vue.js)",
          "skill_1": "Back End Development (Java Spring Boot, MongoDB)",
          "skill_2": "DevOps",
          "skill_3": "UI/UX Design",
          "skill_4": "Data Analysis"
        }
      }
    },
    "ja": {
      "contribute": {
        "repo": "プロジェクトリポジトリ：",
        "frontend": "フロントエンド",
        "backend": "バックエンド",
        "contribute_0": "以下のような開発の経験があるのであれば、Penguin Statisticsに自身の力を使ってみませんか？右記のQQグループを追加してください：747099627",
        "contribute_1": "本プロジェクトは無償のオープンソースプロジェクトです",
        "skills": {
          "skill_0": "フロントエンド開発 Vue.js",
          "skill_1": "バックエンド開発 Java Spring Boot、MongoDB",
          "skill_2": "DevOps",
          "skill_3": "UI/UXデザイン",
          "skill_4": "データ統計解析"
        }
      }
    }
  }
</i18n>

<template>
  <v-card class="mx-auto bkop-light">
    <v-card-title>
      <span>
        {{ $t('contribute.repo') }}
        <v-chip
          class="ma-2"
          color="primary"
          text-color="white"
          @click="goToHref('https://github.com/penguin-statistics/frontend-v2')"
        >
          {{ $t('contribute.frontend') }}
          <v-icon right>mdi-github-circle</v-icon>
        </v-chip>
      </span>
      <span>
        <v-chip
          class="ma-2"
          color="primary"
          text-color="white"
          @click="goToHref('https://github.com/penguin-statistics/backend')"
        >
          {{ $t('contribute.backend') }}
          <v-icon right>mdi-github-circle</v-icon>
        </v-chip>
      </span>
    </v-card-title>

    <v-card-title>
      <div>{{ $t('contribute.contribute_0') }}</div>
    </v-card-title>

    <v-card-title>
      <div>
        <span>
          *
        </span>
        {{ $t('contribute.contribute_1') }}
      </div>
    </v-card-title>

    <v-card-title>
      <v-layout
        align-start
        justify-center
        column
        fill-height
      >
        <v-list class="transparent">
          <template v-for="(skill, key) in skills">
            {{ skill }}
            <v-divider
              v-if="key !== 'others'"
              :key="key"
            />
          </template>
        </v-list>
      </v-layout>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'Contribute',
  data() {
    return {
      skills: {
        'frontend': this.$t('contribute.skills.skill_0'),
        'backend': this.$t('contribute.skills.skill_1'),
        'maintenance': this.$t('contribute.skills.skill_2'),
        'design': this.$t('contribute.skills.skill_3'),
        'analysis': this.$t('contribute.skills.skill_4'),
        'others': '...'
      }
    }
  },
  methods: {
    goToHref(href) {
      window.open(href)
    }
  }
}
</script>
