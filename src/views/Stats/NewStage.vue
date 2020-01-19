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
  <v-row
    align="center"
    align-content="center"
    justify="center"
  >
    <NewStageSelector
      :name="$t('stats.name')"
      @select="select"
    >
      <v-card>
        <v-row
          align="center"
          justify="end"
        >
          <DataSourceToggle />
        </v-row>

        <DataTable
          :items="stats"
          :search="search"
          type="stage"

          class="pa-6"
        />
      </v-card>
    </NewStageSelector>
  </v-row>
</template>

<script>
  import NewStageSelector from "@/components/NewStageSelector";
  import DataTable from "@/components/stats/DataTable";
  import get from "@/utils/getters";
  import Console from "@/utils/Console";
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
    search: ""
  }),
  computed: {
    stats() {
      const got = get.statistics.byStageId(this.selected.stage);
      Console.debug(got)
      if (!got) return []
      return got
    }
  },
  methods: {
    select({zone, stage}) {
      this.selected.zone = zone;
      this.selected.stage = stage;
    }
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
