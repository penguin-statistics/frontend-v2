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

            <v-card-text
              v-if="Array.isArray(item.changes)"
              class="markdown-content"
            >
              <ol>
                <li
                  v-for="(text, key) in item.changes"
                  :key="key"
                  v-html="text"
                />
              </ol>
            </v-card-text>

            <v-card-text
              v-else
              v-marked
              class="markdown-content-raw ml-1"
              v-text="item.changes"
            />

            <v-card-subtitle
              v-if="item.hotfix"
              class="subtitle-1"
            >
              热修复记录
            </v-card-subtitle>

            <v-card-text
              v-if="item.hotfix"
              class="markdown-content"
            >
              <ol>
                <li
                  v-for="(text, key) in item.hotfix"
                  :key="key"
                  v-html="text"
                />
              </ol>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import anime from 'animejs'
import timeFormatter from '@/utils/timeFormatter'
import strings from '@/utils/strings'
import semver from 'semver'
import config from '@/config'

export default {
  name: 'Changelog',
  data () {
    return {
      index: null,
      logs: [
        {
          version: 'v3.6.0',
          date: '2021-06-01T00:00:00+0800',
          changes: `## 重构
1. 关卡选择器：适配上游新版终端 UI
          `
        },
        {
          version: 'v3.5.2',
          date: '2021-05-10T02:00:00+0800',
          changes: `## 优化
1. 关卡选择器加入常驻关类别
          `
        },
        {
          version: 'v3.5.1',
          date: '2021-04-15T16:00:00+0800',
          changes: `## 修复
1. 截图识别掉落汇报可能存在无法上传的问题

## 优化
1. iOS 客户端体验
          `
        },
        {
          version: 'v3.5.0',
          date: '2021-03-26T00:00:00+0800',
          changes: `## 添加
1. 截图识别掉落汇报
  - 使用了高性能的 WebAssembly 于用户浏览器本地进行识别，保证用户隐私的同时也避免了大量服务器带宽开销
  - 对收集到的 866 张测试图的识别结果准确率为 99.7%
  - UI 展示了可能发生的错误的详细信息、排查途径、与当前并未检测到问题的识别结果（如有）
  - 在确认无误后，可一键上传

## 优化
1. 服务器切换器
2. 章节背景图索引
3. 「团队成员」添加新成员

## 修复
1. 掉落汇报页面公告可能浮于标题栏之上的问题
          `
        },
        {
          version: 'v3.4.2',
          date: '2021-01-16T16:00:00+0800',
          changes: `## 添加
1. 添加了探针客户端 \`probe\`

## 修复
1. 多处翻译问题修复
2. 多处客户端问题修复
`
        },
        {
          version: 'v3.4.1',
          date: '2021-01-06T16:00:00+0800',
          changes: `## 优化
1. 菜单支持多项展开
2. 移除素材掉率页面的多余 Padding

## 修复
1. 主页 Banner 在小屏下错位的问题

## 重构
1. 重新设计了「内容来源」页面
`
        },
        {
          version: 'v3.4.0',
          date: '2020-12-22T04:00:00+0800',
          changes: `## 添加
1. 全局搜索功能
2. 分包页面加载提示
3. 「掉落组合」计算与可视化
4. 干员立绘的版权提示信息
5. 于**作战数据页面**内的「快速操作」栏
6. 于**作战数据页面**内的「关于作战」信息栏
7. 于**作战选择器**的「快速访问」栏
8. 于**数据表表头**的栏信息解释 Tooltip

## 优化
1. 服务器切换器
2. 优化数据表格内容密度
3. 「公告」卡片的链接展示效果
4. 优化「友情链接」的部分链接设计
5. 「图标背景卡片」的背景渐变微调
6. 多项针对即将上线的 Hybrid App 的优化
  1. 重新设计了 App Icon 以防止版权纠纷
  2. 对众多组件增加了 Haptic Feedback
7. 优化数据表表头 \`:hover\` 效果
8. 于「内容来源」增加关于 Bender 字体的说明
9. 增加「正在部署」检测机制，优化网络报错提示
10. 调整了 Bender 字体的部分字宽，以优化视觉可读性
11. 于外部链接增加 \`rel="noopener"\` 防止外站链接劫持
12. 部分页面进行分包处理，降低首次加载耗时与减少服务器带宽开销
13. 「捐助」页针对不同渠道限制进行设计调整，在合规性范围内尽量让用户看到捐赠渠道

### 内部优化
1. 统一化非正常数据检测机制
2. 多处代码进行性能调优，移除了部分无用代码

## 修复
1. 大于 1h 的时间段解析错误的问题
2. 相关物品浮动于 App Bar 上方的错误
3. 修复 404 页面在亮色主题下显示效果不佳的问题
4. 「按素材」页面重复跳转自身页面导致 \`SearchParams\` 消失的问题

## 重构
1. 重新设计了「团队成员」页面

## 热修复记录
1. 修复了掉落汇报页面可能导致汇报成功提示无法弹出的问题
2. 修复了部分组件可能浮动于 App Bar 上方的问题
3. 修复了成员列表部分邮箱无法直接跳转的问题
4. 修复了搜索功能并未预设 \`SearchParams\` 的问题
5. 优化了搜索引擎的搜索准确性，提升了用户体验
`
        },
        {
          version: 'v3.3.6',
          date: '2020-11-01T15:30:00+0800',
          changes: [
            '优化：增加背景图',
            '优化：更新物品图标',
            '优化：物品选择器、按物品查看掉率页面头部样式'
          ],
          hotfix: [
            '添加：「芯片」素材种类',

            '修复：可能造成站点无限期显示正在加载的问题',

            '优化：部分文案'
          ]
        },
        {
          version: 'v3.3.5',
          date: '2020-10-18T03:00:00+0800',
          changes: [
            '添加：自适应清晰度物品图标',

            '修复：首页等使用了视差加载效果的界面可能出现没有内容的错误',
            '修复：在刷新数据时停留在使用了作战选择器的页面可能造成的显示问题',
            '修复：物品数据速览卡片在表格内可能遮挡一部分物品图标的问题',

            '优化：作战选择器优化头部样式，提高跳转效率、增加背景图与选关界面模拟动画',
            '优化：提交界面网络错误提示于用户关闭前将持续显示',
            '优化：于掉落汇报和按作战浏览统计数据中的章节名称显示效果',

            '移除：空内容提交二次确认弹窗',

            '内部优化：添加数据结构版本兼容性检查'
          ]
        },
        {
          version: 'v3.3.4',
          date: '2020-09-18T05:00:00+0800',
          changes: [
            '添加：更新记录 **Mark**_down_ 支持',
            '添加：包含「企鹅物流」内四个干员的新可爱加载动画 ☆´∀｀☆\n- 本动画已应用至**网络状态指示器**与**刷图规划器**\n- 已将可能对移动设备耗电加快的因素纳入考量：使用了纯 CSS3 动画提高渲染效率，移动设备不会因此造成肉眼可见范围内的电池消耗增加，敬请知悉',

            '修复：PenguinID 找回功能中，有时不记录已登录账户的问题',

            '优化：背景立绘不再依赖 `window.fetch`',
            '内部优化：**汇报掉落**与**刷图规划**将报告「客户端请求与渲染用时」性能指标'
          ]
        },
        {
          version: 'v3.3.3',
          date: '2020-09-05T23:00:00+0800',
          changes: [
            '修改：由于监管要求，将于 `CN` 镜像暂时关闭首页的相作战片'
          ]
        },
        {
          version: 'v3.3.2',
          date: '2020-07-31T00:00:00+0800',
          changes: [
            '添加：物品数据速览',
            '添加：按作战查看数据增加 Zone 名称显示',

            '修复：Report 对部分无效作战的错误禁止上传提示',
            '修复：友情链接「kkdy数据站」链接地址错误',
            '修复：英文翻译的若干错误',
            '优化：部分数据 Existence 判断'
          ]
        },
        {
          version: 'v3.3.1',
          date: '2020-07-23T18:00:00Z',
          changes: [
            '添加：PenguinID 找回功能（仅支持对 v3.3.1 及之后所登录的 PenguinID 进行找回）',

            '修复：Planner FAB 与标签层级细节问题',
            '优化：Planner 数据重置支持重置部分数据'
          ],
          hotfix: [
            '修复：找回登录信息页面弹窗点击「关闭」按钮无反应的问题',
            '优化：部分文案',
            '优化：「正在加载」提示将优先使用用户设定的语言',
            '内部优化：统一验证器引用',
            '内部优化：升级若干依赖项'
          ]
        },
        {
          version: 'v3.3.0',
          date: '2020-07-18T19:00:00Z',
          changes: [
            '添加：表格数据过滤器',
            '添加：最短通关用时数据列',
            '添加：相关作战和物品快速跳转',

            '移除：「前往旧版」菜单栏项',

            '修复：部分配置项和操作可能导致不生效的问题',

            '优化：作战选择器过滤增强',
            '优化：数据表格左右滑动提示',
            '优化：Planner「正在计算」显示效果',
            '优化：作战选择器活动作战分类粒度',
            '优化：数据表格对于无效数据的显示效果',
            '优化：背景立绘随机算法，大幅减少双端流量',
            '优化：作战选择器活动作战按照实际开放时间进行选项排序',
            '优化：旧版本浏览器完美支持最低 IE 10 与 Chrome 20 等老旧浏览器环境，但我们依然强烈推荐这些用户升级浏览器至最新版本',

            '内部优化：生产环境调试器支持',
            '内部优化：本地化资产与 Transifex 进行整合'
          ]
        },
        {
          version: 'v3.2.2',
          date: '2020-07-10T01:00:00Z',
          changes: [
            '添加：新作战背景图',
            '添加：网络请求数据结构验证器',
            '添加：Planner 右下角快捷计算按钮回归',

            '修复：对于旧配置，Planner 提示虽导入成功但却仍然无实际导入效果的问题',

            '优化：ko, ja 语言下部分区域的显示字体',
            '优化：Windows 环境下的滚动条显示效果',
            '优化：暗色模式下的选择区域指示与自动填充的背景色',
            '优化：在没有登录时不拉取个人掉落数据，降低服务端流量传输成本与客户端存储占用空间'
          ]
        },
        {
          version: 'v3.2.1',
          date: '2020-07-05T18:00:00Z',
          changes: [
            '修复：CN Mirror 继续使用本体服务 API Endpoint',
            '修复：部分 Planner 配置文件无法导入的问题',
            '移除：首页冗余的「API 文档」链接项',
            '添加：部分缺失的日文翻译'
          ]
        },
        {
          version: 'v3.2.0',
          date: '2020-07-04T05:00:00Z',
          changes: [
            '添加：内容来源页面',

            '修复：QuotaExceededError 导致的配置错误问题',
            '修复：首页页边距细节问题',
            '修复：Planner 无法排除当前服务器没有的作战的问题',

            '优化：各语言界面文案',
            '优化：Planner IO 界面（未来将支持短链接分享）',
            '优化：Planner 配置分享（现在在分享时会自动包含作战排除、设置项、以及压缩配置文件；同时支持导入此前所有使用的配置文件格式以及支持导入不完整、亦或格式混合的配置文件）',
            '优化：Planner 物品数据保存（所选的 Planner 物品选项现会自动保存，下次不必再次输入）',
            '优化：本地缓存数据库读取性能',
            '优化：Sentry 增加性能样本采样量',
            '优化：网络状态指示器增加数据加载百分比',
            '优化：首页最近 24 小时上传量添加步进动画',
            '优化：忽略作战选择器支持按种类、按作战类别批量复选',

            '内部优化：Planner 分离组件、提升可维护性'
          ]
        },
        {
          version: 'v3.1.0',
          date: '2020-05-22T00:00:00Z',
          changes: [
            '添加：高级查询功能',
            '添加：「理智」图标',
            '添加：全站数据一览功能',
            '添加：高级查询功能缓存',
            '添加：高级查询功能多服务器支持',
            '添加：「你知道吗」(～￣▽￣)～',
            '添加：服务器维护提示页面（在部署新版本或进行维护时会显示此界面；部署完成后将自动返回）',

            '修复：汇报页面 家具选择状态显示错误的问题',

            '优化：部分中、英、日、韩文的翻译内容',

            '内部优化：本地化文件整理',
            '内部优化：多服务器支持与过滤进行统一处理'
          ]
        },
        {
          version: 'v3.0.1',
          date: '2020-05-16T21:00:00Z',
          changes: [
            '添加：掉落趋势图掉落量显示',
            '添加：掉落趋势图最后更新时间',
            '添加：API 文档与开发者文档链接',
            '添加：掉落趋势时序数据导出功能',

            '优化：更新图标包',
            '优化：掉落趋势图优化 Tooltip 显示效果',
            '优化：掉落趋势图时间区间增加至 60 天',
            '优化：公告现支持按照所选服务器自动过滤',
            '优化：不存在作战过滤粒度细致至作战级别（此前细致至章节级别）',

            '修复：掉落汇报界面的错误文案',
            '修复：部分未开启作战未按照当前服务器正确过滤'
          ],
          hotfix: [
            '修复：主页掉落汇报路径不正确的问题'
          ]
        },
        {
          version: 'v3.0.0',
          date: '2020-05-14T08:00:00Z',
          changes: [
            '内部重构：所有数据将引入版本概念，从底层保证数据一致性',

            '添加：掉落趋势图回归',
            '添加：多服务器掉落汇报',
            '添加：多服务器数据源切换支持',
            '添加：支持显示不同严重性、客户端环境匹配的动态公告',
            '添加：掉落汇报内，按掉落类型进行分别检查汇报错误的支持',
            '添加：统计区间支持（在上游服务器添加一会造成掉率影响的物品时，将自动新建一统计区间，以免造成掉率统计冲突）',

            '优化：滚动条样式',
            '优化：账户信息展示',
            '优化：掉落趋势图大屏设备体验',
            '优化：掉落趋势图适配暗色/亮色主题',
            '优化：本地数据管理器现将显示已缓存服务器列表及其所占用的本地空间大小',

            '修改：增加新团队成员',
            '修改：增加公安网备案信息'
          ],
          hotfix: [
            '修复：掉落汇报移除错误文案',
            '修复：掉落趋势图轴刻度区间'
          ]
        },
        {
          version: 'v1.1.11',
          date: '2020-05-05T09:43:12Z',
          changes: [
            '添加：低数据模式选项',
            '添加：本地数据重置器',
            '添加：作战选择界面背景图片',
            '添加：基础资源加载失败提示',
            '添加：刷图规划器支持自选排除作战',
            '添加：数据展示组件使用同游戏内 基建 所使用的 Bender 字体',

            '修复：国内镜像使用镜像 API',
            '修复：在设置内选定主题 跟随系统 设定后再选定其他任一主题选项，在同一浏览会话内仍会在系统主题切换时自动切换为另一主题的问题',
            '修复：不支持 CSS max() 浏览器上基础布局元素错位的问题',

            '优化：镜像选择弹窗',
            '优化：升级上游 Vuetify 至最新版本',
            '优化：Service Worker 缓存逻辑与稳定性',

            '内部优化：i18n 语言文件整理'
          ],
          hotfix: [
            '修复：家具图标颜色异常',
            '修复：基础资源加载失败加入同源资源判断',
            '修复：作战选择界面背景图片 CDN 检测异常',
            '修复：自选排除作战无法排除物资补给的错误',
            '修复：统一多页面 Stepper 卡片阴影与 Padding 值',
            '修复：作战选择界面中活动作战开启时间的排版微移问题',
            '修复：数据表格由于浏览器缺失 Intl 而渲染失败的问题',
            '修复：由于 Crisp 导致页面部分元素可能无法点击的问题',

            '优化：作战选择界面点击元素对比度提升优化'
          ]
        },
        {
          version: 'v1.1.10',
          date: '2020-04-24T01:00:00Z',
          changes: [
            '添加：于 Planner 内添加更多外服排除作战 (DM-* 作战)',
            '修复：Google Analytics Screenview Tracking 问题',
            '修复：网站升级提示于 en 语言时出现 ko 语言下的提示信息'
          ]
        },
        {
          version: 'v1.1.9',
          date: '2020-04-23T07:00:00Z',
          changes: [
            '修复：由于添加国内加速镜像站点的若干问题'
          ]
        },
        {
          version: 'v1.1.8',
          date: '2020-04-23T05:00:00Z',
          changes: [
            '添加：国内加速镜像站点',
            '添加：跟随系统的暗色模式选项',
            '优化：菜单设置',
            '优化：首页若干图标显示效果'
          ]
        },
        {
          version: 'v1.1.7',
          date: '2020-04-06T18:00:00Z',
          changes: [
            '修复：语言设置未进行 Rehydration',
            '优化：Sentry 报告进行本地频率限制',
            '优化：控制台信息',
            '添加：于更新记录的未来规划版本信息'
          ]
        },
        {
          version: 'v1.1.6',
          date: '2020-04-02T18:00:00Z',
          changes: [
            '内部重构：优化应用启动时的模块初始化逻辑',
            '内部重构：独立菜单栏设置项为单一组件',
            '修复：Google Analytics 未上报版本的错误',
            '修复：ServiceWorker 缓存问题',
            '优化：许可协议 Modal 弹窗样式',
            '优化：菜单栏样式',
            '添加：新版本更新提示'
          ]
        },
        {
          version: 'v1.1.5',
          date: '2020-03-31T10:31:00Z',
          changes: [
            '添加：User ID 说明',
            '重构：更新记录',
            '修复：有时无法自动隐藏 Crisp 的错误',
            '修复：重新使用 SaaS 版 Sentry',
            '若干错误修复与性能优化'
          ]
        },
        {
          version: 'v1.1.4',
          date: '2020-03-27T14:23:30Z',
          changes: [
            '修复：Logo 显示位置',
            '添加：于首页的客服入口',
            '若干错误修复与性能优化'
          ]
        },
        {
          version: 'v1.1.3',
          date: '2020-03-08T21:58:09Z',
          changes: [
            '重构：ArkPlanner'
          ]
        },
        {
          version: 'v1.1.2',
          date: '2020-02-27T06:32:40Z',
          changes: [
            '添加：韩语支持',
            '添加：载入界面'
          ]
        },
        {
          version: 'v1.1.1',
          date: '2020-02-08T21:14:04Z',
          changes: [
            '优化：“岁过华灯” 等一系列开箱子的汇报支持批量上传'
          ]
        },
        {
          version: 'v1.1.0',
          date: '2020-02-07T19:17:19Z',
          changes: [
            '重构：作战选择界面',
            '添加：英语支持',
            '添加：日语支持',
            '优化：暂时移除过期的友链'
          ]
        },
        {
          version: 'v1.0.5',
          date: '2019-11-06T00:10:26Z',
          changes: [
            '修复：上传总数统计有时不正确的问题',
            '优化：Windows 操作系统下滚动条样式'
          ]
        },
        {
          version: 'v1.0.4',
          date: '2019-09-28T03:53:55Z',
          changes: [
            '修复：图片显示不正常的问题'
          ]
        },
        {
          version: 'v1.0.3',
          date: '2019-08-28T01:13:23Z',
          changes: [
            '修复：上传后掉落未清空的bug',
            '修复：活动"火蓝之心"新道具的相关bug',
            '添加：用户注销确认窗口'
          ]
        },
        {
          version: 'v1.0.2',
          date: '2019-08-27T00:34:20Z',
          changes: [
            '优化：页面加载速度',
            '添加：返回旧版的入口',
            '优化：掉落汇报异常提示'
          ]
        },
        {
          version: 'v1.0.1',
          date: '2019-08-24T04:31:54Z',
          changes: [
            '修复：无法进入 ArkPlanner 的问题',
            '修复：上传检测机制异常'
          ]
        },
        {
          version: 'v1.0.0',
          date: '2019-08-23T19:39:35Z',
          changes: [
            '添加：新版本上线'
          ]
        }
      ].map((el) => {
        el.future = semver.gt(el.version, config.version)
        el.active = semver.eq(el.version, config.version)

        if (el.active) {
          el.color = 'green'
          el.icon = 'mdi-check'
          el.value = true
        } else if (el.future) {
          el.color = 'secondary'
          el.icon = 'mdi-dots-horizontal'
          el.value = false
        } else {
          el.color = 'orange darken-2'
          el.icon = 'mdi-history'
          el.value = false
        }

        if (Array.isArray(el.changes)) el.changes = el.changes.map(strings.markdown)
        if (el.hotfix) el.hotfix = el.hotfix.map(strings.markdown)

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
      easing: 'easeOutQuint'
    })
  },
  methods: {
    formatTime (t) {
      return timeFormatter.dayjs(t).fromNow()
    }
  }
}
</script>

<style lang="scss">
.markdown-content code, .markdown-content-raw code {
  background: transparent !important;
  color: inherit;
  box-shadow: none;
}
.markdown-content-raw {
  h1, h2, h3 {
    margin-top: 1rem;
    margin-bottom: .5rem;
    &:first-child {
      margin-top: 0rem;
    }
  }
}
.markdown-content p {
  margin-bottom: 0;
}
</style>
