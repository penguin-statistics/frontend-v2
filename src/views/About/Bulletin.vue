<i18n>
  {
    "zh": {
      "bulletin": {
        "bulletin_0": "12月24日的更新中添加了4种新素材，第4、5章部分关卡添加了这些素材的掉落，导致这些关卡的掉率结果可能会受到影响。",
        "bulletin_1": "企鹅数据团队正在努力解决中，由此带来的不便敬请谅解。（掉落汇报不受影响）"
      }
    },
    "en": {
      "bulletin": {
        "bulletin_0": "12月24日的更新中添加了4种新素材，第4、5章部分关卡添加了这些素材的掉落，导致这些关卡的掉率结果可能会受到影响。",
        "bulletin_1": "企鹅数据团队正在努力解决中，由此带来的不便敬请谅解。（掉落汇报不受影响）"
      }
    },
    "ja": {
      "bulletin": {
        "bulletin_0": "12月24日的更新中添加了4种新素材，第4、5章部分关卡添加了这些素材的掉落，导致这些关卡的掉率结果可能会受到影响。",
        "bulletin_1": "企鹅数据团队正在努力解决中，由此带来的不便敬请谅解。（掉落汇报不受影响）"
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
            <br>
            {{ $t('bulletin.bulletin_1') }}
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
