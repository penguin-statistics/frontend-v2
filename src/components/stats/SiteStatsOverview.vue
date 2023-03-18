<template>
  <BackdropCard
    hover
    :to="{name: 'SiteStats'}"
    class="elevation-5 pa-0 mt-2 mb-2"
  >
    <template #backdrop>
      <v-icon>
        mdi-poll-box
      </v-icon>
    </template>
    <v-card-title class="display-2 px-3">
      <span
        ref="totalReportsNum"
        :class="['monospace', loading ? 'shadow-opacity' : '']"
      >
        ---
      </span>
    </v-card-title>
    <v-card-subtitle class="d-flex align-center pl-3">
      <span>
        {{ $t('stats.site.total.report') }} — {{ $t('stats.site.24hr') }}
      </span>
      <v-spacer />
      <span class="d-flex flex-row align-center">
        {{ $t('stats.site.viewMore') }}
        <v-icon right>
          mdi-chevron-right
        </v-icon>
      </span>
    </v-card-subtitle>
  </BackdropCard>
</template>

<script>
import BackdropCard from '@/components/global/BackdropCard'
import statsManager from '@/models/managers/stats'
import anime from 'animejs'
import formatter from '@/utils/formatter'

export default {
  name: 'SiteStatsOverview',
  components: {BackdropCard},
  data() {
    return {
      cachedTotalReports: 0
    }
  },
  computed: {
    totalReports() {
      const stats = this.$store.getters['data/content']({id: 'stats'})
      if (!stats || stats.error) return 0
      return stats.totalStageTimes_24h
          .map(el => el.times)
          .reduce((a, b) => a + b, 0)
    },
    loading() {
      return this.$store.state.ajax.states.find(el => el.id === 'stats')?.pending
    }
  },
  watch: {
    totalReports(newValue, oldValue) {
      if (newValue === oldValue) return
      if (newValue === 0 && this.cachedTotalReports !== 0) return // do not animate back to 0

      const usingOldValue = this.cachedTotalReports !== 0 ? this.cachedTotalReports : oldValue
      if (oldValue !== 0) this.cachedTotalReports = oldValue
      if (newValue !== 0) this.animate(newValue, usingOldValue)
    }
  },
  created() {
    statsManager.refresh()
  },
  methods: {
    animate(newValue, oldValue) {
      const self = this

      if (self.$refs.totalReportsNum) {
        return anime({
          targets: {value: oldValue},
          value: newValue,
          duration: 1700,
          round: 1,
          easing: 'easeOutQuint',
          delay: 1000,
          // update: function () {
          //   // when completed such element may not exist anymore - if the component
          //   // has already been destroyed at such time.
          //   if (self && self.$refs.totalReportsNum) {
          //     self.$refs.totalReportsNum.innerText = formatter.thousandSeparator(newValue)
          //   }
          // }
          update: function (anim) {
            // when completed such element may not exist anymore - if the component
            // has already been destroyed at such time.
            const val = anim.animatables[0].target.value
            const text = formatter.thousandSeparator(val)
            if (self && self.$refs.totalReportsNum) {
              if (val === 0) {
                self.$refs.totalReportsNum.innerText = '---'
              } else {
                self.$refs.totalReportsNum.innerText = text
              }
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.shadow-opacity {
  opacity: 0.3
}
</style>
