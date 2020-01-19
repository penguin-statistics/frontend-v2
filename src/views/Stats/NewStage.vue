<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} ~ {1}",
      "zone": {
        "name": "章节",
        "types": {
          "MAINLINE": "主线",
          "WEEKLY": "物资筹备",
          "ACTIVITY_OPEN": "限时活动（开放中）",
          "ACTIVITY_CLOSED": "限时活动（已结束）"
        },
        "status": {
          "closed": "已结束",
          "open": "开放中"
        }
      },
      "stage": {
        "name": "关卡",
        "apCost": "{apCost} 点理智",
        "loots": {
          "normal": "常规掉落",
          "extra": "额外物资",
          "special": "特殊掉落"
        }
      },
      "stats": {
        "name": "统计结果",
        "title": "{stage} 统计结果"
      }
    },
    "en": {
      "opensAt": "Opens At: {0} ~ {1}",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
          "ACTIVITY_OPEN": "Event (Opening)",
          "ACTIVITY_CLOSED": "Event (Closed)"
        },
        "status": {
          "closed": "Closed",
          "open": "Opening"
        }
      },
      "stage": {
        "name": "Stage",
        "apCost": "{apCost} AP required",
        "loots": {
          "normal": "Normal",
          "extra": "Extra",
          "special": "Special"
        }
      },
      "stats": {
        "name": "Statistics",
        "title": "Statistics of {stage}"
      }
    },
    "ja": {
      "opensAt": "開催期間：{0} ~ {1}",
      "zone": {
        "name": "章",
        "types": {
          "MAINLINE": "メインストーリー",
          "WEEKLY": "曜日クエスト",
          "ACTIVITY_OPEN": "イベント（開催中）",
          "ACTIVITY_CLOSED": "イベント（終了）"
        },
        "status": {
          "closed": "終了",
          "open": "開催中"
        }
      },
      "stage": {
        "name": "作戦",
        "apCost": "消費理智：{apCost}",
        "loots": {
          "normal": "通常ドロップ",
          "extra": "エクストラドロップ",
          "special": "スペシャルドロップ"
        }
      },
      "stats": {
        "name": "統計結果",
        "title": "{stage} 統計結果"
      }
    }
  }
</i18n>

<template>
  <NewStageSelector :name="$t('stats.name')">
    hello!
  </NewStageSelector>
</template>

<script>
  import NewStageSelector from "@/components/NewStageSelector";

export default {
  name: "NewStatsByStage",
  components: {NewStageSelector},
  data: () => ({
    expanded: {},
    selected: {
      stage: null,
    },
    tablePagination: {
      rowsPerPage: -1,
      sortBy: "percentage",
      descending: true
    }
  })
};
</script>

<style scoped>
.theme--light .zoneTitle {
  color: #fff;
}

.v-table {
  background: transparent !important;
}

.charts-data-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.charts-wrapper {
  display: flex;
  align-items: center;
}

::v-deep .stat-table th {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

.item-name-td-xs {
  min-width: 100px;
}

.item-name-td-sm {
  min-width: 160px;
}

::v-deep .stat-table th i {
  margin-left: -16px;
}
</style>
