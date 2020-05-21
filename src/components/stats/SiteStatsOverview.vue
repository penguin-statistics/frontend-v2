<template>
  <BackdropCard
    v-if="totalReports"
    :to="{name: 'SiteStats'}"
    hover
    class="bkop-medium pa-0 mt-2"
  >
    <template v-slot:backdrop>
      <v-icon>
        mdi-poll-box
      </v-icon>
    </template>
    <v-card-title class="display-2">
      <span class="monospace">
        {{ totalReports === null ? "--,---" : totalReports.toLocaleString() }}
      </span>
    </v-card-title>
    <v-card-subtitle class="d-flex">
      <span>
        {{ $t('stats.site.total.report') }} — {{ $t('stats.site.24hr') }}
      </span>
      <v-spacer />
      <span class="d-flex flex-row align-center">
        {{ $t('stats.site.viewMore') }}
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </span>
    </v-card-subtitle>
  </BackdropCard>
</template>

<script>
  import BackdropCard from "@/components/global/BackdropCard";
  export default {
    name: "SiteStatsOverview",
    components: {BackdropCard},
    computed: {
      totalReports() {
        const stats = this.$store.getters["data/content"]({id: "stats"})
        if (!stats || stats.error) return null
        return stats["totalStageTimes_24h"]
          .map(el => el.times)
          .reduce((a, b) => a + b, 0)
      }
    },
  }
</script>

<style scoped>

</style>