<i18n>
  {
    "zh": {
      "bulletin": {
        "bulletin_0": "1月16日海外版正式上线，为了避免数据混淆，请只上传国服的掉落。",
        "bulletin_1": "专用于海外版的素材统计站是否开放正在计划中。"
      }
    },
    "en": {
      "bulletin": {
        "bulletin_0": "Arknights EN server was officially released on 1/16. In order not to mess up the data, please only submit drop data from CN server.",
        "bulletin_1": "We are considering whether to open another website for overseas servers."
      }
    },
    "ja": {
      "bulletin": {
        "bulletin_0": "1月16日に海外版が正式にリリースされます。データの混雑を避けるために、当サイトでは大陸版のドロップデータのみをアップロードして下さい。",
        "bulletin_1": "海外版のドロップまとめサイトを開設するかは現時点では思案中のみとなっています。"
      }
    },
    "ko": {
      "bulletin": {
        "bulletin_0": "명일방주 해외서버가 1/16일에 오픈하였습니다. 데이터의 혼란을 방지하기 위해, 중국 서버의 보고서만 작성하여 주십시오.",
        "bulletin_1": "저희는 해외서버를 위한 웹 사이트 개설을 검토하고 있습니다."
      }
    }
  }
</i18n>

<template>
  <v-card
    elevation="5"
    class="bkop-light pa-6"
  >
    <h1 class="headline font-weight-black">
      {{ $t('menu.about.bulletin') }}
    </h1>
    <v-row>
      <v-col
        cols="12"
        class="subtitle-1 line-height-wide font-weight-bold"
        style="word-break: normal"
      >
        <span>{{ $t('bulletin.bulletin_0') }}</span>
        <br>
        <span>{{ $t('bulletin.bulletin_1') }}</span>
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
