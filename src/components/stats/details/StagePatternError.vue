<template>
  <v-card
    color="transparent"
    flat
    style="height: 290px"
    class="d-flex flex-column align-center justify-center monospace border-light mt-2"
  >
    <span class="heading">
      {{ $t('pattern.error').split('\n')[0] }}
    </span>
    <span class="headline">
      {{ $t('pattern.error').split('\n')[1] }}
    </span>
  </v-card>
</template>

<script>
export default {
  name: 'StagePatternError'
}
</script>

<style scoped>
.border-light {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #ccc, inset 0 0 8rem rgba(0, 0, 0, .5)
}
</style>
