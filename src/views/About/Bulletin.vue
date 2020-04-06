<i18n>
  {
    "zh": {
      "bulletin": [
        "1月16日海外版正式上线，为了避免数据混淆，请只上传国服的掉落。",
        "专用于海外版的素材统计站是否开放正在计划中。",
        "全站翻译已经完成，感谢Syaro和方舟航海図的帮助！"
      ]
    },
    "en": {
      "bulletin": [
        "Arknights EN server was officially released on 1/16. In order to not mess up the current data, please only submit drop data from the CN server.",
        "We are considering whether to open another website for overseas servers.",
        "The translation of the entire website has been finished. Thanks to Syaro and 方舟航海図 for their efforts!"
      ]
    },
    "ja": {
      "bulletin": [
        "1月16日に海外版が正式にリリースされます。データの混雑を避けるために、当サイトでは大陸版のドロップデータのみをアップロードして下さい。",
        "海外版のドロップまとめサイトを開設するかは現時点では思案中のみとなっています。",
        "Webサイトの翻訳は全て完了しました。Syaroと方舟航海図のご協力に感謝します！"
      ]
    },
    "ko": {
      "bulletin": [
        "명일방주 해외서버가 1/16일에 오픈하였습니다. 데이터의 혼란을 방지하기 위해, 중국 서버의 보고서만 작성하여 주십시오.",
        "저희는 해외서버를 위한 웹 사이트 개설을 검토하고 있습니다.",
        "웹 사이트 전체의 번역이 끝났습니다. Syaro님과 方舟航海図님의 노력에 감사드립니다!"
      ]
    }
  }
</i18n>

<template>
  <v-card
    elevation="5"
    class="bkop-light pa-6"
  >
    <h1 class="headline font-weight-black d-flex align-center flex-row">
      <v-icon left>
        mdi-alert-decagram
      </v-icon>

      {{ $t('menu.about.bulletin') }}
    </h1>
    <v-row>
      <v-col
        cols="12"
        class="subtitle-1 line-height-wide font-weight-bold"
        style="word-break: normal"
      >
        <p
          v-for="bulletin in $t('bulletin')"
          :key="bulletin"
          class="mb-0"
          v-text="bulletin"
        />
      </v-col>
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
  line-height: 1.8;
}
</style>
