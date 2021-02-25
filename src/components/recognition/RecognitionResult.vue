<template>
  <v-container
    style="max-width: 600px"
    class="my-2"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="4"
      >
        <v-row no-gutters>
          <v-col
            cols="4"
            class="subtitle-1 text-center"
          >
            {{ $t(`server.servers.${server}`) }}
          </v-col>
          <v-col
            cols="8"
            class="subtitle-1 text-center"
          >
            <svg
              v-for="index of [1, 2, 3]"
              :key="index"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 128 128"
              xml:space="preserve"
              :style="`height: 32px; width: 32px; opacity: 0; animation: star 1s ease ${index*0.5}s forwards`"
            >
              <path
                :fill="index<=shouldShowStar ? '#77E7FD':'grey'"
                d="M64,15L20.7,40v50L64,115l43.3-25V40L64,15z M53.34,40.54L60,36.69V29c0-2.21,1.79-4,4-4s4,1.79,4,4v7.69 l6.66,3.85c1.91,1.1,2.57,3.55,1.46,5.46c-1.1,1.91-3.55,2.57-5.46,1.46L64,43.62l-6.66,3.85c-1.91,1.1-4.36,0.45-5.46-1.46 C50.77,44.09,51.43,41.64,53.34,40.54z M74.66,65.54c1.91,1.1,2.57,3.55,1.46,5.46c-1.1,1.91-3.55,2.57-5.46,1.46L64,68.62 l-6.66,3.85c-1.91,1.1-4.36,0.45-5.46-1.46c-1.1-1.91-0.45-4.36,1.46-5.46L60,61.69V54c0-2.21,1.79-4,4-4s4,1.79,4,4v7.69 L74.66,65.54z M31.69,53.04l6.66-3.85V41.5c0-2.21,1.79-4,4-4s4,1.79,4,4v7.69l6.66,3.85c1.91,1.1,2.57,3.55,1.46,5.46 c-1.1,1.91-3.55,2.57-5.46,1.46l-6.66-3.85l-6.66,3.85c-1.91,1.1-4.36,0.45-5.46-1.46C29.12,56.59,29.78,54.14,31.69,53.04z M49.01,84.96l-6.66-3.85l-6.66,3.85c-1.91,1.1-4.36,0.45-5.46-1.46c-1.1-1.91-0.45-4.36,1.46-5.46l6.66-3.85V66.5 c0-2.21,1.79-4,4-4s4,1.79,4,4v7.69l6.66,3.85c1.91,1.1,2.57,3.55,1.46,5.46C53.37,85.41,50.92,86.07,49.01,84.96z M76.12,96 c-1.1,1.91-3.55,2.57-5.46,1.46L64,93.62l-6.66,3.85c-1.91,1.1-4.36,0.45-5.46-1.46c-1.1-1.91-0.45-4.36,1.46-5.46L60,86.69V79 c0-2.21,1.79-4,4-4s4,1.79,4,4v7.69l6.66,3.85C76.57,91.64,77.23,94.09,76.12,96z M97.77,83.5c-1.1,1.91-3.55,2.57-5.46,1.46 l-6.66-3.85l-6.66,3.85c-1.91,1.1-4.36,0.45-5.46-1.46c-1.1-1.91-0.45-4.36,1.46-5.46l6.66-3.85V66.5c0-2.21,1.79-4,4-4s4,1.79,4,4 v7.69l6.66,3.85C98.22,79.14,98.88,81.59,97.77,83.5z M97.77,58.5c-1.1,1.91-3.55,2.57-5.46,1.46l-6.66-3.85l-6.66,3.85 c-1.91,1.1-4.36,0.45-5.46-1.46c-1.1-1.91-0.45-4.36,1.46-5.46l6.66-3.85V41.5c0-2.21,1.79-4,4-4s4,1.79,4,4v7.69l6.66,3.85 C98.22,54.14,98.88,56.59,97.77,58.5z"
              />
            </svg>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            class="display-1 text-center"
          >
            {{ $t("report.recognition.result") }}
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="8"
      >
        <v-badge
          class="mx-2"
          bottom
          offset-x="15"
          offset-y="15"
          style="opacity: 0; animation: postMove 1s ease 2s forwards"
        >
          <template v-slot:badge>
            <span class="monospace-pure">{{ success }}</span>
          </template>
          <v-avatar
            size="64"
            color="success"
          >
            <v-icon size="48">
              mdi-check-bold
            </v-icon>
          </v-avatar>
        </v-badge>
        <v-badge
          :class="{'mx-2': true, 'd-none': warning === 0}"
          bottom
          offset-x="15"
          offset-y="15"
          style="opacity: 0; animation: postMove 1s ease 2.5s forwards"
        >
          <template v-slot:badge>
            <span class="monospace-pure">{{ warning }}</span>
          </template>
          <v-avatar
            size="64"
            color="warning"
          >
            <v-icon size="48">
              mdi-alert
            </v-icon>
          </v-avatar>
        </v-badge>
        <v-badge
          :class="{'mx-2': true, 'd-none': error === 0}"
          bottom
          offset-x="15"
          offset-y="15"
          style="opacity: 0; animation: postMove 1s ease 3s forwards"
        >
          <template v-slot:badge>
            <span class="monospace-pure">{{ error }}</span>
          </template>
          <v-avatar
            size="64"
            color="red darken-3"
          >
            <v-icon size="48">
              mdi-bug
            </v-icon>
          </v-avatar>
        </v-badge>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'RecognitionResult',
  props: {
    success: {
      type: Number,
      default () { return 0 }
    },
    warning: {
      type: Number,
      default () { return 0 }
    },
    error: {
      type: Number,
      default () { return 0 }
    },
    total: {
      type: Number,
      default () { return 0 }
    }
  },
  computed: {
    shouldShowStar: {
      get () {
        if (this.success === this.total) {
          return 3
        } else if (this.error === 0 && this.warning > 0) {
          return 2
        } else if (this.error > 0 && this.error < this.total) {
          return 1
        } else if (this.error === this.total || this.success === 0) {
          return 0
        } else {
          return 0
        }
      },
      set (newshouldShowStar) {
        return newshouldShowStar
      }
    },
    server() {
      return this.$store.getters["dataSource/server"];
    },
  }
}
</script>
<style>
@keyframes star {
  from {opacity: 0.2}
  to {opacity: 1}
}
@keyframes postMove {
  from {top: -20px; opacity:0}
  to {top: 0px; opacity:1}
}
</style>
