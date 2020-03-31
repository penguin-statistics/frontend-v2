<i18n>
  {
    "zh": {
      "contribute": {
        "frontend": "前端",
        "backend": "后端",
        "qq_group": "QQ群："
      }
    },
    "en": {
      "contribute": {
        "frontend": "Frontend",
        "backend": "Backend",
        "qq_group": "QQ Group: "
      }
    },
    "ja": {
      "contribute": {
        "frontend": "フロントエンド",
        "backend": "バックエンド",
        "qq_group": "QQグループ："
      }
    },
    "ko": {
      "contribute": {
        "frontend": "프론트엔드",
        "backend": "백엔드",
        "contribute_0": "다음 기술중 하나라도 경험이 있고, 펭귄 물류에 기여하고자 한다면.",
        "contribute_1": "펭귄 물류 데이터 분석 부서는 비영리 오픈소스 프로젝트 입니다",
        "qq_group": "QQ 그룹 : "
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
          href="https://discord.gg/raQjSpq"
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

    <ul class="ml-4">
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
