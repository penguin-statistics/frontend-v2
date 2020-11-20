<i18n>
	{
		"en": {
			"quickStart": "Quick Start",
			"caption": [
				"Click the",
				"button to expand menu and see more features"
			],
			"subtitle": {
				"report": "I wanna report drops",
				"byItem": "Where should I farm rocks?",
				"byStage": "What are the drop rates of this stage?",
				"planner": "Please gimme some farming advice"
			},
			"title": {
				"report": "Report Drops",
				"byItem": "Item Drop Rates",
				"byStage": "Stage Drop Rates",
				"planner": "Farming Planner"
			}
		},
		"ja": {
      "quickStart": "クイックスタート",
			"caption": [
				"左上の",
				"ボタンをクリックしてメニューを展開すると、さらに多くの機能が表示されます。"
			],
			"subtitle": {
				"report": "ドロップを報告したい",
				"byItem": "岩ってどこ回ったらいいのかな",
				"byStage": "1-7の泥率ってどれくらい？",
				"planner": "周回アドバイスをください"
			},
			"title": {
				"report": "ドロップ報告",
				"byItem": "素材ドロップ率",
				"byStage": "作戦ドロップ率",
				"planner": "周回計画"
			}
		},
		"ko": {
			"quickStart": "빠른 시작"
		},
		"zh": {
			"quickStart": "快速上手",
			"caption": [
				"点击左上角",
				"按钮展开菜单以查看更多功能"
			],
			"subtitle": {
				"report": "我要汇报掉落",
				"byItem": "我该去哪刷石头？",
				"byStage": "这图掉率如何？",
        "search": "光速直达统计结果",
				"planner": "请给我刷图建议"
			},
			"title": {
				"report": "掉落汇报",
				"byItem": "素材掉率",
				"byStage": "作战掉率",
        "search": "全局搜索",
				"planner": "刷图规划"
			}
		}
	}
</i18n>

<template>
  <v-card
    elevation="5"
    class="bkop-medium pa-6"
  >
    <h1 class="headline d-flex align-center flex-row">
      <v-icon
        left
      >
        mdi-speedometer
      </v-icon>

      {{ $t('quickStart') }}
    </h1>

    <span class="subtitle-2 my-2 d-inline-flex align-center flex-row flex-wrap justify-end">
      {{ $t('caption')[0] }}
      <v-icon
        small
        class="mx-1"
      >
        mdi-menu
      </v-icon>
      {{ $t('caption')[1] }}
    </span>

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        v-for="link in links"
        :key="link.title"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="3"
        class="align-self-stretch"
      >
        <BackdropCard
          hover
          :to="{name: link.route}"
          :class="{'d-flex flex-row align-center justify-center fill-height': link.wide}"
        >
          <template v-slot:backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <template v-if="link.wide">
            <v-icon
              x-large
              style="opacity: 0.9"
            >
              {{ link.icon }}
            </v-icon>

            <h2
              class="ml-0 mr-2"
              :class="{'subtitle-2 font-weight-bold': $vuetify.breakpoint.xsOnly, 'heading my-1': !$vuetify.breakpoint.xsOnly}"
            >
              {{ renderTranslation(link.title) }}
            </h2>

            <span class="caption font-italic">
              {{ $t('meta.quotation.start') }}{{ renderTranslation(link.subtitle) }}{{ $t('meta.quotation.end') }}
            </span>
          </template>
          <template v-else>
            <v-icon
              x-large
              style="opacity: 0.9"
            >
              {{ link.icon }}
            </v-icon>

            <h2 :class="{'subtitle-2 font-weight-bold mt-1': $vuetify.breakpoint.xsOnly, 'heading my-1': !$vuetify.breakpoint.xsOnly}">
              {{ renderTranslation(link.title) }}
            </h2>

            <span class="caption font-italic">
              {{ $t('meta.quotation.start') }}{{ renderTranslation(link.subtitle) }}{{ $t('meta.quotation.end') }}
            </span>
          </template>
        </BackdropCard>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import BackdropCard from "@/components/global/BackdropCard";
  export default {
    name: "GettingStarted",
    components: {BackdropCard},
    data() {
      return {
        links: [
          // {
          //   route: "Search",
          //   icon: "mdi-magnify",
          //   title: 'title.search',
          //   subtitle: 'subtitle.search',
          //   wide: true
          // },
					{
						route: "ReportByZone",
						icon: "mdi-upload",
						title: 'title.report',
						subtitle: 'subtitle.report'
					},
          {
            route: "Planner",
            icon: "mdi-directions-fork",
            title: 'title.planner',
            subtitle: 'subtitle.planner'
          },
          {
            route: "StatsByItem",
            icon: "mdi-treasure-chest",
            title: 'title.byItem',
            subtitle: 'subtitle.byItem'
          },
          {
            route: "StatsByStage",
            icon: "mdi-cube",
            title: 'title.byStage',
            subtitle: 'subtitle.byStage'
          }
        ]
      }
    },
    methods: {
      renderTranslation(t) {
        return this.$t(t);
      }
    }
  }
</script>

<style scoped>
  /*.theme--light .backdrop-card {*/
  /*  background: rgba(250, 250, 250, .9) !important;*/
  /*}*/

  /*.theme--dark .backdrop-card {*/
  /*  background: rgba(30, 30, 30, .9) !important;*/
  /*}*/
</style>