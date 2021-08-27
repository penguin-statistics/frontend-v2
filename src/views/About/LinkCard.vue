<i18n>
{
  "en": {
    "links": {
      "tags": {
        "apRanking": "AP Efficiency Ranking",
        "character": "Operators List",
        "cn_wiki": "CN Server Wiki",
        "dropRateRanking": "Drop Rate Ranking",
        "enemy": "Enemies List",
        "experience": "Experience",
        "generalRanking": "General Ranking",
        "hr": "Recruiting Lookup",
        "ja_translation": "Japanese Translation of Main Story",
        "jp_wiki": "JP Server Wiki",
        "levelup": "Level Up Calculator",
        "materials": "Material Requirement Calculator",
        "planner": "Planner",
        "storage": "Inventory Management",
        "walkthrough": "Walkthrough",
        "map": "Map",
        "video": "Clear Guide"
      }
    }
  },
  "ja": {
    "links": {
      "tags": {
        "apRanking": "理性効率順位表",
        "character": "オペレーター一覧",
        "cn_wiki": "大陸版Wiki",
        "dropRateRanking": "ドロップ率順位表",
        "enemy": "レユニオン一覧",
        "experience": "ゲームレビュー",
        "generalRanking": "総合収益順位表",
        "hr": "公募一覧",
        "ja_translation": "ストーリー和訳",
        "jp_wiki": "日本版Wiki",
        "levelup": "レベル計算機",
        "materials": "素材必要数計算機",
        "planner": "周回計画作成ツール",
        "storage": "素材在庫管理",
        "walkthrough": "ステージ攻略",
        "map": "マップ",
        "video": "攻略動画"
      }
    }
  },
  "ko": {
    "links": {
      "tags": {
        "apRanking": "이성 효율 순위",
        "character": "오퍼레이터 목록",
        "cn_wiki": "중국서버 위키",
        "dropRateRanking": "드랍률 순위",
        "enemy": "적 목록",
        "experience": "팁 모음",
        "generalRanking": "종합 순위",
        "hr": "공개모집 계산기",
        "ja_translation": "메인스토리 일본어 번역",
        "jp_wiki": "일본서버 위키",
        "levelup": "레벨링 계산기",
        "materials": "육성 재료 계산기",
        "planner": "계획기",
        "storage": "창고 관리기",
        "walkthrough": "공략집",
        "map": "Map",
        "video": "Clear Guide"
      }
    }
  },
  "zh": {
    "links": {
      "tags": {
        "apRanking": "理智效率排行",
        "character": "角色查看",
        "cn_wiki": "国服wiki",
        "dropRateRanking": "掉率排行",
        "enemy": "整合图鉴",
        "experience": "经验分享",
        "generalRanking": "综合收益排行",
        "hr": "公招查询",
        "ja_translation": "剧情日文翻译",
        "jp_wiki": "日服Wiki",
        "levelup": "升级计算",
        "materials": "材料需求计算",
        "planner": "刷图规划",
        "storage": "库存管理",
        "walkthrough": "通关攻略",
        "map": "作战地图",
        "video": "攻略视频"
      }
    }
  }
}
</i18n>

<template>
  <v-card
    class="d-flex flex-column link-card bkop-light position-relative"
  >
    <v-card-title
      v-if="link.title"
      primary-title
      class="px-4 pt-4 pb-2"
    >
      <div>
        <div class="title">
          {{ link.title }}
        </div>
        <span
          v-if="link.author"
          class="subtitle-1"
        >by {{ link.author }}</span>
      </div>
    </v-card-title>

    <v-card-title
      v-if="link.features"
      primary-title
      class="px-4 py-1"
    >
      <v-chip
        v-for="(feature, featIndex) in link.features"
        :key="featIndex"
        :color="feature.color"
        class="ma-1"

        text-color="white"
      >
        {{ $t(`links.tags.${feature.name}`) }}
      </v-chip>
    </v-card-title>

    <v-card-text v-if="link.description">
      <p
        v-marked
        class="markdown-content-inline"
        v-text="link.description"
      />
    </v-card-text>

    <v-row
      v-if="link.url"
      class="flex-grow-1 px-4 pt-2"
      align="end"
      justify="center"
    >
      <v-btn
        v-ripple
        color="secondary"
        class="ma-2 mb-4"
        text-color="white"
        :href="link.url"
        target="_blank"
        rel="noopener"
        @click="$emit('navigate', link.url)"
      >
        <span
          class="subtitle-1 "
          style="text-transform: initial"
        >
          {{ link.shorten }}
        </span>
        <v-icon
          right
          small
        >
          mdi-open-in-new
        </v-icon>
      </v-btn>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'LinkCard',
  props: {
    link: Object
  }
}
</script>
<style scoped>
.link-card {
  width: 100%;
  /*border: 1px solid rgba(255, 255, 255, 0.75) !important;*/
}

.theme--light .link-card {
  /*border: 1px solid rgba(0, 0, 0, 0.75) !important;*/
}
</style>