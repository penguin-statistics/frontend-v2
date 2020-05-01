<template>
  <v-container
    class="fill-height justify-center"
    fluid
  >
    <v-row align="start">
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
    name: "StatsLayout"
  }
</script>
