<template>
  <v-timeline
    dense
    align-top
  >
    <v-timeline-item
      v-for="(log, dateKey) in logs"
      :key="dateKey"
      right
      icon="mdi-book-variant"
      class="changelog--item"
      fill-dot
    >
      <v-card
        class="bkop-light"
        elevation="5"
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
import anime from "animejs";

export default {
  name: 'Changelog',
  data() {
    return {
      logs: {
        'v1.1.2': [
          '加入韩语翻译',
          '增加载入界面'
        ],
        'v1.1.1': [
          '“岁过华灯”等一系列开箱子的汇报支持批量上传'
        ],
        'v1.1.0': [
          '作战选择界面重做',
          '对多语言更友好的支持',
          '暂时移除过期的友链',
        ],
        'v1.0.5': [
          '修复上传总数统计有时不正确的问题',
          '调整Windows操作系统下滚动条样式'
        ],
        'v1.0.4': [
          '修复图片显示不正常的问题'
        ],
        'v1.0.3': [
          '修复上传后掉落未清空的bug',
          '修复活动"火蓝之心"新道具的相关bug',
          '用户注销增加确认窗口'
        ],
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
  },
  mounted () {
    anime({
      targets: '.changelog--item',
      translateY: [48, 0],
      opacity: [0, 1],
      duration: 425,
      delay: (el, i) => i * 50,
      easing: "easeOutQuint"
    });
  },
}
</script>

<style scoped>
</style>