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
      md6
    >
      <v-card
        class="bkop-light"
      >
        <v-card-title primary-title>
          <div>
            <div>
              {{ link.title }}
            </div>
            <span>by {{ link.author }}</span>
          </div>
        </v-card-title>
        
        <v-card-title primary-title>
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
        <v-card-title primary-title>
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
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Links",
  data() {
    return {
      lorem: 'sadsasddsadasdsa',
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
              color: "blue"
            },
            {
              name: "刷图规划",
              color: "blue"
            },
            {
              name: "库存管理",
              color: "grey"
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
              color: "yellow"
            },
            {
              name: "整合图鉴",
              color: "black"
            },
            {
              name: "材料需求计算",
              color: "blue"
            },
            {
              name: "刷图规划",
              color: "blue"
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
              color: "yellow"
            },
            {
              name: "材料需求计算",
              color: "blue"
            },
            {
              name: "刷图规划",
              color: "blue"
            },
            {
              name: "库存管理",
              color: "grey"
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
        }
      ]
    };
  },
  methods: {
    goToHref(href) {
      window.open(href);
    }
  }
};
</script>
