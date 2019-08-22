<i18n>
  {
    "zh": {
      "contribute": {
        "repo": "项目仓库",
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
        "repo": "Project Repositories",
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
        "repo": "プロジェクトリポジトリ",
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
  <v-card class="bkop-light pa-4">
    <h1 class="headline">
      {{ $t('menu.about.contribute') }}
      <span class="caption">
        * {{ $t('contribute.contribute_1') }}
      </span>
    </h1>

    <v-list
      dense
      class="mt-2 transparent outline"
    >
      <v-list-tile>
        <v-list-tile-content>
          <span class="subheading">
            {{ $t('contribute.repo') }}
          </span>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-layout
            align-center
            justify-end
            wrap
            fill-height
          >
            <v-btn
              href="https://github.com/penguin-statistics/frontend-v2"
              target="_blank"
              class="mx-2"
              flat
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
              class="mx-2"
              flat
            >
              {{ $t('contribute.backend') }}
              <v-icon right>
                mdi-github-circle
              </v-icon>
            </v-btn>
          </v-layout>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-divider class="my-3" />

    <blockquote class="blockquote">
      {{ $t('contribute.contribute_0') }}
    </blockquote>

    <ul class="ml-4">
      <li
        v-for="(skill, key) in skills"
        :key="key"
      >
        {{ skill }}
      </li>
    </ul>
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

<style scoped>
  .outline {
    box-shadow: 0 0 0 2px rgba(0,0,0,0.54) !important;
    border-radius: 4px
  }
</style>
