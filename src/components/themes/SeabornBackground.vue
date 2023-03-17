<template>
  <div v-if="activeThemeStyle === 'seaborn'">
    <div
      class="seaborn-background"
    />
    <div
      class="seaborn-shadow"
    />
    <div
      class="seaborn-mist"
    />
    <SeabornTapwaves />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SeabornTapwaves from "@/components/themes/SeabornTapwaves.vue";

export default {
  name: 'SeabornBackground',
  components: {SeabornTapwaves},
  computed: {
    ...mapGetters('ui', ['activeThemeStyle']),
  }
}
</script>

<style scoped>
.seaborn-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: url('/seaborn/bg0.jpg') no-repeat center center;
  background-size: cover;
}

.seaborn-shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0.75;
  pointer-events: none;
  background: url('/seaborn/shadow.png') no-repeat center center;
  background-size: cover;
}

.seaborn-mist {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 10;
  opacity: 0.9;
  pointer-events: none;
  background: url('/seaborn/mist.png') repeat-x bottom center;
  background-size: auto 80px;
}
</style>
