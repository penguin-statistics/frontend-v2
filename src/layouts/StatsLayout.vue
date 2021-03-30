<template>
  <v-container
    class="fill-height justify-center align-start"
    fluid
  >
    <v-row
      align="start"
      no-gutters
      style="max-width: inherit"
    >
      <v-col>
        <transition
          name="fade-transition"
          leave-active-class="position-absolute"
          :duration="325"
        >
          <router-view />
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StatsLayout'
}
</script>
