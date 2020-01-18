<template>
  <v-container
    class="fill-height"
    fluid
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
    name: "StatsLayout"
  }
</script>

<style>
  .hovering::after {
    transition: all 225ms cubic-bezier(0.165, 0.84, 0.44, 1);
    content: "\232A";
    font-size: 16px;
    opacity: 0;
    margin-left: 5px;
    margin-top: -4px;
    transform: translateX(0px);
  }

  .hovering.hovering--hovered::after {
    opacity: 1;
    margin-left: 8px;
  }
</style>