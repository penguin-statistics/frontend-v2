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
            {{ key }} {{ text }}
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
        '2019-07-27': {
          '1.': '首页、页脚重新规划'
        },
        '2019-07-18': {
          '1.': '整合ArkPlanner',
          '2.': '优化页面加载速度'
        },
        '2019-07-16': {
          '1.': '完善用户ID机制，已经可以正常查看个人数据了',
          '2.': '改良手机端的掉落数据展示'
        },
        '2019-07-01': {
          '1.': '加强掉落汇报审核'
        },
        '2019-06-07': {
          '1.': '重构代码，ID标准化，方便与其他平台、工具对接'
        },
        '2019-06-02': {
          '1.': '增加本地掉落统计，之后的版本会提供清空、导入导出等功能'
        },
        '2019-05-30': {
          '1.': '更换网站logo'
        },
        '2019-05-28': {
          '1.': '添加赤金、经验书掉落，其样本数从添加之时开始累计',
          '2.': '为月底活动做准备'
        },
        '2019-05-26': {
          '1.': '统计结果添加理智消耗',
          '2.': '首页添加群号'
        },
        '2019-05-25': {
          '1.': '统计结果增加排序功能。（筛选正在做）'
        },
        '2019-05-24': {
          '1.': '离开统计结果页面再回去时，保留之前所选的作战/道具。',
          '2.': '统计结果（按道具）页面突出所选道具。',
          '3.': '统计结果表格内，可以单击作战名或者素材跳转到相应的统计结果。'
        },
        '2019-05-23': {
          '1.': 'Penguin Statistics上线。',
          '2.': '所选作战是S开头时，不显示突袭。',
          '3.': '单次掉落汇报增加警示标语。'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>