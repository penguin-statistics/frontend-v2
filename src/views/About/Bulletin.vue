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
  <v-card class="bkop-light pa-6">
    <h1 class="headline">
      {{ $t('menu.about.bulletin') }}
    </h1>
    <v-row>
      <v-card-title>
        <v-col
          cols="12"
        >
          <p
            class="subtitle-1 line-height-wide"
          >
            {{ $t('bulletin.bulletin_0') }}
            <br>
            {{ $t('bulletin.bulletin_1') }}
          </p>
        </v-col>
      </v-card-title>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'Bulletin'
}
</script>

<style scoped>
  .line-height-wide {
    line-height: 1.8
  }
</style>
