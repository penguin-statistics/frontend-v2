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
    }
  }
</i18n>

<template>
  <NewStageSelector
    :name="$t('stats.name')"
    :router-names="routerNames"

    @select="select"
  >
    <v-card class="bkop-light">
      <v-card-title class="pb-0">
        <v-row
          align="center"
          justify="space-between"
        >
          <h1 class="title pl-7 pt-2 text-truncate">
            {{ $t('stats.title', {stage: stage.code}) }}
          </h1>
          <DataSourceToggle class="pr-5" />
        </v-row>
      </v-card-title>

      <DataTable
        :items="stats"
        type="stage"

        class="pt-3"
      />
    </v-card>
  </NewStageSelector>
</template>

<script>
  import NewStageSelector from "@/components/NewStageSelector";
  import DataTable from "@/components/stats/DataTable";
  import get from "@/utils/getters";
  import DataSourceToggle from "@/components/stats/DataSourceToggle";

export default {
  name: "NewStatsByStage",
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
</style>
