<template>
  <v-dialog
    v-model="dialog"
    max-width="350px"
    persistent
  >
    <template v-slot:activator="{ on }">
      <v-btn
        depressed
        block
        color="error"
        v-on="on"
      >
        <v-icon left>
          mdi-database-remove
        </v-icon>
        {{ $t('settings.data.reset.title') }}...
      </v-btn>
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

      <v-card-text>
        {{ $t('settings.data.reset.subtitle') }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          text
          :disabled="deleting"
          @click="cancel"
        >
          {{ $t('dialog.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          :disabled="countdownNow !== 0"
          :loading="deleting"
          @click="reset"
        >
          {{ $t('dialog.confirm') }}{{ countdownNow !== 0 ? ` (${countdownNow})` : "" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "DataResetter",
    data() {
      return {
        dialog: false,
        countdownNow: 5,
        timer: null,
        deleting: false
      }
    },
    watch: {
      dialog (newValue) {
        if (newValue) {
          this.countdownNow = 5;
          this.startCountdown();
        } else {
          this.stopCountdown();
        }
      }
    },
    destroyed () {
      this.stopCountdown()
    },
    methods: {
      cancel () {
        this.stopCountdown();
        this.dialog = false
      },
      reset() {
        this.deleting = true;

        setTimeout(function () {
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
              registration.unregister()
            }
          });
          caches.keys().then(keys => {
            for (const key of keys) caches.delete(key)
          });
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
    },
  }
</script>

<style scoped>

</style>