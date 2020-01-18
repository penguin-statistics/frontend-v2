<template>
  <div>
    <div
      v-for="zone in categorizedZones"
      :key="zone.zoneId"
    >
      <v-subheader>
        {{ strings.translate(zone, "zoneName") }}
      </v-subheader>

      <v-expansion-panels>
        <v-expansion-panel
          v-for="stage in zone.stages"
          :key="stage.stageId"
        >
          <v-expansion-panel-header />
          <v-expansion-panel-content>
            <v-card>
              {{ stage }}
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";

  export default {
    name: "NewStageSelector",

    computed: {
      strings () {
        return strings
      },
      categorizedZones() {
        const categories = ["ACTIVITY_OPEN", "MAINLINE", "WEEKLY"];
        !this.hideClosed ? categories.push("ACTIVITY_CLOSED") : null;
        let result = [];
        for (let category of categories) {
          let filter = null;
          let zones = get.zones.byType(category.startsWith("ACTIVITY") ? "ACTIVITY" : category);
          if (category === "ACTIVITY_OPEN") {
            filter = zone => !zone.isOutdated;
          } else if (category === "ACTIVITY_CLOSED") {
            filter = zone => zone.isOutdated;
          }
          if (filter) {
            zones = zones.filter(filter);
          }
          if (zones && zones.length) {
            result.push({
              id: category,
              zones: zones
            })
          }
        }
        return result;
      },
    },
  }
</script>

<style scoped>

</style>