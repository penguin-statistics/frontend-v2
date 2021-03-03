<template>
  <v-card
    color="primary"
    elevation="5"
    class="bkop-medium pa-6 py-12 d-flex align-center justify-center text-center position-relative"
    style="box-shadow: inset 0 0 2rem black !important;"
    dark
  >
    <v-img
      :src="cdnDeliver('/images/themes/new-year/landscape.jpg')"
      width="100%"
      height="100%"
      style="position: absolute; top: 0; left: 0; opacity: 0.3; z-index: 0"
    />

    <div class="position-relative">
      <div class="headline mb-2">
        企鹅物流数据统计恭祝各位刀客塔
      </div>
      <div class="display-1">
        新年快乐，身体健康，万事如意
      </div>
    </div>
  </v-card>
</template>

<script>
import CDN from '@/mixins/CDN'

export default {
  name: 'Banner',
  mixins: [CDN]
}
</script>

<style scoped>

</style>
