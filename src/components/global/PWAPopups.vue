<i18n>
  {
    "zh": {
      "update": {
        "refresh": "体验新版",
        "success": "更新啦！"
      }
    },
    "en": {
      "update": {
        "refresh": "Refresh",
        "success": "Website Updated!"
      }
    }
  }
</i18n>

<template>
  <v-snackbar
    v-model="update.enabled"
    color="success"
    :timeout="0"
    bottom
  >
    <v-row
      align="center"
      class="mx-0"
    >
      <v-icon class="mr-4">
        mdi-file-check
      </v-icon>

      {{ $t('update.success') }}

      <v-spacer />

      <v-btn
        class="ml-4"
        color="secondary"
        depressed
        :loading="update.loading"
        @click="refresh"
      >
        <v-icon
          small
          class="mr-1"
        >
          mdi-refresh
        </v-icon>
        {{ $t('update.refresh') }}
      </v-btn>
    </v-row>
  </v-snackbar>
</template>

<script>
  import snackbar from "@/utils/snackbar";

  export default {
    name: "PWAPopups",
    data() {
      return {
        update: {
          enabled: window.SW_UPDATED || false,
          loading: false,
        }
      }
    },
    created () {
      const context = this;
      window.addEventListener("message", context.serviceWorkerMessageHandler)
    },
    beforeDestroy () {
      const context = this;
      window.removeEventListener("message", context.serviceWorkerMessageHandler)
    },
    methods: {
      serviceWorkerMessageHandler (evt) {
        console.log(evt, evt.data, evt.data.from === "serviceWorker", evt.data.action === "updated");
        if (evt && evt.data && evt.data.from === "serviceWorker" && evt.data.action === "updated") {
          this.update.enabled = true
        }
      },
      refresh() {
        this.update.loading = true;
        window.postMessage({
          to: "serviceWorker",
          action: "skipWaiting"
        }, "*");

        setTimeout(() => {
          this.update.loading = false;
          this.update.enabled = false;
          snackbar.launch("error", 10000, "pwaPopup.update.skipWaitingTimeout")
        }, 5000)
      }
    },
  }
</script>

<style scoped>

</style>