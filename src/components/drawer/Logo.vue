<template>
  <div
    :class="{
      'drawer-logo blue': true,
      'darken-4': dark,
      'darken-3': !dark,
      'drawer-logo--two-line': $t('app.name_line2') !== ''
    }"
  >
    <v-img
      :src="cdnResource('/logos/penguin_stats_logo.png')"
      aspect-ratio="1"
      height="192px"
      contain
    />
    <div class="white--text description">
      <v-row
        align="center"
        justify="center"
        class="flex-column"
      >
        <span>{{ $t('app.name_line1') }}</span>
        <span>{{ $t('app.name_line2') }}</span>
      </v-row>
    </div>
  </div>
</template>

<script>
  import Theme from "@/mixins/Theme";
  import CDN from "@/mixins/CDN";

  export default {
    name: "Logo",
    mixins: [Theme, CDN]
  }
</script>

<style scoped>

</style>