<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      v-for="(link, index) in links"
      :key="index"
      d-flex
      sm6
      md4
    >
      <v-card
        class="bkop-light"
        data-aos="fade"
      >
        <v-card-title
          v-if="link.title"
          primary-title
          class="px-3 pt-3 pb-2"
        >
          <div>
            <div>
              {{ link.title }}
            </div>
            <span v-if="link.author">by {{ link.author }}</span>
          </div>
        </v-card-title>

        <v-card-title
          v-if="link.features"
          primary-title
          class="px-3 py-1"
        >
          <v-chip
            v-for="(feature, featIndex) in link.features"
            :key="featIndex"
            class="ma-1"
            :color="feature.color"
            label
            text-color="white"
          >
            {{ feature.name }}
          </v-chip>
        </v-card-title>
        <div
          v-if="link.url"
          class="px-3 pt-2 pb-3"
        >
          <v-layout
            align-center
            justify-center
            row
            fill-height
          >
            <v-chip
              class="ma-2"
              color="primary"
              text-color="white"
              @click="goToHref(link.url)"
            >
              {{ link.title }}
              <v-icon right>
                mdi-share
              </v-icon>
            </v-chip>
          </v-layout>
        </div>
        <v-layout
          align-center
          justify-center
          fill-height
        >
          <div
            v-if="link.text"
            class="pa-3"
          >
            <v-layout
              align-center
              justify-center
              row
              fill-height
            >
              {{ link.text }}
            </v-layout>
          </div>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
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
              name: "公招查询",
              color: "cyan"
            },
            {
              name: "升级计算",
              color: "green"
            },
            {
              name: "材料需求计算",
              color: "indigo"
            },
            {
              name: "刷图规划",
              color: "indigo"
            },
            {
              name: "库存管理",
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
              name: "角色查看",
              color: "orange"
            },
            {
              name: "整合图鉴",
              color: "black"
            },
            {
              name: "材料需求计算",
              color: "indigo"
            },
            {
              name: "刷图规划",
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
              name: "角色查看",
              color: "orange"
            },
            {
              name: "材料需求计算",
              color: "indigo"
            },
            {
              name: "刷图规划",
              color: "indigo"
            },
            {
              name: "库存管理",
              color: "purple"
            }
          ],
          url: "https://ark-nights.com"
        },
        {
          title: "刷素材一图流",
          author: "Kindle",
          features: [
            {
              name: "理智效率排行",
              color: "grey"
            },
            {
              name: "掉率排行",
              color: "grey"
            },
            {
              name: "综合收益排行",
              color: "grey"
            }
          ],
          url: "https://dwz.cn/AkhN4Va6"
        },
        {
          title: "酒馆攻略组",
          author: "麻辣花蛤",
          features: [
            {
              name: "通关攻略",
              color: "brown"
            },
            {
              name: "经验分享",
              color: "brown"
            }
          ],
          url: "https://www.pigeonpub.com"
        },
        {
          title: "ゲームの果て",
          author: "方舟航海図",
          features: [],
          url: "https://smartgamecap.net"
        }
      ]
    };
  },
  mounted() {
    if (!this.$vuetify.breakpoint.xsOnly && this.links && this.links.length % 2 !== 0) {
      this.links.push({
        text: "陆续添加中..."
      });
    }
  },
  methods: {

    goToHref(href) {
      window.open(href);
    }
  }
};
</script>
