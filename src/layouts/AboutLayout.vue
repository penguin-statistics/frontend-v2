<template>
  <v-container
    class="fill-height"
  >
    <v-row align="center">
      <v-col>
        <transition
          name="slide-fade"
          mode="out-in"
        >
          about
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