<template>
  <div v-if="activeThemeStyle === 'seaborn'">
    <div
      class="seaborn-background"
      :style="{backgroundImage: `url('${cdnDeliver('/images/themes/seaborn/bg0.jpg')}')`}"
    />
    <div
      class="seaborn-shadow"
      :style="{backgroundImage: `url('${cdnDeliver('/images/themes/seaborn/shadow.png')}')`}"
    />
    <div
      class="seaborn-mist"
      :style="{backgroundImage: `url('${cdnDeliver('/images/themes/seaborn/mist.png')}')`}"
    />
    <SeabornTapwaves />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SeabornTapwaves from "@/components/themes/SeabornTapwaves.vue";
import CDN from "@/mixins/CDN";

export default {
  name: 'SeabornBackground',
  components: {SeabornTapwaves},
  mixins: [CDN],
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
  background-repeat: no-repeat;
  background-position: center center;
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
  background-repeat: no-repeat;
  background-position: center center;
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
  background-repeat: repeat-x;
  background-position: bottom center;
  background-size: auto 80px;
}
</style>
