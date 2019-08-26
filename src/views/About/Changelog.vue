<template>
  <v-timeline
    :dense="$vuetify.breakpoint.smAndDown"
    align-top
  >
    <v-timeline-item
      v-for="(log, dateKey) in logs"
      :key="dateKey"
      icon="mdi-book-variant"
      fill-dot
    >
      <v-card
        class="bkop-light"
        data-aos="fade"
      >
        <v-card-title class="title">
          {{ dateKey }}
        </v-card-title>
        <v-card-text class="text--primary">
          <p
            v-for="(text, key) in log"
            :key="key"
          >
            {{ ++key }}. {{ text }}
          </p>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  name: 'Changelog',
  data() {
    return {
      logs: {
        'v1.0.2': [
          '优化页面加载速度',
          '提供返回旧版的入口',
          '优化掉落汇报异常提示'
        ],
        'v1.0.1': [
          '修复无法进入ArkPlanner的问题',
          '修复上传检测机制异常'
        ],
        'v1.0.0': [
          '新版本上线'
        ]
      }
    }
  }
}
</script>

<style scoped>
</style>