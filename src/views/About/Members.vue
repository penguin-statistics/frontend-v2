<i18n>
  {
    "zh": {
      "categories": {
        "owner": "站长",
        "developers": "开发者",
        "others": "其他"
      },
      "socials": {
        "weibo": "微博",
        "github": "GitHub",
        "twitter": "Twitter",
        "qq": "QQ",
        "email": "Email"
      },
      "responsibilities": {
        "frontend": "前端",
        "backend": "后端",
        "maintenance": "运维",
        "statistics": "统计分析",
        "arkplanner": "ArkPlanner 作者",
        "bulkupload": "批量上传",
        "customersupport": "客服",
        "logo": "Logo 画师",
        "materials": "素材提供",
        "localization_ja": "日语化"
      }
    },
    "en": {
      "categories": {
        "owner": "Webmaster",
        "developers": "Developers",
        "others": "Others"
      },
      "socials": {
        "weibo": "Weibo",
        "github": "GitHub",
        "twitter": "Twitter",
        "qq": "QQ",
        "email": "Email"
      },
      "responsibilities": {
        "frontend": "Frontend",
        "backend": "Backend",
        "maintenance": "DevOps",
        "statistics": "Statistics and Analysis",
        "arkplanner": "Author of ArkPlanner",
        "bulkupload": "Bulk Upload",
        "customersupport": "Customer Support",
        "logo": "Logo Designer",
        "materials": "Materials Supplier",
        "localization_ja": "Japanese Localization Provider"
      }
    },
    "ja": {
      "categories": {
        "owner": "管理人",
        "developers": "開発者",
        "others": "その他"
      },
      "socials": {
        "weibo": "Weibo",
        "github": "GitHub",
        "twitter": "Twitter",
        "qq": "QQ",
        "email": "Email"
      },
      "responsibilities": {
        "frontend": "フロントエンド",
        "backend": "バックエンド",
        "maintenance": "DevOps",
        "statistics": "データ統計解析",
        "arkplanner": "ArkPlannerの著者",
        "bulkupload": "一括アップロード",
        "customersupport": "顧客サービス",
        "logo": "ロゴデザイナー",
        "materials": "材料サプライヤー",
        "localization_ja": "日本語化"
      }
    }
  }
</i18n>

