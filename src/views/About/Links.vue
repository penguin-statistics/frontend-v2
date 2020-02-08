<i18n>
  {
    "zh": {
      "links": {
        "tags": {
          "hr": "公招查询",
          "levelup": "升级计算",
          "materials": "材料需求计算",
          "planner": "刷图规划",
          "storage": "库存管理",
          "character": "角色查看",
          "enemy": "整合图鉴",
          "apRanking": "理智效率排行",
          "dropRateRanking": "掉率排行",
          "generalRanking": "综合收益排行",
          "walkthrough": "通关攻略",
          "experience": "经验分享",
          "ja_translation": "剧情日文翻译",
          "jp_wiki": "日服Wiki"
        }
      }
    },
    "en": {
      "links": {
        "tags": {
          "hr": "Public Recruiting Lookup",
          "levelup": "Level Up Calculator",
          "materials": "Material Requirement Calculator",
          "planner": "Planner",
          "storage": "Inventory Management",
          "character": "Operators List",
          "enemy": "Enemies List",
          "apRanking": "AP Efficiency Ranking",
          "dropRateRanking": "Drop Rate Ranking",
          "generalRanking": "General Ranking",
          "walkthrough": "Walkthrough",
          "experience": "Experience",
          "ja_translation": "Japanese Translation of Main Story",
          "jp_wiki": "JP Server Wiki"
        }
      }
    },
    "ja": {
      "links": {
        "tags": {
          "hr": "公募一覧",
          "levelup": "レベル計算機",
          "materials": "素材必要数計算機",
          "planner": "周回計画作成ツール",
          "storage": "素材在庫管理",
          "character": "オペレーター一覧",
          "enemy": "レユニオン一覧",
          "apRanking": "理性効率順位表",
          "dropRateRanking": "ドロップ率順位表",
          "generalRanking": "総合収益順位表",
          "walkthrough": "ステージ攻略",
          "experience": "ゲームレビュー",
          "ja_translation": "ストーリー和訳",
          "jp_wiki": "日本版Wiki"
        }
      }
    }
  }
</i18n>

<template>
  <v-row>
    <v-col
      v-for="(link, index) in links"
      :key="index"
      class="d-flex"
      sm="6"
      md="4"
    >
      <v-card
        data-aos="fade"
        class="link-card bkop-light elevation-0"
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
            label
            text-color="white"
          >
            {{ $t(`links.tags.${feature.name}`) }}
          </v-chip>
        </v-card-title>
        <div
          v-if="link.url"
          class="px-4 pt-2 pb-4"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-chip
              class="ma-2"
              color="primary"
              text-color="white"
              @click="goToHref(link)"
            >
              <v-icon
                left
                small
              >
                mdi-link
              </v-icon>
              {{ link.title }}
            </v-chip>
          </v-row>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Links",
  data() {
    return {
      links: [
        {
          title: "明日方舟工具箱",
          author: "一只灰喵",
          features: [
            {
              name: "hr",
              color: "cyan"
            },
            {
              name: "levelup",
              color: "green"
            },
            {
              name: "materials",
              color: "indigo"
            },
            {
              name: "planner",
              color: "indigo"
            },
            {
              name: "storage",
              color: "purple"
            }
          ],
          url: "https://aktools.graueneko.xyz/"
        },
        {
          title: "ARK TOOLS",
          author: "Laplace",
          features: [
            {
              name: "character",
              color: "orange"
            },
            {
              name: "enemy",
              color: "black"
            },
            {
              name: "materials",
              color: "indigo"
            },
            {
              name: "planner",
              color: "indigo"
            }
          ],
          url: "https://gachasalt.github.io/ArkToolDemo/#/"
        },
        {
          title: "干员培养表",
          author: "凤瞳",
          features: [
            {
              name: "character",
              color: "orange"
            },
            {
              name: "materials",
              color: "indigo"
            },
            {
              name: "planner",
              color: "indigo"
            },
            {
              name: "storage",
              color: "purple"
            }
          ],
          url: "https://ark-nights.com"
        },
        {
          title: "刷素材推荐一图流",
          author: "SrO²、根派",
          features: [
            {
              name: "apRanking",
              color: "grey"
            },
            {
              name: "dropRateRanking",
              color: "grey"
            },
            {
              name: "generalRanking",
              color: "grey"
            }
          ],
          url: "https://arkonegraph.herokuapp.com/"
        },
        {
          title: "ゲームの果て",
          author: "方舟航海図",
          features: [
            {
              name: "character",
              color: "orange"
            },
            {
              name: "walkthrough",
              color: "brown"
            },
            {
              name: "experience",
              color: "brown"
            },
            {
              name: "ja_translation",
              color: "blue-grey"
            }
          ],
          url: "https://smartgamecap.net"
        },
        {
          title: "ANWiki",
          features: [
            {
              name: "jp_wiki",
              color: "blue-grey"
            },
            {
              name: "walkthrough",
              color: "brown"
            },
            {
              name: "character",
              color: "orange"
            }
          ],
          url: "https://wiki.gamerclub.jp/anwiki"
        }
      ]
    };
  },
  methods: {
    goToHref(link) {
      this.$ga.event('redirect', 'links', link.title, 1)
      window.open(link.url);
    }
  }
};
</script>

<style scoped>
.link-card {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.75);
}

.monospace {
  font-family: SF Mono, Consolas, Courier, Courier New, monospace;
  font-size: 10px;
}
</style>
