<template>
  <div
    :class="{
      'drawer-logo primary': true,
      'darken-2': dark,
      'darken-1': !dark,
      'drawer-logo--two-line': $t('app.name_line2') !== ''
    }"
    class="position-relative"
  >
    <v-img
      :src="cdnDeliver('/images/themes/new-year/portrait.jpg')"
      style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0.3; z-index: 0"
    />
    <v-img
      :src="cdnDeliver('/logos/penguin_stats_logo.png')"
      aspect-ratio="1"
      height="128px"
      contain
    />
    <div
      class="white--text description position-relative"
      style="z-index: 0"
    >
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