<template>
  <transition name="slide-fade" mode="out-in">
    <router-view name="stats" />
  </transition>
</template>

<script>
  export default {
    name: "StatsLayout"
  }
</script>