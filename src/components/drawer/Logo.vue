<template>
  <div
    :class="{
      'drawer-logo blue': true,
      'darken-4': dark,
      'darken-3': !dark,
      'drawer-logo--two-line': $t('app.name_line2') !== ''
    }"
  >
    <!--    <v-img-->
    <!--      :src="cdnDeliver('/images/themes/new-year/portrait.jpg')"-->
    <!--      style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0.3; z-index: 0"-->
    <!--    />-->
    <v-img
      :src="cdnDeliver('/logos/penguin_stats_logo.png')"
      aspect-ratio="1"
      height="128px"
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
import Theme from '@/mixins/Theme'
import CDN from '@/mixins/CDN'

export default {
  name: 'Logo',
  mixins: [Theme, CDN]
}
</script>

<style scoped>

</style>
