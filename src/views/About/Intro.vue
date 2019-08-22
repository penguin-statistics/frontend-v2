<i18n>
  {
    "zh": {
      "intro": {
        "intro_0": "欢迎来到企鹅物流数据统计！",
        "intro_1": "企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于各作战素材掉落统计分析。",
        "intro_2": "目前绝大部分数据由玩家手动上传，为了尽量减少谎报、误报对结果的影响，企鹅数据团队会对掉落进行多方位的审查。"
      }
    },
    "en": {
      "intro": {
        "intro_0": "Welcome to Penguin Statistics!",
        "intro_1": "企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于各作战素材掉落统计分析。",
        "intro_2": "目前绝大部分数据由玩家手动上传，为了尽量减少谎报、误报对结果的影响，企鹅数据团队会对掉落进行多方位的审查。"
      }
    },
    "ja": {
      "intro": {
        "intro_0": "ペンギン急便データ統計処理部門（Penguin Statistics）へようこそ！",
        "intro_1": "Penguin Statisticsはペンギン急便のデータ処理部門であり(嘘)、各作戦での素材ドロップの統計分析を行っています。",
        "intro_2": "現在ほとんどのデータはユーザーの手によって手動でアップロードされており、誤った情報や誤った情報による影響を最小限に抑えるためにペンギンデータアナライズチームはドロップアイテムについて様々な確度から審査しています。"
      }
    }
  }
</i18n>

<template>
  <v-layout
    align-center
    justify-center
    row
    wrap
    class="ma-5"
  >
    <v-img
      :src="require('@/assets/logo.png')"
      aspect-ratio="1"
      max-height="128px"
      min-width="128px"
      contain
      class="my-4"
    />
    <v-flex
      xs12
      sm10
    >
      <h1
        class="display-2 font-weight-bold mb-3"
      >
        {{ $t('intro.intro_0') }}
      </h1>
      <p
        class="subheading line-height-wide"
      >
        {{ $t('intro.intro_1') }}
        <br>
        {{ $t('intro.intro_2') }}
      </p>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Intro',
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
