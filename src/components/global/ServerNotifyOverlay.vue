<i18n>
  {
    "zh": {
      "switchedTo": "服务器已切换至"
    },
    "en": {
      "switchedTo": "Server switched to"
    },
    "ja": {
      "switchedTo": "サーバー切り替え中"
    }
  }
</i18n>

<template>
  <v-overlay
    color="rgb(18, 18, 18)"
    :value="serverNotifyOverlay"
    :opacity="0.95"
    style="z-index: 1000000"
  >
    <v-row class="justify-center text-center">
      <v-col
        cols="12"
      >
        <v-icon
          ref="notifyOverlayIcon"
          :size="48"
          style="opacity: 0"
        >
          mdi-server
        </v-icon>
        <h1
          ref="notifyOverlayTitle"
          class="heading mt-4 mb-6"
          style="opacity: 0"
        >
          {{ $t('switchedTo') }}
        </h1>

        <h2
          ref="notifyOverlayServerName"
          class="monospace"
          style="font-size: 96px; opacity: 0"
        >
          {{ $t('server.servers.' + $store.getters['dataSource/server']) }}
        </h2>
      </v-col>
    </v-row>
  </v-overlay>
</template>

<script>
  import {mapGetters} from "vuex";
  import anime from "animejs";

  export default {
    name: "ServerNotifyOverlay",

    data() {
      return {
        serverNotifyOverlay: false
      }
    },

    computed: {
      ...mapGetters("dataSource", ["server"]),
    },

    watch: {
      server() {
        this.serverNotifyOverlay = true

        const self = this;

        this.$nextTick(function () {
          anime.timeline({
            duration: 1000,
            easing: "easeOutExpo"
          })
            .add({
              targets: self.$refs["notifyOverlayIcon"]["$el"],
              opacity: [0, 1],
              translateY: ["-15px", "0px"],
            }, 250)
            .add({
              targets: self.$refs["notifyOverlayTitle"],
              opacity: [0, 1],
              translateY: ["-20px", "0px"],
            }, 400)
            .add({
              targets: self.$refs["notifyOverlayServerName"],
              opacity: [0, 1],
              duration: 900,
              translateY: ["-40px", "0px"],
            }, 500)

          setTimeout(function () {
            anime.timeline({
              duration: 500,
              easing: "easeInExpo"
            })
              .add({
                targets: self.$refs["notifyOverlayIcon"]["$el"],
                opacity: [1, 0],
                translateY: ["0px", "15px"],
              }, 250)
              .add({
                targets: self.$refs["notifyOverlayTitle"],
                opacity: [1, 0],
                translateY: ["0px", "20px"],
              }, 200)
              .add({
                targets: self.$refs["notifyOverlayServerName"],
                opacity: [1, 0],
                duration: 550,
                translateY: ["0px", "40px"],
              }, 125)
          }, 1500)

        })

        setTimeout(function () {
          self.serverNotifyOverlay = false
        }, 2500)
      }
    },
  }
</script>

<style scoped>

</style>