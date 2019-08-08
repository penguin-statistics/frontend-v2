<i18n>
  {
    "zh": {
      "categories": {
        "owner": "站长",
        "contributors": "贡献者"
      },
      "socials": {
        "weibo": "微博",
        "github": "GitHub",
        "twitter": "Twitter",
        "qq": "QQ"
      }
    },
    "en": {
      "categories": {
        "owner": "Owner",
        "contributors": "Contributors"
      },
      "socials": {
        "weibo": "Weibo"
      }
    }
  }
</i18n>

<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm10 md8 lg7 xl6>
      <v-list
          two-line
          v-for="[key, value] in Object.entries(profiles)"
      >
        <v-subheader :key="key">
          {{$t('categories.' + key)}}
        </v-subheader>

        <v-list-tile avatar class="grow px-3" v-for="(profile, index) in value">
          <v-list-tile-avatar>
            <v-img
                :src="'https://penguin-stats.s3-ap-southeast-1.amazonaws.com/avatar/' + profile.avatar"
            />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              {{ profile.name }}
            </v-list-tile-title>

            <v-list-tile-sub-title>
              {{ profile.responsibility }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-layout
                align-center
                justify-end
            >
              <v-tooltip bottom v-for="[id, url] in Object.entries(profile.socials)">
                <template v-slot:activator="{ on }">
                  <v-btn
                      class="mx-1"
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
            </v-layout>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'Members',
    data () {
      return {
        profiles: {
          owner: [{
            name: "AlvISs_红白",
            responsibility: "前端 后端 运维",
            avatar: "hongbai.jpg",
            socials: {
              weibo: "https://www.weibo.com/u/6434065694",
              twitter: "https://twitter.com/AlvISs_Reimu",
              github: "https://github.com/AlvISsReimu",
              qq: "https://wpa.qq.com/msgrd?v=3&uin=498704999&site=qq&menu=yes"
            }
          }],
          contributors: [
            {
              name: "🦀",
              responsibility: "ArkPlanner作者",
              avatar: "xie.jpeg",
              socials: {
                github: "https://github.com/ycremar"
              }
            },
            {
              name: "YukiC",
              responsibility: "后端",
              avatar: "yukic.jpg",
              socials: {
                github: "https://github.com/cyj5230"
              }
            },
            {
              name: "Galvin Gao",
              responsibility: "前端",
              avatar: "gg.png",
              socials: {
                github: "https://github.com/GalvinGao"
              }
            },
            {
              name: "路夏早苗",
              responsibility: "前端",
              avatar: "sanae.jpeg",
              socials: {
                github: "https://github.com/RokaSanae"
              }
            },
            {
              name: "Einzithy.D",
              responsibility: "统计分析",
              avatar: "j.png",
              socials: {
                github: "https://github.com/Einzithy-D"
              }
            },
            {
              name: "Nemunemu",
              responsibility: "客服",
              avatar: "nemunemu.jpg",
              socials: {
                weibo: "https://www.weibo.com/nemunemu"
              }
            },
            {
              name: "侠",
              responsibility: "logo画师",
              avatar: "xia.png",
              socials: {
                weibo: "https://www.weibo.com/u/2290638732"
              }
            },
            {
              name: "SrO²",
              responsibility: "素材制作",
              avatar: "sr.png",
              socials: {
                github: "https://github.com/Strontium233"
              }
            },
            {
              name: "水晶泡芙",
              responsibility: "素材提供",
              avatar: "paofu.png",
              socials: {
                github: "https://github.com/Evealicemier"
              }
            },
            {
              name: "ChaosNiku",
              responsibility: null,
              avatar: "chaosniku.png",
              socials: {
                github: "https://github.com/ChaosNiku"
              }
            },
            {
              name: "AsahiLuna",
              responsibility: null,
              avatar: "luna.png",
              socials: {
                github: "https://github.com/AsahiLuna"
              }
            },
            {
              name: "冰糖雪梨橙#9594",
              responsibility: null,
              avatar: "wish.png",
              socials: {
                github: "https://github.com/jdgjxxchy"
              }
            }
          ],
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
      }
    }
  }
</script>

<style scoped>
  .cursor-default {
    cursor: default;
  }
</style>
