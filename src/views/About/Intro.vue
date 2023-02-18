<template>
  <v-card
    elevation="0"
    class="transparent pt-0 mb-1"
  >
    <v-row
      align="center"
      justify="center"
      justify-lg="start"
    >
      <v-card-title
        class="justify-start"
        style="word-break:normal"
      >
        <v-img
          :src="cdnDeliver('/logos/penguin_stats_logo.png')"
          aspect-ratio="1"
          height="128px"
          width="128px"
          contain
          :position="$vuetify.breakpoint.mdAndDown ? 'center center' : 'left center'"
          class="my-6"
        />
        <v-col cols="12">
          <h1
            :class="{
              'display-2': $vuetify.breakpoint.mdAndUp,
              'display-1': $vuetify.breakpoint.smAndDown
            }"
            class="font-weight-bold mb-4 display-1"
          >
            {{ $t('home.intro.intro_0') }}
          </h1>
          <p class="subtitle-1 line-height-wide">
            {{ $t('home.intro.intro_1') }}
            <br>
            {{ $t('home.intro.intro_2') }}
          </p>
        </v-col>

        <div
          cols="12"
          class="contrib-banner"
        >
          <div class="contrib-banner-inner">
            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/frontend-v2"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.frontend") }}</div>
                  <div class="overline degraded-opacity">
                    Vue 2
                  </div>
                </div>
              </div>
            </v-btn>

            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/frontend-next"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.frontendV4") }}</div>
                  <div class="overline degraded-opacity">
                    React 18
                  </div>
                </div>
              </div>
            </v-btn>


            <!-- <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/frontend-next"
              target="_blank"
              rel="noopener"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.frontend") }} Alpha <small>(锐意开发中)</small></div>
                  <div class="overline degraded-opacity">
                    React 18
                  </div>
                </div>
              </div>
            </v-btn> -->

            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/backend-next"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.backend") }}</div>
                  <div class="overline degraded-opacity">
                    Go 1.18
                  </div>
                </div>
              </div>
            </v-btn>

            <!-- <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/livehouse"
              target="_blank"
              rel="noopener"
              class="mr-1"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.livehouse") }}</div>
                  <div class="overline degraded-opacity">
                    Go 1.18
                  </div>
                </div>
              </div>
            </v-btn> -->

            <v-btn
              v-haptic
              large
              href="https://github.com/penguin-statistics/recognizer"
              target="_blank"
              rel="noopener"
              text
            >
              <div class="d-flex align-center justify-content-center ">
                <v-icon left>
                  mdi-github-circle
                </v-icon>
                <div class="flex flex-column ml-1 py-2">
                  <div>{{ $t("contribute.recognizer") }}</div>
                  <div class="overline degraded-opacity">
                    C++17
                  </div>
                </div>
              </div>
            </v-btn>
          </div>
          <div class="caption px-3 pt-2 pb-1 degraded-opacity">
            {{ $t('contribute.caption') }}
          </div>
        </div>
      </v-card-title>
    </v-row>
  </v-card>
</template>

<script>
import CDN from '@/mixins/CDN'

export default {
  name: 'Intro',
  mixins: [CDN]
}
</script>

<style scoped>
.contrib-banner {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2) !important;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  margin: 0 8px;
  max-width: 800px;

  background: rgba(240, 240, 240, .05);
  color: inherit;
  /* box-shadow: none; */
  backdrop-filter: blur(20px) brightness(1.2);
}
.theme--dark .contrib-banner {
  background: rgba(0, 0, 0, .05);
  backdrop-filter: blur(20px) brightness(0.8);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.contrib-banner-inner {
  display: inline-block;
}

/* .contrib-banner-inner > * {
  display: inline-block;
} */

@media (max-width: 770px) {
  /* .contrib-banner-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 4px;
  }

  .contrib-banner-inner > * {
    justify-content: start;
  } */

  small {
    display: none;
  }
}

</style>
