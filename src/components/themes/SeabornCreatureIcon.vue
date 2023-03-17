<template>
  <figure
    v-if="useCreatureIcon"
    class="creature-icon"
    :style="{backgroundPosition: `0 ${-creature * 24}px`}"
  />
  <v-icon v-else>
    {{ normalIcon }}
  </v-icon>
</template>

<script>
export default {
  name: 'SeabornCreatureIcon',
  props: {
    creature: {
      type: Number,
      required: true
    },
    normalIcon: {
      type: String,
      required: true
    },
  },
  computed: {
    useCreatureIcon() {
      return this.$store.getters['ui/activeThemeStyle'] === 'seaborn'
    }
  }
}
</script>

<style scoped>
.creature-icon {
  width: 24px;
  height: 24px;
  background-image: url('/seaborn/creature-icon.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 24px 384px;
  transform: scale(1.5);
}
</style>
