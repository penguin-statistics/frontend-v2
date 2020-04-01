<template>
  <v-timeline
    dense
    align-top
  >
    <v-timeline-item
      v-for="item in logs"
      :key="item.version"
      :color="item.active ? 'green' : 'grey darken-1'"
      :icon="item.active ? 'mdi-check' : 'mdi-history'"
      :small="!item.active"
      fill-dot
      class="changelog--item"
    >
      <v-card
        class="bkop-light"
        :class="{'elevation-12': item.active}"
      >
        <v-card-title
          class="py-2 pl-4 pr-2"
        >
          <span
            class="title"
            v-text="item.version"
          />

          <!--          <v-icon-->
          <!--            v-if="item.active"-->
          <!--            right-->
          <!--          >-->
          <!--            mdi-check-circle-->
          <!--          </v-icon>-->

          <v-spacer />

          <span
            class="caption mr-2"
            :title="item.date"
            v-text="formatTime(item.date)"
          />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <ol>
            <li
              v-for="(text, key) in item.changes"
              :key="key"
            >
              {{ text }}
            </li>
          </ol>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import anime from "animejs";
import timeFormatter from "@/utils/timeFormatter";

export default {
  name: 'Changelog',
  data() {
    return {
      index: null,
      logs: [
        {
          version: "v1.1.5",
          date: "2020-04-02T12:00:00Z",
          changes: [
            "内部重构：优化应用启动时的模块初始化",
            "修复：Google Analytics 未上报版本的错误",
            "修复：重新使用 SaaS 版 Sentry",
          ]
        },
        {
          version: "v1.1.5",
          date: "2020-03-31T10:31:00Z",
          changes: [
            "添加：User ID 说明",
            "重构：更新日志页面",
            "修复：有时无法自动隐藏 Crisp 的错误",
            "修复：重新使用 SaaS 版 Sentry",
            "若干错误修复与性能优化"
          ]
        },
        {
          version: "v1.1.4",
          date: "2020-03-27T14:23:30Z",
          changes: [
            "修复：Logo 显示位置",
            "添加：于首页的客服入口",
            "若干错误修复与性能优化"
          ]
        },
        {
          version: "v1.1.3",
          date: "2020-03-08T21:58:09Z",
          changes: [
            "重构：ArkPlanner"
          ]
        },
        {
          version: "v1.1.2",
          date: "2020-02-27T06:32:40Z",
          changes: [
            "添加：韩语支持",
            "添加：载入界面"
          ]
        },
        {
          version: "v1.1.1",
          date: "2020-02-08T21:14:04Z",
          changes: [
            "优化：“岁过华灯” 等一系列开箱子的汇报支持批量上传"
          ]
        },
        {
          version: "v1.1.0",
          date: "2020-02-07T19:17:19Z",
          changes: [
            "重构：作战选择界面",
            "添加：英语支持",
            "添加：日语支持",
            "优化：暂时移除过期的友链"
          ]
        },
        {
          version: "v1.0.5",
          date: "2019-11-06T00:10:26Z",
          changes: [
            "修复：上传总数统计有时不正确的问题",
            "优化：Windows 操作系统下滚动条样式"
          ]
        },
        {
          version: "v1.0.4",
          date: "2019-09-28T03:53:55Z",
          changes: [
            "修复：图片显示不正常的问题"
          ]
        },
        {
          version: "v1.0.3",
          date: "2019-08-28T01:13:23Z",
          changes: [
            "修复：上传后掉落未清空的bug",
            "修复：活动\"火蓝之心\"新道具的相关bug",
            "添加：用户注销确认窗口"
          ]
        },
        {
          version: "v1.0.2",
          date: "2019-08-27T00:34:20Z",
          changes: [
            "优化：页面加载速度",
            "添加：返回旧版的入口",
            "优化：掉落汇报异常提示"
          ]
        },
        {
          version: "v1.0.1",
          date: "2019-08-24T04:31:54Z",
          changes: [
            "修复：无法进入 ArkPlanner 的问题",
            "修复：上传检测机制异常"
          ]
        },
        {
          version: "v1.0.0",
          date: "2019-08-23T19:39:35Z",
          changes: [
            "新版本上线"
          ]
        }
      ].map((el, i) => {
        if (i === 0) el.active = true;
        return el
      })
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
  methods: {
    formatTime(t) {
      return timeFormatter.dayjs(t).fromNow()
    }
  },
}
</script>

<style scoped>
</style>