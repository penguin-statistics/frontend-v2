<template>
  <v-card class="fill-height">
    <v-card-title class="heading align-baseline">
      {{ $t('stats.site.stages') }}
      <small class="overline ml-1">{{ title }}</small>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :options="options.table"
      
      :page.sync="page"

      must-sort
      sort-by="times"
      :sort-desc="true"
      :locale="$i18n.locale"
      hide-default-footer

      :calculate-widths="true"
      :mobile-breakpoint="1"

      class="elevation-0 transparentTable container--fluid mx-4 font-weight-bold monospace trend-table"

      :class="{'pt-0': $vuetify.breakpoint.xsOnly}"
    >
      <template v-slot:item.stage="{ item }">
        <v-row
          align="center"
          class="cursor-pointer item-name pl-2"
          @click="redirect(item.stage.stageId)"
        >
          <v-icon>{{ item.zone.icon }}</v-icon>
          <span
            class="ml-2"
          >
            {{ strings.translate(item.stage, "code") }}
          </span>
          <v-icon
            x-small
            class="ml-1 item-name--chevron"
          >
            mdi-link
          </v-icon>
          <v-divider
            class="mx-4 item-name--line"
          />
        </v-row>
      </template>
      <template v-slot:item.stage.apCost="{ item }">
        <span :class="`yellow--text ${dark ? '' : 'text--darken-3'}`">
          {{ item.stage.apCost }}
        </span>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      cir
      :total-visible="7"
      class="mt-1 mb-3"
      :length="Math.ceil(items.length / options.table.itemsPerPage)"
    />
  </v-card>
</template>

<script>
  import Theme from "@/mixins/Theme";
  import get from "@/utils/getters";
  import strings from "@/utils/strings";

  export default {
    name: "SiteStatsStage",
    mixins: [Theme],
    props: {
      data: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        page: 1,
        options: {
          table: {
            itemsPerPage: 10
          }
        }
      }
    },
    computed: {
      items() {
        return this.data.map(el => {
          el.stage = get.stages.byStageId(el.stageId, false);
          el.zone = get.zones.byZoneId(el.stage.zoneId, false);
          return el
        })
      },
      headers() {
        return [
          {
            text: this.$t("stats.headers.stage"),
            value: "stage",
            align: "left",
            sortable: false,
            width: "180px"
          },
          {
            text: this.$t("stats.headers.times"),
            value: "times",
            align: "left",
            sortable: true,
            width: "100px"
          },
          {
            text: this.$t("stats.headers.apCost"),
            value: "stage.apCost",
            align: "left",
            sortable: true,
            width: "100px"
          }
        ]
      },
      strings () {
        return strings
      }
    },
    methods: {
      redirect(stageId) {
        const got = get.stages.byStageId(stageId);
        this.$router.push({
          name: "StatsByStage_Selected",
          params: {
            zoneId: got.zoneId,
            stageId
          }
        });
      }
    },
  }
</script>

<style scoped>

</style>