<i18n>
{
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
	},
	"zh": {
		"stats": {
			"name": "统计结果",
			"title": "{stage} 统计结果"
		}
	}
}
</i18n>

<template>
  <StageSelector
    :name="$t('stats.name')"
    :router-names="routerNames"

    @select="select"
  >
    <StageDetails
      :stage="stage"
      :zone="zone"
      :stats="stats"
    />
    
    <v-card class="bkop-light pt-2 elevation-4 ma-2 content-card">
      <v-card-title class="pb-0 mx-1">
        <v-row
          align="center"
          justify="center"
          class="px-4 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-4"
        >
          <h2
            class="subtitle-2 d-block"
            style="width: 100%"
          >
            {{ strings.translate(zone, "zoneName") }}
          </h2>
          <h1 class="title pt-1 no-wrap--text">
            {{ $t('stats.title', {stage: strings.translate(stage, "code")}) }}
          </h1>
          <v-spacer />
          <v-btn
            v-if="validStage"
            depressed
            color="primary"
            small
            class="mx-2"
            style="transform: translateY(2px);"
            :to="{name: 'ReportByZone_Selected', params: {zoneId: selected.zone, stageId: selected.stage}}"
          >
            <v-icon
              left
              small
            >
              mdi-upload
            </v-icon>
            {{ $t('menu.report') }}
          </v-btn>
          <DataSourceToggle />
        </v-row>
      </v-card-title>

      <DataTable
        :items="stats"
        type="stage"
        :trends="trends"

        class="px-3 px-sm-4 px-md-6 px-lg-6 px-xl-8 pt-0 pb-6"
      />

      <BackdropName :content="strings.translate(stage, 'code')" />
    </v-card>
  </StageSelector>
</template>

<script>
  import StageSelector from "@/components/stats/StageSelector";
  import DataTable from "@/components/stats/DataTable";
  import get from "@/utils/getters";
  import DataSourceToggle from "@/components/stats/DataSourceToggle";
  import strings from "@/utils/strings";
  import existUtils from "@/utils/existUtils";
  import BackdropName from "@/components/stats/BackdropName";
  import StageDetails from "@/components/stats/StageDetails";

export default {
  name: "StatsByStage",
  components: {StageDetails, BackdropName, DataSourceToggle, DataTable, StageSelector},
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
      return {
        ...got,
        code: strings.translate(got, "code")
      }
    },
    zone () {
      const got = get.zones.byZoneId(this.selected.zone, false);
      if (!got) return {};
      return {
        ...got,
        zoneName: strings.translate(got, "zoneName")
      }
    },
    strings () {
      return strings
    },
    getter () {
      return get
    },
    trends () {
      return get.trends.byStageId(this.selected.stage)
    },
    validStage () {
      return !this.zone.isOutdated && this.stage["dropInfos"] && existUtils.existence(this.stage, true)
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
