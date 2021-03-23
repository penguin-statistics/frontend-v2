<template>
  <v-container
    class="fill-height justify-center lg-wider-container"
  >
    <v-row align="center">
      <v-col>
        <transition
          name="slide-fade"
          mode="out-in"
        >
          <router-view />
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AboutLayout'
}
</script>

<style scoped>
  @media (min-width: 960px) {
    .lg-wider-container {
      max-width: 1255px !important;
    }
  }

</style>
