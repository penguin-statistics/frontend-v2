<template>
  <v-footer
    padless
    color="blue darken-3"
    class="white--text"
  >
    <v-card
      flat
      tile
      width="100%"
      class="blue darken-3 text-center footer--safe-area my-1"
    >
      <v-card-text class="white--text d-inline">
        <strong>Penguin Statistics</strong> — <strong>{{ version.VERSION }}</strong>&nbsp;<span class="overline monospace">{{ version.GIT_COMMIT }}-{{ version.ENV }}</span>
      </v-card-text>

      <v-card-text
        v-if="true"
        class="white--text d-block pt-2 pb-0 overline"
        style="letter-spacing: .075em !important;"
      >
        <span>
          京ICP备xxxxxxxx号-x
        </span>
        <span class="ml-1">
          <v-img
            style="transform: translateY(.275em)"
            alt="公安网备案图标"
            :src="cdnResource('/logos/gonganwang.png')"
            class="d-inline-block"
            height="12"
            width="12"
            contain
          />
          京公网安备xxxxxxxxxxxxxx号
        </span>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  import Mirror from "@/mixins/Mirror";
  import config from "@/config";
  import CDN from "@/mixins/CDN";

  export default {
    name: "Footer",
    mixins: [Mirror, CDN],
    computed: {
      version () {
        return {
          VERSION: config.version || "v0.0.0",
          GIT_COMMIT: GIT_COMMIT.trim(),
          ENV: process.env.NODE_ENV === 'production' ? "prod" : "dev"
        }
      }
    },
  }
</script>

<style scoped>

</style>