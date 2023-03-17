<template>
  <div class="d-flex flex-column align-center justify-center fill-height full-width">
    <v-row class="full-width">
      <v-col
        v-for="(link, index) in links.ark"
        :key="index"
        class="d-flex"
        cols="12"
        sm="6"
        md="4"
      >
        <LinkCard
          :link="link"
          @navigate="goToHref"
        />
      </v-col>
    </v-row>
    <v-row class="full-width">
      <v-col cols="12">
        <v-divider />
      </v-col>
    </v-row>
    <v-row class="full-width">
      <v-col
        v-for="(link, index) in links.deprecated"
        :key="index"
        class="d-flex"
        cols="12"
        sm="6"
        md="4"
      >
        <LinkCard
          :link="link"
          @navigate="goToHref"
        />
      </v-col>
    </v-row> 
    <v-row class="full-width">
      <v-col cols="12">
        <v-divider />
      </v-col>
    </v-row>
    <v-row class="full-width">
      <v-col
        v-for="(link, index) in links.misc"
        :key="index"
        class="d-flex"
        cols="12"
        sm="6"
        md="6"
      >
        <LinkCard
          :link="link"
          @navigate="goToHref"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import anime from 'animejs'
import LinkCard from "@/views/About/LinkCard";

export default {
  name: 'Links',
  components: { LinkCard },
  data () {
    return {
      links: {
        ark: [
          {
            title: '干员培养表',
            author: '凤瞳',
            features: [
              {
                name: 'character',
                color: 'orange'
              },
              {
                name: 'materials',
                color: 'indigo'
              },
              {
                name: 'planner',
                color: 'indigo'
              },
              {
                name: 'storage',
                color: 'purple'
              },
              {
                name: 'map',
                color: 'teal'
              }
            ],
            url: 'https://ark-nights.com',
            shorten: 'ark-nights.com'
          },
          {
            title: '刷素材推荐一图流',
            author: 'SrO²、根派',
            features: [
              {
                name: 'apRanking',
                color: 'grey'
              },
              {
                name: 'dropRateRanking',
                color: 'grey'
              },
              {
                name: 'generalRanking',
                color: 'grey'
              }
            ],
            url: 'https://aog.wiki/',
            shorten: 'aog.wiki'
          },
          {
            title: 'PRTS',
            features: [
              {
                name: 'cn_wiki',
                color: 'blue-grey'
              }
            ],
            url: 'http://prts.wiki/id/1',
            shorten: 'prts.wiki'
          },
          {
            title: '明日方舟一图流',
            author: 'Zirunwang、山桜',
            features: [
              {
                name: 'apRanking',
                color: 'grey'
              },
              {
                name: 'dropRateRanking',
                color: 'grey'
              },
              {
                name: 'generalRanking',
                color: 'grey'
              },
              {
                name: 'storeEfficiency',
                color: 'grey'
              },
              {
                name: 'gachaPlanning',
                color: 'grey'
              }
            ],
            url: 'https://aog.wiki/',
            shorten: 'aog.wiki'
          },
          {
            title: 'ANWiki',
            features: [
              {
                name: 'jp_wiki',
                color: 'blue-grey'
              }
            ],
            url: 'https://wiki.gamerclub.jp/anwiki',
            shorten: 'wiki.gamerclub.jp/anwiki'
          },
          {
            title: 'ゲームの果て',
            author: '方舟航海図',
            features: [
              {
                name: 'character',
                color: 'orange'
              },
              {
                name: 'walkthrough',
                color: 'brown'
              },
              {
                name: 'experience',
                color: 'brown'
              },
              {
                name: 'ja_translation',
                color: 'blue-grey'
              }
            ],
            url: 'https://smartgamecap.net',
            shorten: 'smartgamecap.net'
          }
        ],
        deprecated: [
          {
            title: '明日方舟工具箱',
            author: '一只灰喵',
            features: [
              {
                name: 'hr',
                color: 'cyan'
              },
              {
                name: 'levelup',
                color: 'green'
              },
              {
                name: 'materials',
                color: 'indigo'
              },
              {
                name: 'planner',
                color: 'indigo'
              },
              {
                name: 'storage',
                color: 'purple'
              }
            ],
            url: 'https://aktools.graueneko.xyz/',
            shorten: 'aktools.graueneko.xyz'
          },
          {
            title: 'ARK TOOLS',
            author: 'Laplace',
            features: [
              {
                name: 'character',
                color: 'orange'
              },
              {
                name: 'enemy',
                color: 'black'
              },
              {
                name: 'materials',
                color: 'indigo'
              },
              {
                name: 'planner',
                color: 'indigo'
              }
            ],
            url: 'https://gachasalt.github.io/ArkToolDemo/#/',
            shorten: 'gachasalt.github.io/ArkToolDemo'
          },
          {
            title: 'Kokodayo Arknights Data',
            author: 'odex',
            features: [
              {
                name: 'character',
                color: 'orange'
              },
              {
                name: 'enemy',
                color: 'black'
              },
              {
                name: 'map',
                color: 'teal'
              }
            ],
            url: 'https://kokodayo.fun/',
            shorten: 'kokodayo.fun'
          },
        ],
        misc: [
          {
            title: 'Konmai Academy',
            // author: '「纯净的音游下载站」',
            description: '公益的音乐游戏下载站',
            url: 'https://616.sb/',
            shorten: '616.sb'
          },
        ]
      }
    }
  },
  mounted () {
    anime({
      targets: '.link-card',
      translateY: [48, 0],
      opacity: [0, 1],
      duration: 425,
      delay: (el, i) => i * 50,
      easing: 'easeOutQuint'
    })
  },
  methods: {
    goToHref (link) {
      this.$ga.event('redirect', 'links', link.title, 1)
    }
  }
}
</script>

