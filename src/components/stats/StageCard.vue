<template>
  <v-card
    hover
    :class="{'d-inline-flex ma-1 stage-card': true, 'stage-card--light': !dark, 'stage-card--dark': dark }"
    ripple
  >
    <v-card-title class="subtitle-1 py-1 px-3">
      {{ stage.code }}
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    name: "StageCard",
    props: {
      stage: {
        type: Object,
        required: true
      },
    },
    computed: {
      dark() {
        return this.$vuetify.theme.dark;
      }
    },
  }
</script>

<style scoped>
  .stage-card--light {
    background: rgba(224, 224, 224, 0.8);
    border: 1px solid rgba(32, 32, 32, 0.95);
  }
  .stage-card--dark {
    background: rgba(32, 32, 32, 0.8);
    border: 1px solid rgba(224, 224, 224, 0.95);
  }
</style>