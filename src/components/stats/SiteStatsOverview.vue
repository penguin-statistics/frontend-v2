<template>
  <BackdropCard
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
      <span
        ref="totalReportsNum"
        class="monospace"
      >
        {{ totalReports === null ? "---" : totalReports | thousandSeparator }}
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
  import statsManager from "@/models/managers/stats";
  import anime from "animejs";
  import formatter from "@/utils/formatter";
  export default {
    name: "SiteStatsOverview",
    components: {BackdropCard},
    computed: {
      totalReports() {
        const stats = this.$store.getters["data/content"]({id: "stats"})
        if (!stats || stats.error) return 0
        return stats["totalStageTimes_24h"]
          .map(el => el.times)
          .reduce((a, b) => a + b, 0)
      }
    },
    watch: {
      totalReports(newValue, oldValue) {
        this.animate(newValue, oldValue)
      }
    },
    created () {
      statsManager.refresh()
    },
    methods: {
      animate(newValue, oldValue) {
        const self = this;

        if (self.$refs["totalReportsNum"]) {
          return anime({
            targets: self.$refs["totalReportsNum"],
            innerHTML: [oldValue, newValue],
            duration: 1500,
            round: 1,
            easing: 'easeOutQuint',
            delay: 1500,
            complete: function () {
              self.$refs["totalReportsNum"].innerText = formatter.thousandSeparator(newValue)
            }
          })
        }
      }
    },
  }
</script>

<style scoped>

</style>