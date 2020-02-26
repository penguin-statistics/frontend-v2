<template>
  <v-container
    class="align-start"
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
