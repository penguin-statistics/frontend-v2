<i18n>
  {
    "zh": {
      "contact": {
        "contact_0": "联系我们",
        "contact_2": "如果您有任何问题或建议，欢迎联系站长。",
        "contributor": "团队成员页面",
        "contact_1": "页面内的各种联系方式",
        "github": "Github Issues",
        "nga": "NGA讨论帖"
      }
    },
    "en": {
      "contact": {
        "contact_0": "Contact us",
        "contact_2": "If you have any questions or concerns, feel free to contact the webmaster. (English is OK)",
        "contributor": "Team Members Page",
        "contact_1": "Contact Information",
        "github": "Github Issues",
        "nga": "NGA Thread"
      }
    },
    "ja": {
      "contact": {
        "contact_0": "連絡先",
        "contact_2": "ご質問、ご要望などございましたら、管理人さんにお気軽にお問い合わせください。（日本語でもOKです）",
        "contributor": "制作協力者ページ",
        "github": "Github Issues",
        "nga": "NGAスレッド"
      }
    }
  }
</i18n>

<template>
  <v-card class="bkop-light pa-6">
    <h1 class="headline">
      {{ $t('contact.contact_0') }}
    </h1>
    <v-row>
      <v-col cols="12">
        {{ $t('contact.contact_2') }}
      </v-col>
      <v-chip
        class="mx-2"
        color="secondary"
        text-color="white"
        @click="$router.push({name: 'AboutMembers'})"
      >
        {{ $t('contact.contributor') }}
        <v-icon right>
          mdi-account-multiple
        </v-icon>
      </v-chip>
      <v-chip
        class="mx-2"
        color="secondary"
        text-color="white"
        @click="goToHref('https://github.com/penguin-statistics/frontend-v2/issues')"
      >
        {{ $t('contact.github') }}
        <v-icon right>
          mdi-github-circle
        </v-icon>
      </v-chip>
      <v-chip
        class="mx-2"
        color="secondary"
        text-color="white"
        @click="goToHref('https://bbs.nga.cn/read.php?tid=17340880')"
      >
        {{ $t('contact.nga') }}
        <v-icon right>
          mdi-share
        </v-icon>
      </v-chip>
    </v-row>
  </v-card>
  <!--
        <v-card
        class="mx-auto bkop-light"
      >-->
  <!--    <v-card-title>-->
  <!--      <div>{{ $t('contact.contact_0') }}</div>-->
  <!--    </v-card-title>-->

  <!--    <v-card-title>-->
  <!--      <v-layout-->
  <!--        column-->
  <!--        wrap-->
  <!--      >-->
  <!--        <div>-->
  <!--          <span>-->
  <!--            <v-chip-->
  <!--              class="ma-2"-->
  <!--              color="primary"-->
  <!--              text-color="white"-->
  <!--              @click="$router.push({name: 'AboutMembers'})"-->
  <!--            >-->
  <!--              {{ $t('contact.contributor') }}-->
  <!--              <v-icon right>mdi-account-multiple</v-icon>-->
  <!--            </v-chip>-->
  <!--            {{ $t('contact.contact_1') }}-->
  <!--          </span>-->
  <!--        </div>-->

  <!--        <div>-->
  <!--          <span>-->
  <!--            <v-chip-->
  <!--              class="ma-2"-->
  <!--              color="primary"-->
  <!--              text-color="white"-->
  <!--              @click="goToHref('https://github.com/penguin-statistics/frontend-v2/issues')"-->
  <!--            >-->
  <!--              {{ $t('contact.github') }}-->
  <!--              <v-icon right>mdi-github-circle</v-icon>-->
  <!--            </v-chip>-->
  <!--            {{ $t('contact.contact_2') }}-->
  <!--          </span>-->
  <!--        </div>-->

  <!--        <div>-->
  <!--          <span>-->
  <!--            <v-chip-->
  <!--              class="ma-2"-->
  <!--              color="primary"-->
  <!--              text-color="white"-->
  <!--              @click="goToHref('https://bbs.nga.cn/read.php?tid=17340880')"-->
  <!--            >-->
  <!--              {{ $t('contact.nga') }}-->
  <!--              <v-icon right>mdi-share</v-icon>-->
  <!--            </v-chip>-->
  <!--          </span>-->
  <!--        </div>-->
  <!--      </v-layout>-->
  <!--    </v-card-title>-->
  <!--  </v-card>-->
</template>

<script>
export default {
  name: 'Contact',
  methods: {
    goToHref(href) {
      window.open(href)
    }
  }
}
</script>
