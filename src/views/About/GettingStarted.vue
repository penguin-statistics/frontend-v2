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
        <BackdropCard
          hover
          :to="{name: link.route}"
        >
          <template v-slot:backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

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
  .theme--light .backdrop-card {
    background: rgba(250, 250, 250, .9) !important;
  }

  .theme--dark .backdrop-card {
    background: rgba(30, 30, 30, .9) !important;
  }
</style>