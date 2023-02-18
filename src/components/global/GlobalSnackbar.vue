<template>
  <v-snackbar
    v-model="snackbar.enabled"
    bottom
    :timeout="snackbar.timeout"
    :color="snackbar.color"
  >
    <v-icon
      class="mr-4"
      color="white"
    >
      {{ snackbar.icon }}
    </v-icon>
    {{ $t(snackbar.text, snackbar.extra) }}
    <v-spacer />
    <v-btn
      v-haptic
      text
      @click="snackbar.enabled = false"
    >
      {{ $t('meta.dialog.close') }}
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GlobalSnackbar',
  computed: {
    ...mapState('ui', ['snackbar'])
  }
}
</script>

<style scoped>

</style>
