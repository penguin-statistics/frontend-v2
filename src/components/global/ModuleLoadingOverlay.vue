<template>
  <v-overlay
    color="rgb(18, 18, 18)"
    :value="loadingRoute"
    :opacity="0.8"
    style="z-index: 1000000"
  >
    <v-row class="justify-center text-center">
      <v-col
        cols="12"
      >
        <v-card
          class="text-left pa-2 pt-1"
          min-width="350"
          elevation="24"
        >
          <v-card-title v-text="$t('fetch.chunk.title')" />
          <v-card-subtitle v-text="$t('fetch.chunk.subtitle')" />
          <v-card-text>
            <v-progress-linear
              indeterminate
              color="primary"
              height="6"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-overlay>
</template>

<script>
  export default {
    name: "ModuleLoadingOverlay",

    computed: {
      loadingRoute() {
        return this.$store.getters['ui/loadingRoute'];
      }
    },
  }
</script>

<style scoped>

</style>