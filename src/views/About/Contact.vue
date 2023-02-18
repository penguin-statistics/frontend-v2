<i18n>
{
	"en": {
		"contact": {
			"title": "Contact us",
			"body": "If you have any questions or suggestions, feel free to contact the webmaster. (English is fine)",
			"contributor": "Team Members Page",
			"github": "GitHub Issues",
			"nga": "NGA Thread"
		}
	},
	"ja": {
		"contact": {
			"title": "連絡先",
			"body": "ご質問、ご要望などございましたら、管理人さんにお気軽にお問い合わせください。（日本語でもOKです）",
			"contributor": "制作協力者ページ",
			"github": "GitHub Issues",
			"nga": "NGA スレッド"
		}
	},
	"ko": {
		"contact": {
			"title": "문의",
			"body": "질문이나 건의사항이 있다면, 언제든지 관리자에게 연락하여 주십시오.",
			"contributor": "팀 구성원 페이지",
			"github": "GitHub Issues",
			"nga": "NGA (포럼) 스레드"
		}
	},
	"zh": {
		"contact": {
			"title": "联系我们",
			"body": "如果您有任何问题或建议，欢迎联系站长。",
			"contributor": "团队成员页面",
			"github": "GitHub Issues",
			"nga": "NGA 讨论帖"
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
      {{ $t('contact.title') }}
    </h1>
    <v-row>
      <v-col cols="12">
        {{ $t('contact.body') }}
      </v-col>
      <v-chip
        class="mx-2 my-1"
        color="secondary"
        text-color="white"
        :to="{name: 'AboutMembers'}"
      >
        {{ $t('contact.contributor') }}
        <v-icon
          right
        >
          mdi-account-group
        </v-icon>
      </v-chip>
      <v-chip
        class="mx-2 my-1"
        color="secondary"
        text-color="white"
        href="https://github.com/penguin-statistics/frontend-v2/issues"
        target="_blank"
        rel="noopener"
      >
        {{ $t('contact.github') }}
        <v-icon
          right
        >
          mdi-github-circle
        </v-icon>
      </v-chip>
      <v-chip
        class="mx-2 my-1"
        color="secondary"
        text-color="white"
        href="https://bbs.nga.cn/read.php?tid=17340880"
        target="_blank"
        rel="noopener"
      >
        {{ $t('contact.nga') }}
        <v-icon
          right
        >
          mdi-forum
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
  }
}
</script>
