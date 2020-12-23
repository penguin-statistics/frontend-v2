<template>
  <v-card
    elevation="5"
    class="bkop-light pa-6"
  >
    <h1
      class="headline"
    >
      <span>
        {{ $t('meta.footer.copyright.title') }}
      </span>
      <img
        :src="require('@/assets/ccIcon/cc-by-nc.svg')"
        class="d-inline align-center ml-1"
        height="24"
        alt="Creative Commons: BY NC"
        style="transform: translateY(4px)"
      >
    </h1>

    <p class="subtitle-1 mt-3">
      {{ $t('meta.footer.copyright.content') }}
    </p>

    <v-btn
      v-haptic
      text
      outlined
      @click="goTo('https://creativecommons.org/licenses/by-nc/4.0/')"
    >
      {{ $t('meta.details') }}
      <v-icon
        right
        small
      >
        mdi-open-in-new
      </v-icon>
    </v-btn>
  </v-card>
</template>

<script>
  import GoTo from "@/mixins/GoTo";
  export default {
    name: "License",
    mixins: [GoTo],
  }
</script>

<style scoped>

</style>