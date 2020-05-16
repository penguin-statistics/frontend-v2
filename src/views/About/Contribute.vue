<i18n>
  {
    "en": {
      "contribute": {
        "backend": "Backend",
        "contribute_0": "If you have experience with any of the following skills, and want to contribute to Penguin Statistics, please feel free to contact us.",
        "contribute_1": "This is a nonprofit and open source project",
        "frontend": "Frontend",
        "qq_group": "QQ Group: "
      },
      "link": {
        "api": "API Docs",
        "docs": "Dev. Docs"
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
      },
      "link": {
        "api": "API 文档",
        "docs": "开发者中心"
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

    <p class="subtitle-1 pl-0 mt-2">
      {{ $t('contribute.contribute_0') }}
    </p>

    <ul class="ml-2 mb-2">
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

    <v-divider class="my-2" />

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        v-for="link in links"
        :key="link.title"
        cols="6"
      >
        <BackdropCard
          hover
          :href="link.url"
          target="_blank"
        >
          <template v-slot:backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <v-icon
            x-large
            style="opacity: 0.9"
          >
            {{ link.icon }}
          </v-icon>

          <h2 class="heading my-1">
            {{ $t(link.title) }} <v-icon
              v-if="link.external"
              small
            >
              mdi-open-in-new
            </v-icon>
          </h2>
        </BackdropCard>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BackdropCard from "@/components/global/BackdropCard";

export default {
  name: 'Contribute',
  components: {
    BackdropCard
  },
  data() {
    return {
      skills: [
        'frontend',
        'backend',
        'maintenance',
        'design',
        'analysis'
      ],
      links: [
        {
          url: "https://developer.penguin-stats.io/docs/",
          icon: "mdi-api",
          title: "link.api",
          external: true
        },
        {
          url: "https://developer.penguin-stats.io",
          icon: "mdi-dev-to",
          title: "link.docs",
          external: true
        }
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
