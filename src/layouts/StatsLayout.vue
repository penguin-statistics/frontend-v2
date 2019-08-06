<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout align-center>
      <v-flex>
        <transition
          name="slide-fade"
          mode="out-in"
        >
          <router-view />
        </transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "StatsLayout"
  }
</script>