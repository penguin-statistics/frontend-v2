<template>
  <figure
    v-if="useCreatureIcon"
    class="creature-icon"
    :style="{backgroundPosition: `0 ${-creature * 24}px`, backgroundImage: `url(${cdnDeliver('/images/themes/seaborn/creature-icon.png')})`}"
  />
  <v-icon v-else>
    {{ normalIcon }}
  </v-icon>
</template>

<script>
import CDN from "@/mixins/CDN";

export default {
  name: 'SeabornCreatureIcon',
  mixins: [CDN],
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
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 24px 384px;
  transform: scale(1.5);
}
</style>
