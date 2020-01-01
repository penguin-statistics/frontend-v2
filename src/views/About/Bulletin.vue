<i18n>
  {
    "zh": {
      "bulletin": {
        "bulletin_0": "企鹅数据新年抽奖活动，转发微博即可参与。",
        "bulletin_1": "奖品实物图",
        "bulletin_2": "点我跳转"
      }
    },
    "en": {
      "bulletin": {
        "bulletin_0": "企鹅数据新年抽奖活动，转发微博即可参与。",
        "bulletin_1": "奖品实物图",
        "bulletin_2": "点我跳转"
      }
    },
    "ja": {
      "bulletin": {
        "bulletin_0": "企鹅数据新年抽奖活动，转发微博即可参与。",
        "bulletin_1": "奖品实物图",
        "bulletin_2": "点我跳转"
      }
    }
  }
</i18n>

<template>
  <v-card class="bkop-light pa-4">
    <h1 class="headline">
      {{ $t('menu.about.bulletin') }}
    </h1>
    <v-layout
      row
      wrap
    >
      <v-card-title>
        <v-flex
          xs12
        >
          <p
            class="subheading line-height-wide"
          >
            {{ $t('bulletin.bulletin_0') }}
            <v-btn
              href="https://www.weibo.com/6434065694/InnvF4n6n"
              target="_blank"
              flat
            >
              {{ $t('bulletin.bulletin_2') }}
              <v-icon
                right
                small
              >
                mdi-open-in-new
              </v-icon>
            </v-btn>
            <br>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span
                  style="border-bottom:1px dashed #ccc;"
                  v-on="on"
                >{{ $t('bulletin.bulletin_1') }}</span>
              </template>
              <v-img
                :src="'https://penguin-stats.s3.ap-southeast-1.amazonaws.com/bulletin/prize.jpg'"
                max-height="600px"
                min-width="340px"
                contain
              />
            </v-tooltip>
          </p>
        </v-flex>
      </v-card-title>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'Bulletin',
  methods: {
    goToHref(href) {
      window.open(href)
    }
  }
}
</script>

<style scoped>
  .line-height-wide {
    line-height: 1.8
  }
</style>
