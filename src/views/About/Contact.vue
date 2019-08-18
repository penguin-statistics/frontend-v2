<template>
  <v-card class="mx-auto bkop-light">
    <v-card-title>
      <div>您可以通过以下方式联系我们：</div>
    </v-card-title>

    <v-card-title>
      <v-layout
        column
        wrap
      >
        <div>
          <span>
            <v-chip
              class="ma-2"
              color="primary"
              text-color="white"
              @click="$router.push({name: 'AboutMembers'})"
            >
              团队成员
              <v-icon right>mdi-account-multiple</v-icon>
            </v-chip>
            页面内的各种联系方式
          </span>
        </div>

        <div>
          <span>
            <v-chip
              class="ma-2"
              color="primary"
              text-color="white"
              @click="goToHref('https://github.com/penguin-statistics/frontend-v2/issues')"
            >
              Github
              <v-icon right>mdi-github-circle</v-icon>
            </v-chip>
            仓库的Issue
          </span>
        </div>

        <div>
          <span>
            <v-chip
              class="ma-2"
              color="primary"
              text-color="white"
              @click="goToHref('https://bbs.nga.cn/read.php?tid=17340880')"
            >
              NGA讨论帖
              <v-icon right>mdi-share</v-icon>
            </v-chip>
          </span>
        </div>
      </v-layout>
    </v-card-title>
  </v-card>
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
