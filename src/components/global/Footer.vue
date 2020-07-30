<template>
  <v-footer
    padless
    :color="primaryColor"
    class="white--text"
  >
    <v-card
      flat
      tile
      width="100%"
      :color="primaryColor"
      class="text-center footer--safe-area mt-1 mb-2"
    >
      <v-card-text class="white--text d-inline">
        <strong>Penguin Statistics</strong>
        —
        <strong>{{ version.VERSION }}</strong>
        <span class="overline monospace condensed ml-1">{{ version.GIT_COMMIT }}</span>
      </v-card-text>

      <v-expand-transition>
        <v-card-text
          v-if="isInSpecialUI"
          class="white--text d-block pt-2 pb-0 overline"
        >
          <span>
            致敬英雄，逝者安息
          </span>
        </v-card-text>
      </v-expand-transition>

      <v-card-text
        v-if="isCNMirror"
        class="white--text d-block pt-2 pb-0 overline condensed"
      >
        <a
          href="http://www.beian.miit.gov.cn/"
          rel="noreferrer nofollow"
          target="_blank"
          class="clear-link"
        >
          京ICP备20012825号-1
        </a>
        <span class="ml-1">
          <v-img
            style="transform: translateY(.275em)"
            alt="公安网备案图标"
            :src="cdnDeliver('/logos/gonganwang.png')"
            class="d-inline-block"
            height="12"
            width="12"
            contain
          />
          京公网安备11010502040863号
        </span>
      </v-card-text>

      <v-card-text
        v-if="isVercel"
        class="white--text d-block pt-2 pb-0 overline"
      >
        <span>
          Vercel 预览构建
        </span>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  import Mirror from "@/mixins/Mirror";
  import config from "@/config";
  import CDN from "@/mixins/CDN";
  import SpecialUI from "@/mixins/SpecialUI";

  export default {
    name: "Footer",
    mixins: [Mirror, CDN, SpecialUI],
    computed: {
      version () {
        return {
          VERSION: config.version || "v0.0.0",
          GIT_COMMIT: GIT_COMMIT.trim() || "unknown"
        }
      }
    },
  }
</script>

<style scoped>
.condensed {
  letter-spacing: .075em !important;
}
  .clear-link {
    color: inherit !important;
    text-decoration: none !important;
  }
</style>