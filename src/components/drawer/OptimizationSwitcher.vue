<template>
  <v-switch
    v-model="lowData"
    :label="$t('settings.optimization.lowData.title')"
    persistent-hint
    :hint="$t('settings.optimization.lowData.subtitle')"
  />
</template>

<script>
  export default {
    name: "OptimizationSwitcher",
    computed: {
      lowData: {
        get () {
          return this.$store.getters["settings/lowData"]
        },
        set (value) {
          this.$store.commit("settings/changeOptimization", {
            type: "lowData",
            value: value
          })
        }
      }
    },
  }
</script>

<style scoped>

</style>