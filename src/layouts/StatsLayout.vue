<template>
  <v-container
    class="fill-height"
    fluid
  >
    <transition
      name="slide-fade"
      mode="out-in"
    >
      <router-view />
    </transition>
  </v-container>
</template>

<script>
  export default {
    name: "StatsLayout"
  }
</script>
