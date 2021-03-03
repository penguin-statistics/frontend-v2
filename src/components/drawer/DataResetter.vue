<template>
  <v-dialog
    v-model="dialog"
    max-width="350px"
    persistent
  >
    <template v-slot:activator="props">
      <slot v-bind="props" />
    </template>
    <v-card class="slash-strip--danger">
      <v-card-title class="headline">
        <v-icon left>
          mdi-alert-circle
        </v-icon>
        <v-icon left>
          mdi-database-remove
        </v-icon>
        {{ $t('settings.data.reset.title') }}
      </v-card-title>

      <v-card-text class="subtitle-1">
        {{ deleted ? "数据与偏好设置已重置。请重启 App" : $t('settings.data.reset.subtitle') }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-haptic
          text
          :disabled="deleting || deleted"
          @click="cancel"
        >
          {{ $t('meta.dialog.cancel') }}
        </v-btn>
        <v-btn
          v-haptic
          color="error"
          :disabled="countdownNow !== 0"
          :loading="deleting || deleted"
          @click="reset"
        >
          {{ $t('meta.dialog.confirm') }}{{ countdownNow !== 0 ? ` (${countdownNow})` : "" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DataResetter',
  props: {
    enable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      countdownNow: 5,
      timer: null,
      deleting: false,
      deleted: false
    }
  },
  watch: {
    dialog (newValue) {
      if (newValue) {
        this.countdownNow = 5
        this.startCountdown()
      } else {
        this.stopCountdown()
      }
    }
  },
  created () {
    this.dialog = this.enable
  },
  destroyed () {
    this.stopCountdown()
  },
  methods: {
    cancel () {
      this.stopCountdown()
      this.dialog = false
    },
    reset () {
      this.deleting = true

      setTimeout(function () {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
        caches.keys().then(keys => {
          for (const key of keys) caches.delete(key)
        })
        localStorage.clear()
        window.location.reload()
      }, 1000)
    },
    startCountdown () {
      this.timer = setInterval(() => {
        this.countdownNow -= 1
        if (this.countdownNow === 0) this.stopCountdown()
      }, 1000)
    },
    stopCountdown () {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>

</style>
