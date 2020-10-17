<i18n>
{
	"en": {
		"clipboard": {
			"error": "Failed to copy to clipboard, please manually select text and copy it",
			"success": "Copied to clipboard"
		},
		"network": {
			"error": "Network error, please check your internet connection and try again."
		},
		"planner": {
			"calculationError": "Failed to calculate: {error}",
			"import": {
				"invalidJSON": "Import Failed: Invalid JSON, please check your input",
				"unrecognized": "Import Failed: Unable to recognize config file",
				"success": "Successfully imported data for {amount} items"
			}
		}
	},
	"ko": {
		"clipboard": {
			"error": "클립보드에 복사하지 못했습니다. 텍스트를 수동으로 선택하고 복사해주세요.",
			"success": "클립보드에 복사되었습니다."
		},
		"network": {
			"error": "네트워크 오류. 인터넷 연결을 확인한 후 다시 시도하세요."
		},
		"planner": {
			"calculationError": "계산오류: {error}",
			"import": {
				"invalidJSON": "가져오지 못했습니다. 데이터 구문 분석 오류입니다. 입력값을 확인해 주세요.",
				"success": "{amount}개 항목에 대한 데이터를 성공적으로 가져왔습니다."
			}
		}
	},
	"zh": {
		"clipboard": {
			"error": "复制到剪贴板失败，请手动复制",
			"success": "复制成功"
		},
		"network": {
			"error": "网络请求失败，请检查网络后重试"
		},
		"planner": {
			"calculationError": "计算失败：{error}",
			"import": {
				"invalidJSON": "导入失败：JSON 格式错误，请检查后重试",
				"unrecognized": "导入失败：无法识别此配置文件，请检查后重试",
				"success": "导入成功：导入了 {amount} 个物品数据"
			}
		}
	},
	"ja": {
		"clipboard": {
			"error": "クリップボードに保存できませんでした。手動でコピーしてください",
			"success": "クリップボードに保存しました"
		},
		"network": {
			"error": "ネットワークエラー。インターネット接続をご確認の上もう一度お試しください"
		},
		"planner": {
			"calculationError": "計算失敗：{error}",
			"import": {
				"invalidJSON": "インポート失敗：無効なJSONです。コードを確認して、もう一度お試しください",
				"unrecognized": "インポート失敗：このコードは読み取れません。もう一度お試しください。",
				"success": "インポート成功： {amount} アイテムデータがインポートされます"
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
    <v-icon
      class="mr-4"
      color="white"
    >
      {{ snackbar.icon }}
    </v-icon>
    {{ $t(snackbar.text, snackbar.extra) }}
    <v-spacer />
    <v-btn
      text
      @click="snackbar.enabled = false"
    >
      {{ $t('meta.dialog.close') }}
    </v-btn>
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