<template>
  <v-row
    justify="center"
  >
    <v-col
      cols="12"
      sm="10"
      md="8"
      lg="7"
      xl="6"
    >
      <v-list
        v-for="[key, value] in Object.entries(profiles)"
        :key="key"
        class="bkop-light mb-1"
        two-line
      >
        <v-subheader :key="key">
          {{ $t('categories.' + key) }}
        </v-subheader>

        <v-list-item
          v-for="profile in value"
          :key="profile.name"
          class="grow px-4"
        >
          <v-list-item-avatar>
            <v-img
              :src="'https://penguin-stats.s3.ap-southeast-1.amazonaws.com/avatars/' + profile.avatar"
            />
          </v-list-item-avatar>

          <v-list-item-content class="collaborator-profile">
            <v-list-item-title>
              {{ profile.name }}
            </v-list-item-title>

            <v-list-item-subtitle style="white-space: pre-line;">
              {{ renderResponsibility(profile.responsibility) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-row
              class="fill-height"
              align="center"
              justify="end"
            >
              <v-tooltip
                v-for="[id, url] in Object.entries(profile.socials)"
                :key="`${profile.name}-${id}`"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    @click="openTab(url)"
                    v-on="on"
                  >
                    <v-icon>
                      {{ getSocial(id).icon }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t(`socials.${id}`) }}</span>
              </v-tooltip>
            </v-row>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
  const r = {
    frontend: "frontend",
    backend: "backend",
    maintenance: "maintenance",
    statistics: "statistics",
    arkplanner: "arkplanner",
    bulkupload: "bulkupload",
    customersupport: "customersupport",
    logo: "logo",
    materials: "materials",
    localization: {
      ja: "localization_ja"
    }
  }
  export default {
    name: 'Members',
    data () {
      return {
        profiles: {
          owner: [{
            name: "AlvISs_红白",
            responsibility: [
              r.frontend,
              r.backend,
              r.maintenance,
            ],
            avatar: "hongbai.jpg",
            socials: {
              weibo: "https://www.weibo.com/u/6434065694",
              twitter: "https://twitter.com/AlvISs_Reimu",
              github: "https://github.com/AlvISsReimu",
              qq: "https://wpa.qq.com/msgrd?v=3&uin=498704999&site=qq&menu=yes",
              email: "mailto:alvissreimu@gmail.com"
            }
          }],
          developers: [
            {
              name: "Galvin Gao",
              responsibility: [
                r.frontend
              ],
              avatar: "gg.png",
              socials: {
                github: "https://github.com/GalvinGao"
              }
            },
            {
              name: "YukiC",
              responsibility: [
                r.backend
              ],
              avatar: "yukic.jpg",
              socials: {
                github: "https://github.com/cyj5230"
              }
            },
            {
              name: "AsahiLuna",
              responsibility: [
                r.frontend
              ],
              avatar: "luna.png",
              socials: {
                github: "https://github.com/AsahiLuna"
              }
            },
            {
              name: "🦀",
              responsibility: [
                r.arkplanner
              ],
              avatar: "xie.jpeg",
              socials: {
                github: "https://github.com/ycremar"
              }
            },
            {
              name: "Einzithy.D",
              responsibility: [
                r.statistics
              ],
              avatar: "j.png",
              socials: {
                github: "https://github.com/Einzithy-D"
              }
            },
            {
              name: "ChaosNiku",
              responsibility: [
                r.backend
              ],
              avatar: "chaosniku.png",
              socials: {
                github: "https://github.com/ChaosNiku"
              }
            },
            {
              name: "SrO²",
              responsibility: [
                r.bulkupload
              ],
              avatar: "sr.png",
              socials: {
                github: "https://github.com/Strontium233"
              }
            },
            {
              name: "路夏早苗",
              responsibility: [
                r.frontend
              ],
              avatar: "sanae.jpeg",
              socials: {
                github: "https://github.com/RokaSanae"
              }
            },
            {
              name: "冰糖雪梨橙#9594",
              responsibility: [
                r.frontend
              ],
              avatar: "wish.png",
              socials: {
                github: "https://github.com/jdgjxxchy"
              }
            }
          ],
          others: [
            {
              name: "Nemunemu",
              responsibility: [
                r.customersupport
              ],
              avatar: "nemunemu.jpg",
              socials: {
                weibo: "https://www.weibo.com/nemunemu"
              }
            },
            {
              name: "侠",
              responsibility: [
                r.logo
              ],
              avatar: "xia.png",
              socials: {
                weibo: "https://www.weibo.com/u/2290638732"
              }
            },
            {
              name: "水晶泡芙",
              responsibility: [
                r.materials
              ],
              avatar: "paofu.png",
              socials: {
                github: "https://github.com/Evealicemier"
              }
            },
            {
              name: "方舟航海図",
              responsibility: [
                r.localization.ja
              ],
              avatar: "koukaizu.jpg",
              socials: {
                twitter: "https://twitter.com/Arkn1ghts"
              }
            },
            {
              name: "ウィン",
              responsibility: [
                r.localization.ja
              ],
              avatar: "win.png",
              socials: {
                twitter: "https://twitter.com/Winterer000000"
              }
            }
          ]
        },
        socials: [
          {
            "id": "weibo",
            "name": "Weibo",
            "icon": "mdi-sina-weibo"
          },
          {
            "id": "twitter",
            "name": "Twitter",
            "icon": "mdi-twitter"
          },
          {
            "id": "github",
            "name": "GitHub",
            "icon": "mdi-github-circle"
          },
          {
            "id": "qq",
            "name": "QQ",
            "icon": "mdi-qqchat"
          },
          {
            "id": "email",
            "name": "Email",
            "icon": "mdi-email"
          }
        ]
      }
    },
    methods: {
      openTab (url) {
        window.open(url)
      },
      getSocial (id) {
        return this.socials.find(v => v.id === id)
      },
      renderResponsibility (responsibilities) {
        let translated = [];
        for (let responsibility of responsibilities) {
          translated.push(this.$t(`responsibilities.${responsibility}`))
        }
        return translated.join(this.$t('meta.separator'))
      }
    }
  }
</script>

<style scoped>
  .cursor-default {
    cursor: default;
  }

  .collaborator-profile {
    min-width: 45%;
  }
</style>
