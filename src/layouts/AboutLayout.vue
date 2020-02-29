<template>
  <v-container
    class="fill-height justify-center"
  >
    <v-row align="center">
      <v-col class="pa-0">
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
    name: "AboutLayout"
  }
</script>