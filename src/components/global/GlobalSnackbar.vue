<i18n>
  {
    "zh": {
      "network": {
        "error": "网络请求失败，请检查网络后重试"
      },
      "clipboard": {
        "success": "复制成功",
        "error": "复制到剪贴板失败，请手动复制"
      },
      "planner": {
        "import": {
          "jsonError": "导入失败：数据格式错误，请检查后重试（{error}）",
          "success": "导入成功：导入了 {amount} 个物品数据"
        },
        "calculationError": "计算失败：{error}"
      },
      "pwaPopup": {
        "update": {
          "skipWaitingTimeout": "更新失败：ServiceWorker 超时。请刷新页面重试"
        }
      }
    },
    "en": {
      "network": {
        "error": "Network error, please check your internet connection and try again."
      },
      "clipboard": {
        "success": "Copied to clipboard",
        "error": "Failed to copy to clipboard, please manually select text and copy it"
      },
      "planner": {
        "import": {
          "jsonError": "Failed to import: Data parsing error, please check your input ({error})",
          "success": "Successfully imported data for {amount} items"
        },
        "calculationError": "Failed to calculate: {error}"
      },
      "pwaPopup": {
        "update": {
          "skipWaitingTimeout": "Failed to apply changes: ServiceWorker timed out. Please refresh page and try again"
        }
      }
    }
  }
</i18n>

<template>
  <v-snackbar
    v-model="snackbar.enabled"
    bottom
    :timeout="snackbar.timeout"
    :color="snackbar.color"
  >
    <v-icon class="mr-4">
      {{ snackbar.icon }}
    </v-icon>
    {{ $t(snackbar.text, snackbar.extra) }}
    <v-spacer />
    <!--    <v-btn-->
    <!--      text-->
    <!--      @click="snackbar.enabled = false"-->
    <!--    >-->
    <!--      {{ $t('dialog.close') }}-->
    <!--    </v-btn>-->
  </v-snackbar>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "GlobalSnackbar",
    computed: {
      ...mapState("ui", ["snackbar"])
    },
  }
</script>

<style scoped>

</style>