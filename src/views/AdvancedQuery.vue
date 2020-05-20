<template>
  <v-container
    class="fill-height"
    fluid
  >
    <QueryMain cache />
  </v-container>
</template>

<script>
  import QueryMain from "@/components/advancedQuery/QueryMain";
  export default {
    name: "AdvancedQuery",
    components: {QueryMain},
  }
</script>

<style scoped>

</style>