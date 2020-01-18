<template>
  <v-card
    hover
    :class="{'d-inline-flex ma-1 stage-card cursor-pointer': true, 'stage-card--light': !dark, 'stage-card--dark': dark }"
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
  .stage-card {
    transition: transform 50ms ease-out, box-shadow 35ms ease-out !important;
    user-select: none;
  }
  .stage-card:hover {
    transform: translateY(-0.5px);
  }
  .stage-card:active {
    transform: translateY(0.5px);
    box-shadow: 0px 0px 3px rgba(0, 0, 0, .5); /*  0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, .9), 0 0 45px rgba(255, 255, 255, .7), 0 0 60px 100px rgba(255, 255, 255, .5) */
  }
  .stage-card--light {
    background: rgba(224, 224, 224, 0.8);
    border: 1px solid rgba(32, 32, 32, 0.95);
  }
  .stage-card--dark {
    background: rgba(32, 32, 32, 0.8);
    border: 1px solid rgba(224, 224, 224, 0.95);
  }
</style>