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

            <span
              v-if="item.active"
              class="caption"
            >
              现正使用
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

            <v-card-subtitle
              v-if="item.hotfix"
              class="subtitle-1"
            >
              热修复记录
            </v-card-subtitle>

            <v-card-text v-if="item.hotfix">
              <ol>
                <li
                  v-for="(text, key) in item.hotfix"
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
          version: "v3.1.0",
          date: "2020-06-15T08:00:00Z",
          changes: [
            "将添加：关卡更多统计信息",
            "将添加：特定物品掉率随时间趋势查询",
            "将添加：关卡掉落组合频率查询",
            "将添加：全站上传数据状态一览",
            "将添加：物品掉落分时查询"
          ]
        },
        {
          future: true,
          version: "v3.0.2",
          date: "2020-05-22T08:00:00Z",
          changes: [
            "将添加：高级查询功能",
            "将添加：数据导出功能",
            "将优化：ArkPlanner 体验（包括数据选择保存、配置分享、界面与性能优化等）",
          ]
        },
        {
          active: true,
          version: "v3.0.1",
          date: "2020-05-16T21:00:00Z",
          changes: [
            "添加：掉落趋势图掉落量显示",
            "添加：掉落趋势图最后更新时间",
            "添加：API 文档与开发者文档链接",
            "添加：掉落趋势时序数据导出功能",

            "优化：更新图标包",
            "优化：掉落趋势图优化 Tooltip 显示效果",
            "优化：掉落趋势图时间区间增加至 60 天",
            "优化：公告现支持按照所选服务器自动过滤",
            "优化：不存在关卡过滤粒度细致至关卡级别（此前细致至章节级别）",

            "修复：掉落汇报界面的错误文案",
            "修复：部分未开启关卡未按照当前服务器正确过滤",
          ]
        },
        {
          version: "v3.0.0",
          date: "2020-05-14T08:00:00Z",
          changes: [
            "内部重构：所有数据将引入版本概念，从底层保证数据一致性",

            "添加：掉落趋势图回归",
            "添加：多服务器掉落汇报",
            "添加：多服务器数据源切换支持",
            "添加：支持显示不同严重性、客户端环境匹配的动态公告",
            "添加：掉落汇报内，按掉落类型进行分别检查汇报错误的支持",
            "添加：统计区间支持（在上游服务器添加一会造成掉率影响的物品时，将自动新建一统计区间，以免造成掉率统计冲突）",

            "优化：滚动条样式",
            "优化：账户信息展示",
            "优化：掉落趋势图大屏设备体验",
            "优化：掉落趋势图适配暗色/亮色主题",
            "优化：本地数据管理器现将显示已缓存服务器列表及其所占用的本地空间大小",

            "修改：增加新团队成员",
            "修改：增加公安网备案信息",
          ],
          hotfix: [
            "修复：掉落汇报移除错误文案",
            "修复：掉落趋势图轴刻度区间",
          ]
        },
        {
          version: "v1.1.11",
          date: "2020-05-05T09:43:12Z",
          changes: [
            "添加：低数据模式选项",
            "添加：本地数据重置器",
            "添加：作战选择界面背景图片",
            "添加：基础资源加载失败提示",
            "添加：刷图规划器支持自选排除关卡",
            "添加：数据展示组件使用同游戏内 基建 所使用的 Bender 字体",

            "修复：国内镜像使用镜像 API",
            "修复：在设置内选定主题 跟随系统 设定后再选定其他任一主题选项，在同一浏览会话内仍会在系统主题切换时自动切换为另一主题的问题",
            "修复：不支持 CSS max() 浏览器上基础布局元素错位的问题",

            "优化：镜像选择弹窗",
            "优化：升级上游 Vuetify 至最新版本",
            "优化：Service Worker 缓存逻辑与稳定性",

            "内部优化：i18n 语言文件整理",
          ],
          hotfix: [
            "修复：家具图标颜色异常",
            "修复：基础资源加载失败加入同源资源判断",
            "修复：作战选择界面背景图片 CDN 检测异常",
            "修复：自选排除关卡无法排除物资补给的错误",
            "修复：统一多页面 Stepper 卡片阴影与 Padding 值",
            "修复：作战选择界面中活动关卡开启时间的排版微移问题",
            "修复：数据表格由于浏览器缺失 Intl 而渲染失败的问题",
            "修复：由于 Crisp 导致页面部分元素可能无法点击的问题",

            "优化：作战选择界面点击元素对比度提升优化",
          ]
        },
        {
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
          date: "2020-04-23T07:00:00Z",
          changes: [
            "修复：由于添加国内加速镜像站点的若干问题",
          ]
        },
        {
          version: "v1.1.8",
          date: "2020-04-23T05:00:00Z",
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
            "添加：新版本上线"
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