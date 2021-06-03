<template>
  <v-card
    elevation="5"
    class="overflow-hidden"
    height="180px"
    :ripple="false"
    href="https://mp.weixin.qq.com/s/w6oivoT_G1tChEhQFs_6lw"
    target="_blank"
    @click="report('click')"
    @mouseenter="report('mouseenter')"
  >
    <v-dialog
      v-model="helpDialog"
      max-width="450px"
    >
      <v-card
        outlined
        class="backdrop-blur-dialog"
      >
        <v-card-title class="headline mb-1">
          <v-icon left>
            mdi-account-multiple
          </v-icon>
          赞助商内容
        </v-card-title>
        <v-card-text
          v-marked
          class="markdown-content markdown-content-extra-margin"
          v-text="helpContent"
        />
        <v-divider />
        <v-card-actions>
          <v-btn
            block
            text
            large
            @click="helpDialog = false"
          >
            <v-divider style="opacity: 0.3" />
            <span class="mx-4 d-flex align-center">
              <v-icon left>mdi-close</v-icon>{{ $t('meta.dialog.close') }}
            </span>
            <v-divider style="opacity: 0.3" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-img
      gradient="to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)"
      src="https://portal.xastatic.com/common/background.jpg"
      height="180px"
      :aspect-ratio="1.3913"
      class="overflow-hidden enlarged-effect"
    >
      <div class="d-flex flex-column align-start pa-6 justify-start fill-height display-1 enlarged-effect--text transition-all white--text no-pointer-events bordered">
        <h1 class="headline font-weight-bold">
          {{ $t('sponsor.xacademy.headline_1') }}<br>{{ $t('sponsor.xacademy.headline_2') }}
        </h1>
        <v-spacer />
        <h1 class="body-1">
          {{ $t('sponsor.xacademy.subtitle') }}
        </h1>
        <h1 class="caption d-flex align-center">
          {{ $t('sponsor.xacademy.more') }}
          <v-icon
            :size="16"
            right
          >
            mdi-chevron-right
          </v-icon>
        </h1>
      </div>
    </v-img>

    <div class="d-flex align-center sponsor-label caption pa-2 white--text">
      <span class="no-pointer-events">
        {{ $t('sponsor.meta.providedBy') }}
      </span>

      <v-btn
        right
        icon
        color="white"
        x-small
        @click.prevent="helpDialog = true"
      >
        <v-icon x-small>
          mdi-help-circle
        </v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "XAcademy",
  data() {
    return {
      helpDialog: false,
      detailDialog: false,
      helpContent: `您在此处看到的内容是由现正活跃的赞助商提供。

### 什么是赞助商
由于本站开销已接近入不敷出，为保证服务长期可用，我们将添加非侵入式、具有友好体验和设计的部分合作赞助商广告。在添加广告前，我们将审核赞助商的社会责任性与其广告内容质量，较低的广告内容质量将不会被投放至本站。

### 透明性
赞助商所投放广告的收入（及包括所有收入）均会透明公开至本站的收支一览中。

### 现活跃的赞助商信息
上海得斯教育科技有限公司

### 现活跃的赞助商内容投放期限
2021.06.04 00:00:00 (UTC+8) ~ 2021.06.10 23:59:59 (UTC+8)`
    }
  },
  methods: {
    report(name) {
      this.$probe.reportNavigated(`/_event/sponsor/xacademy/${name}`)
    }
  },
}
</script>

<style lang="scss">
.sponsor-label {
  position: absolute;
  bottom: 0;
  right: 0;

  opacity: 0.5;
}
.no-pointer-events {
  pointer-events: none;
}

.enlarged-effect {
  & .enlarged-effect--text *,
  & > .v-image__image {
    transition: all .75s cubic-bezier(0.22, 1, 0.36, 1);
  }

  & > .v-image__image {
    opacity: 1;
    transform: scale(1.4) translateX(8%);
    filter: saturate(0.95) brightness(0.6);
  }

  .theme--light & > .v-image__image {
    filter: saturate(0.95) brightness(0.75);
  }

  &:hover > .v-image__image {
    transform: scale(1.05);
    filter: saturate(1) brightness(1);
  }

  .theme--light &:hover > .v-image__image {
    filter: saturate(1) brightness(1.1);
  }

  .theme--light &:active > .v-image__image {
    filter: saturate(1) brightness(0.9);
  }

  &:active > .v-image__image {
    transition-duration: .45s;
    transform: scale(1);
    filter: saturate(1) brightness(0.7);
  }

  & .enlarged-effect--text {
    text-shadow: none;
    & h1, & span {
      letter-spacing: .005em !important;
    }
  }

  &:hover .enlarged-effect--text {
    text-shadow: 2px 2px 12px rgba(0, 0, 0, .8), 0 0 4px rgba(0, 0, 0, .4);
    & h1, & span {
      letter-spacing: .07em !important;
    }
  }

  &:active .enlarged-effect--text {
    & h1, & span {
      transition-duration: .45s;
      letter-spacing: .05em !important;
      opacity: 0.7
    }
  }
}

.markdown-content-extra-margin {
  ::v-deep & h2 {
    margin-bottom: .75rem !important;
  }
  ::v-deep & h3 {
    margin-top: .5rem
  }
}

.bordered {
  border: 2px solid rgba(255, 255, 255, .3);
  .theme--light & {
    border: 2px solid rgba(0, 0, 0, .3);
  }
  border-radius: 4px;
}
</style>