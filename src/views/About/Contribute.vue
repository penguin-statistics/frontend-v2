<template>
  <v-card
    class="mx-auto bkop-light"
  >
    <v-card-title>
      <span>
        项目仓库：
        <v-chip
          class="ma-2"
          color="primary"
          text-color="white"
          @click="goToHref('https://github.com/penguin-statistics/frontend-v2')"
        >
          前端
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
          后端
          <v-icon right>mdi-github-circle</v-icon>
        </v-chip>
      </span>
    </v-card-title>

    <v-card-title>
      <div>如果您有以下一项或多项经验，愿意为企鹅数据贡献自己的一份力量，请加QQ群：747099627</div>
    </v-card-title>

    <v-card-title>
      <div>*本项目为无偿开源项目</div>
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
          'frontend': '网站前端开发 Angular (正在用Vue.js重写)',
          'backend': '网站后端开发 Java Spring Boot、MongoDB',
          'maintenance': '网站运维',
          'design': 'UI/UX设计',
          'analysis': '数据统计分析',
          'others': '...'
        }
      }
    },
    methods: {
      goToHref (href) {
        window.open(href)
      }
    }
  }
</script>
