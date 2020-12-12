<template>
  <v-card
    elevation="5"
    class="d-flex flex-column align-center justify-center bkop-medium pa-6"
  >
    <h1
      v-if="!valid"
      class="headline d-flex align-center flex-row mb-4"
    >
      <v-icon
        left
      >
        mdi-magnify
      </v-icon>

      {{ $t('menu.search') }}
    </h1>
    
    <GlobalSearch
      pure
      :valid.sync="valid"
    />
  </v-card>
</template>

<script>
import GlobalSearch from "@/components/search/GlobalSearch";
export default {
  name: "HomeSearch",
  components: {GlobalSearch},
  data() {
    return {
      valid: false
    }
  },
}
</script>

<style scoped>

</style>