<template>
  <v-timeline
    dense
    align-top
  >
    <v-timeline-item
      v-for="item in logs"
      :key="item.version"
      :color="item.color"
      :icon="item.icon"
      :small="!item.active"
      fill-dot
      class="changelog--item force-not-lang-font"
    >
      <v-card
        class="bkop-light"
        :class="{'elevation-12': item.value}"

        @click.native="item.value = !item.value"
      >
        <v-card-title
          class="py-2 pl-4 pr-2"
        >
          <span
            class="title"
          >
            <span
              v-if="item.future"
              class="caption"
            >
              正在开发
            </span>

            {{ item.version }}
          </span>

          <v-spacer />

          <v-btn
            :color="item.value && item.future ? 'primary' : ''"
            :input-value="item.value"
            :ripple="false"
            class="ma-0"
            text
            @click.stop="item.value = !item.value"
          >
            <span
              class="mr-2"
              v-text="formatTime(item.date)"
            />

            <v-icon
              small
              v-text="item.value ? '$close' : 'mdi-calendar'"
            />
          </v-btn>
        </v-card-title>

        <v-expand-transition>
          <div v-if="item.value">
            <v-divider />

            <v-card-subtitle
              v-if="item.future"
              class="subtitle-1"
            >
              版本特性一览
            </v-card-subtitle>

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
          </div>
        </v-expand-transition>
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
          future: true,
          version: "v3.0.0",
          date: "2020-05-25T08:00:00Z",
          changes: [
            "将添加：多服务器数据源切换支持",
            "将添加：物品掉落分时查询",
            "将添加：高级查询功能",
            "将添加：数据导出功能",
            "将优化：ArkPlanner 整体体验",
            "将内部重构：所有数据将引入版本概念，从底层保证数据一致性",
          ]
        },
        {
          active: true,
          version: "v1.1.10",
          date: "2020-04-24T01:00:00Z",
          changes: [
            "添加：于 Planner 内添加更多外服排除关卡 (DM-* 关卡)",
            "修复：Google Analytics Screenview Tracking 问题",
            "修复：网站升级提示于 en 语言时出现 ko 语言下的提示信息",
          ]
        },
        {
          version: "v1.1.9",
          date: "2020-04-23T06:00:00Z",
          changes: [
            "修复：由于添加国内加速镜像站点的若干问题",
          ]
        },
        {
          version: "v1.1.8",
          date: "2020-04-23T08:00:00Z",
          changes: [
            "添加：国内加速镜像站点",
            "添加：跟随系统的暗色模式选项",
            "优化：菜单设置",
            "优化：首页若干图标显示效果",
          ]
        },
        {
          version: "v1.1.7",
          date: "2020-04-06T18:00:00Z",
          changes: [
            "修复：语言设置未进行 Rehydration",
            "优化：Sentry 报告进行本地频率限制",
            "优化：控制台信息",
            "添加：于更新记录的未来规划版本信息",
          ]
        },
        {
          version: "v1.1.6",
          date: "2020-04-02T18:00:00Z",
          changes: [
            "内部重构：优化应用启动时的模块初始化逻辑",
            "内部重构：独立菜单栏设置项为单一组件",
            "修复：Google Analytics 未上报版本的错误",
            "修复：ServiceWorker 缓存问题",
            "优化：许可协议 Modal 弹窗样式",
            "优化：菜单栏样式",
            "添加：新版本更新提示",
          ]
        },
        {
          version: "v1.1.5",
          date: "2020-03-31T10:31:00Z",
          changes: [
            "添加：User ID 说明",
            "重构：更新记录",
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
      ].map((el) => {
        if (el.active) {
          el.color = 'green';
          el.icon = 'mdi-check';
          el.value = true
        } else if (el.future) {
          el.color = 'secondary';
          el.icon = 'mdi-dots-horizontal';
          el.value = false
        } else {
          el.color = 'orange darken-2';
          el.icon = 'mdi-history';
          el.value = false
        }

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
    },
  },
}
</script>

<style scoped>
</style>