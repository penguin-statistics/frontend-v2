<i18n>
  {
    "zh": {
      "contact": {
        "contact_0": "您可以通过以下方式联系我们：",
        "contributor": "团队成员页面",
        "contact_1": "页面内的各种联系方式",
        "github": "Github Issues",
        "nga": "NGA讨论帖"
      }
    },
    "en": {
      "contact": {
        "contact_0": "You can reach us in any of the following ways: ",
        "contributor": "Team Members Page",
        "contact_1": "Contact Information",
        "github": "Github Issues",
        "nga": "NGA Thread"
      }
    },
    "ja": {
      "contact": {
        "contact_0": "下記の手段から連絡をお願いいたします。",
        "contributor": "制作協力者ページ",
        "github": "Github Issues",
        "nga": "NGAスレッド"
      }
    }
  }
</i18n>

<template>
  <v-layout
    wrap
  >
    <h1 class="title">
      {{ $t('contact.contact_0') }}
    </h1>
    <p>
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
    </p>
  </v-layout>
<!--  <v-card class="mx-auto bkop-light">-->
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
