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
        svg-inline
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
      text
      outlined
      href="https://creativecommons.org/licenses/by-nc/4.0/"
      target="_blank"
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
  export default {
    name: "License"
  }
</script>

<style scoped>

</style>