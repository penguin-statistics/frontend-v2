<i18n>
  {
    "zh": {
      "quickStart": "快速上手",
      "title": {
        "planner": "刷图规划",
        "byItem": "素材掉率",
        "byStage": "关卡掉率"
      },
      "subtitle": {
        "planner": "请给我刷图建议",
        "byItem": "我该去哪刷石头？",
        "byStage": "这图掉率如何？"
      }
    },
    "en": {
      "quickStart": "Quick Start",
      "title": {
        "planner": "Farm Planning",
        "byItem": "Item Drop Rates",
        "byStage": "Stage Drop Rates"
      },
      "subtitle": {
        "planner": "Please gimme some farming advice",
        "byItem": "Where should I farm for Orirock?",
        "byStage": "What are the drop rates of this stage?"
      }
    },
    "ja": {
      "quickStart": "クイックスタート",
      "title": {
        "planner": "周回計画",
        "byItem": "素材ドロップ率",
        "byStage": "作戦ドロップ率"
      },
      "subtitle": {
        "planner": "Please gimme some farming advice",
        "byItem": "Where should I farm for Orirock?",
        "byStage": "What are the drop rates of this stage?"
      }
    },
    "ko": {
      "quickStart": "빠른 시작",
      "title": {
        "planner": "Farm Planning",
        "byItem": "Item Drop Rates",
        "byStage": "Stage Drop Rates"
      },
      "subtitle": {
        "planner": "Please gimme some farming advice",
        "byItem": "Where should I farm for Orirock?",
        "byStage": "What are the drop rates of this stage?"
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

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        v-for="link in links"
        :key="link.title"
        cols="12"
        sm="4"
      >
        <v-card
          hover 
          class="pa-4 text-center backdrop-card transition-all"
          :to="{name: link.route}"
        >
          <div class="backdrop-icon transition-all">
            <v-icon
              class="backdrop-icon--icon"
            >
              {{ link.icon }}
            </v-icon>
          </div>

          <v-icon
            x-large
            style="opacity: 0.9"
          >
            {{ link.icon }}
          </v-icon>

          <h2 class="heading my-1">
            {{ renderTranslation(link.title) }}
          </h2>

          <span class="caption font-italic">
            {{ $t('meta.quotation.start') }}{{ renderTranslation(link.subtitle) }}{{ $t('meta.quotation.end') }}
          </span>
        </v-card>
      </v-col>
    </v-row>



    <!--    <v-card-title style="word-break:normal">-->
    <!--      <div class="subtitle-1">-->
    <!--        <ul-->
    <!--          class="pl-2"-->
    <!--          style="list-style: none"-->
    <!--        >-->
    <!--          <li class="d-flex flex-row align-center">-->
    <!--            刷一指定素材：-->
    <!--            <v-chip-->
    <!--              link-->
    <!--              color="primary"-->
    <!--              :to="{name: 'StatsByItem'}"-->
    <!--              small-->
    <!--            >-->
    <!--              <v-icon-->
    <!--                left-->
    <!--                small-->
    <!--              >-->
    <!--                mdi-link-->
    <!--              </v-icon>-->
    <!--              素材掉落数据-->
    <!--            </v-chip>-->
    <!--          </li>-->

    <!--          <li>-->
    <!--            查看关卡/活动/补给箱的掉落分布：-->
    <!--            <v-chip-->
    <!--              link-->
    <!--              color="primary"-->
    <!--              :to="{name: 'StatsByStage'}"-->
    <!--              small-->
    <!--            >-->
    <!--              <v-icon-->
    <!--                left-->
    <!--                small-->
    <!--              >-->
    <!--                mdi-link-->
    <!--              </v-icon>-->
    <!--              关卡掉落数据-->
    <!--            </v-chip>-->
    <!--          </li>-->

    <!--          <li>-->
    <!--            刷图规划：-->
    <!--            <v-chip-->
    <!--              link-->
    <!--              color="primary"-->
    <!--              :to="{name: 'Planner'}"-->
    <!--              small-->
    <!--            >-->
    <!--              <v-icon-->
    <!--                left-->
    <!--                small-->
    <!--              >-->
    <!--                mdi-link-->
    <!--              </v-icon>-->
    <!--              刷图规划器-->
    <!--            </v-chip>-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </div>-->
    <!--    </v-card-title>-->
  </v-card>
</template>

<script>
  export default {
    name: "GettingStarted",
    data() {
      return {
        links: [
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
  .backdrop-card {
    overflow: hidden;
  }
  .theme--light .backdrop-card {
    background: rgba(250, 250, 250, .9) !important;
  }

  .theme--dark .backdrop-card {
    background: rgba(30, 30, 30, .9) !important;
  }

  .backdrop-card:hover .backdrop-icon {
    opacity: 0.15;
  }

.backdrop-icon {
  position: absolute;
  bottom: -2rem;
  right: 0;
  user-select: none;
  z-index: 0;
  opacity: 0.05;
}

.backdrop-icon .backdrop-icon--icon {
  font-size: 8rem;
  /*transform: rotate(-60deg);*/
}
</style>