<template>
  <v-card
    elevation="5"
    class="bulletin-card overflow-hidden text-enlarged-effect"
    height="160px"
  >
    <v-img
      gradient="to bottom right, rgba(0, 0, 0, .2), rgba(0, 0, 0, .7)"
      src="https://portal.xastatic.com/common/background.jpg"
      height="160px"
      class="overflow-hidden"
    >
      <div class="d-flex align-center justify-center fill-height display-1 text-enlarged-effect--effector no-pointer-events">
        X Academy 2021
      </div>
    </v-img>

    <div class="sponsor-label caption pa-2">
      <span class="no-pointer-events">
        本内容由赞助商提供
      </span>

      <v-btn
        icon
        x-small
      >
        <v-icon x-small>
          mdi-help-circle
        </v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "XAcademy"
}
</script>

<style scoped lang="scss">
.sponsor-label {
  position: absolute;
  bottom: 0;
  right: 0;

  opacity: 0.5;
}
.no-pointer-events {
  pointer-events: none;
}

.text-enlarged-effect {
  .text-enlarged-effect--effector {
    transition: all .8s cubic-bezier(0.22, 1, 0.36, 1);
    opacity: 1;
    transform: none;
  }

  &:hover .text-enlarged-effect--effector {
    opacity: 0.1;
    transform: scale(2) rotate(-5deg);
  }
}

</style>