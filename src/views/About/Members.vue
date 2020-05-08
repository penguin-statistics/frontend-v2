<i18n>
{
	"en": {
		"categories": {
			"developers": "Developers",
			"others": "Others",
			"owner": "Webmaster",
			"translators": "Translators"
		},
		"responsibilities": {
			"arkplanner": "Author of ArkPlanner",
			"backend": "Backend",
			"bulkupload": "Bulk Upload",
			"customersupport": "User Support",
			"frontend": "Frontend",
			"localization_ja": "Japanese Localization Provider",
			"localization_ko": "Korean Localization Provider",
			"logo": "Logo Designer",
			"maintenance": "DevOps",
			"materials": "Materials Supplier",
			"statistics": "Statistics and Analysis"
		},
		"socials": {
			"email": "Email",
			"github": "GitHub",
			"qq": "QQ",
			"twitter": "Twitter",
			"weibo": "Weibo"
		}
	},
	"ja": {
		"categories": {
			"developers": "開発者",
			"others": "その他",
			"owner": "管理人",
			"translators": "翻訳者"
		},
		"responsibilities": {
			"arkplanner": "ArkPlannerの著者",
			"backend": "バックエンド",
			"bulkupload": "一括アップロード",
			"customersupport": "顧客サービス",
			"frontend": "フロントエンド",
			"localization_ja": "日本語化",
			"localization_ko": "韓国語化",
			"logo": "ロゴデザイナー",
			"maintenance": "DevOps",
			"materials": "材料サプライヤー",
			"statistics": "データ統計解析"
		},
		"socials": {
			"email": "Email",
			"github": "GitHub",
			"qq": "QQ",
			"twitter": "Twitter",
			"weibo": "Weibo"
		}
	},
	"ko": {
		"categories": {
			"developers": "개발자",
			"others": "기타",
			"owner": "관리자",
			"translators": "번역가"
		},
		"responsibilities": {
			"arkplanner": "명일방주 계획기 제작",
			"backend": "백엔드",
			"bulkupload": "대량의 보고서 제출",
			"customersupport": "고객 지원",
			"frontend": "프론트엔드",
			"localization_ja": "일본 현지화 제공",
			"localization_ko": "한국 현지화 제공",
			"logo": "로고 디자이너",
			"maintenance": "데브옵스",
			"materials": "재료 이미지 제공",
			"statistics": "분석 및 통계"
		},
		"socials": {
			"email": "Email",
			"github": "GitHub",
			"qq": "QQ",
			"twitter": "Twitter",
			"weibo": "웨이보"
		}
	},
	"zh": {
		"categories": {
			"developers": "开发者",
			"others": "其他",
			"owner": "站长",
			"translators": "翻译"
		},
		"responsibilities": {
			"arkplanner": "ArkPlanner 作者",
			"backend": "后端",
			"bulkupload": "批量上传",
			"customersupport": "客服",
			"frontend": "前端",
			"localization_ja": "日语化",
			"localization_ko": "韩语化",
			"logo": "Logo 画师",
			"maintenance": "运维",
			"materials": "素材提供",
			"statistics": "统计分析"
		},
		"socials": {
			"email": "Email",
			"github": "GitHub",
			"qq": "QQ",
			"twitter": "Twitter",
			"weibo": "微博"
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
        class="bkop-light mb-4 members--list"
        two-line
        elevation="5"
      >
        <v-subheader :key="key">
          {{ $t(`categories.${key}`) }}
        </v-subheader>

        <v-list-item
          v-for="profile in value"
          :key="profile.name"
          class="grow px-4 members--list-item"
        >
          <v-list-item-avatar>
            <v-img
              :src="avatar(profile.avatar)"
            />
          </v-list-item-avatar>

          <v-list-item-content class="collaborator-profile">
            <v-list-item-title>
              {{ profile.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1">
              {{ renderResponsibility(profile.responsibility) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-row
              class="fill-height"
              align="center"
              justify="end"
            >
              <v-btn
                v-for="[id, url] in Object.entries(profile.socials)"
                :key="`${profile.name}-${id}`"
                icon
                :href="url"
                target="_blank"
                :title="$t(`socials.${id}`)"
              >
                <v-icon>
                  {{ getSocial(id).icon }}
                </v-icon>
              </v-btn>
            </v-row>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
  import anime from "animejs";
  import CDN from "@/mixins/CDN";

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
      ja: "localization_ja",
      ko: "localization_ko",
    }
  };
  export default {
    name: 'Members',
    mixins: [CDN],
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
              name: "GalvinGao",
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
              name: "根派",
              responsibility: [
                r.arkplanner
              ],
              avatar: "genpai.jpg",
              socials: {
                github: "https://github.com/SQRPI"
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
              name: "Blealtan",
              responsibility: [
                r.frontend
              ],
              avatar: "blealtan.png",
              socials: {
                github: "https://github.com/Blealtan"
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
          translators: [
            {
              name: "Syaro",
              responsibility: [
                r.localization.ko
              ],
              avatar: "syaro.png",
              socials: {
                twitter: "https://twitter.com/StarNight_ko"
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
    mounted () {
      anime({
        targets: '.members--list-item',
        translateY: [48, 0],
        opacity: [0, 1],
        duration: 775,
        delay: (el, i) => i * 75,
        easing: "easeOutQuint"
      })
      // anime({
      //   targets: '.members--list',
      //   translateY: [48, 0],
      //   opacity: [0, 1],
      //   duration: 425,
      //   delay: (el, i) => i * 175,
      //   easing: "easeOutQuint"
      // })
    },
    methods: {
      getSocial (id) {
        return this.socials.find(v => v.id === id)
      },
      renderResponsibility (responsibilities) {
        const translated = [];
        for (const responsibility of responsibilities) {
          translated.push(this.$t(`responsibilities.${responsibility}`))
        }
        return translated.join(this.$t('meta.separator'))
      },
      avatar (src) {
        return this.cdnResource(`/avatars/${src}`)
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
