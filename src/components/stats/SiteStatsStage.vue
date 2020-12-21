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
        <span
          v-if="invalidApCost(item.stage.apCost)"
          class="grey--text"
        >
          --
        </span>
        <span
          v-else
          :class="dark ? 'orange--text text--lighten-1' : 'deep-orange--text text--darken-3 font-weight-bold'"
        >
          {{ item.stage.apCost }}
        </span>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
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
        return this.data
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
      },

      invalidApCost (apCost) {
        return apCost === 99 || apCost === null
      }
    },
  }
</script>

<style scoped>

</style>