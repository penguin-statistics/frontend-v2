<i18n>
  {
    "zh": {
      "stats": {
        "name": "统计结果",
        "title": "{stage} 统计结果"
      }
    },
    "en": {
      "stats": {
        "name": "Statistics",
        "title": "Statistics of {stage}"
      }
    },
    "ja": {
      "stats": {
        "name": "統計結果",
        "title": "{stage} 統計結果"
      }
    },
    "ko": {
      "stats": {
        "name": "통계 결과",
        "title": "{stage}의 통계 결과"
      }
    }
  }
</i18n>

<template>
  <NewStageSelector
    :name="$t('stats.name')"
    :router-names="routerNames"

    @select="select"
  >
    <v-card class="bkop-light pt-2">
      <v-card-title class="pb-0 mx-1">
        <v-row
          align="center"
          justify="center"
          class="px-4 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-4"
        >
          <h2
            class="overline d-block"
            style="width: 100%"
          >
            {{ strings.translate(zone, "zoneName") }}
          </h2>
          <h1 class="title pt-1 no-wrap--text">
            {{ $t('stats.title', {stage: stage.code}) }}
          </h1>
          <v-spacer />
          <DataSourceToggle />
        </v-row>
      </v-card-title>

      <DataTable
        :items="stats"
        type="stage"

        class="px-3 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-6"
      />
    </v-card>
  </NewStageSelector>
</template>

<script>
  import NewStageSelector from "@/components/stats/StageSelector";
  import DataTable from "@/components/stats/DataTable";
  import get from "@/utils/getters";
  import DataSourceToggle from "@/components/stats/DataSourceToggle";
  import strings from "@/utils/strings";

export default {
  name: "StatsByStage",
  components: {DataSourceToggle, DataTable, NewStageSelector},
  data: () => ({
    expanded: {},
    selected: {
      zone: null,
      stage: null,
    },
    search: "",
    routerNames: {
      index: "StatsByStage",
      details: "StatsByStage_Selected"
    }
  }),
  computed: {
    stats () {
      const got = get.statistics.byStageId(this.selected.stage);
      if (!got) return [];
      return got
    },
    stage () {
      const got = get.stages.byStageId(this.selected.stage);
      if (!got) return { code: "" };
      return got
    },
    zone () {
      const got = get.zones.byZoneId(this.selected.zone);
      if (!got) return {};
      return got
    },
    strings () {
      return strings
    }
  },
  methods: {
    select({zone, stage}) {
      this.selected.zone = zone;
      this.selected.stage = stage;
    },
  },
};
</script>

<style scoped>
.theme--light .zoneTitle {
  color: #fff;
}

.v-table {
  background: transparent !important;
}
  /*.v-expansion-panel {*/
  /*  transform: translateY(48px);*/
  /*  opacity: 0;*/
  /*}*/
</style>
