<template>
  <v-card
    elevation="5"
    class="d-flex align-center bkop-medium pa-6"
  >
    <!--    <h1 class="headline d-flex align-center flex-row mb-4">-->
    <!--      <v-icon-->
    <!--        left-->
    <!--      >-->
    <!--        mdi-magnify-->
    <!--      </v-icon>-->

    <!--      搜索-->
    <!--    </h1>-->
    
    <GlobalSearch pure />
  </v-card>
</template>

<script>
import GlobalSearch from "@/components/search/GlobalSearch";
export default {
  name: "HomeSearch",
  components: {GlobalSearch}
}
</script>

<style scoped>

</style>