<template>
  <v-card
    color="primary"
    elevation="5"
    class="bkop-medium pa-6 py-12 d-flex align-center justify-center text-center position-relative"
  >
    <v-img
      :src="require('@/assets/themes/new-year/banner.jpg')"
      width="100%"
      height="100%"
      style="position: absolute; top: 0; left: 0; opacity: 0.3; z-index: 0"
    />

    <h1 class="display-1 position-relative">
      企鹅物流数据统计恭祝各位刀客塔新年快乐，身体健康，万事如意
    </h1>
  </v-card>
</template>

<script>
export default {
name: "Banner"
}
</script>

<style scoped>

</style>