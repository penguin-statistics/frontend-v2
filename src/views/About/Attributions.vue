<template>
  <v-row
    justify="center"
    align="start"
  >
    <v-col
      cols="12"
      md="6"
    >
      <v-subheader>
        网站内容声明
      </v-subheader>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-subheader>
        开源许可列表
      </v-subheader>
      <v-expansion-panels
        focusable
        popout
      >
        <v-expansion-panel
          v-for="[index, packageObj] in packages.entries()"
          :key="packageObj.name"
        >
          <v-expansion-panel-header>
            <v-icon class="flex-grow-0 mr-2">
              mdi-package-variant-closed
            </v-icon>
            <span class="title flex-grow-0 mr-2">
              {{ index + 1 }}
            </span>
            <span class="monospace flex-grow-0">
              {{ packageObj.name }}
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    mdi-file-certificate
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ packageObj.license }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    License Type
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    mdi-link
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    {{ packageObj.link }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Project URI
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    mdi-pound
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="monospace">
                    v{{ packageObj.version }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Version
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "AboutAttributions",
    data() {
      return {
        packages: [{"name":"@babel/plugin-transform-modules-commonjs","link":"git+https://github.com/babel/babel.git","license":"MIT","version":"7.10.1"},{"name":"@sentry/apm","link":"git://github.com/getsentry/sentry-javascript.git","license":"BSD-3-Clause","version":"5.18.1"},{"name":"@sentry/browser","link":"git://github.com/getsentry/sentry-javascript.git","license":"BSD-3-Clause","version":"5.18.1"},{"name":"@sentry/integrations","link":"git://github.com/getsentry/sentry-javascript.git","license":"BSD-3-Clause","version":"5.18.1"},{"name":"animejs","link":"git+https://github.com/juliangarnier/anime.git","license":"MIT","version":"3.2.0"},{"name":"clipboard-polyfill","link":"git+https://github.com/lgarron/clipboard-polyfill.git","license":"MIT","version":"2.8.6"},{"name":"dayjs","link":"git+https://github.com/iamkun/dayjs.git","license":"MIT","version":"1.8.27"},{"name":"extract-domain","link":"git+https://github.com/bjarneo/extract-domain.git","license":"MIT","version":"2.2.1"},{"name":"highcharts","link":"git+https://github.com/highcharts/highcharts-dist.git","license":"https://www.highcharts.com/license","version":"8.1.2"},{"name":"highcharts-vue","link":"git+https://github.com/highcharts/highcharts-vue.git","license":"https://github.com/highcharts/highcharts-vue/blob/master/LICENSE","version":"1.3.5"},{"name":"intl-collator","link":"git+https://github.com/DasRed/js-intl-collator.git","license":"MIT","version":"0.1.6"},{"name":"js-cookie","link":"git://github.com/js-cookie/js-cookie.git","license":"MIT","version":"2.2.1"},{"name":"marked","link":"git://github.com/markedjs/marked.git","license":"MIT","version":"1.1.0"},{"name":"pinyin-engine","link":"git+https://github.com/aui/pinyin-engine.git","license":"MIT","version":"1.1.0"},{"name":"vue","link":"git+https://github.com/vuejs/vue.git","license":"MIT","version":"2.6.11"},{"name":"vue-analytics","link":"git+https://github.com/MatteoGabriele/vue-analytics.git","license":"MIT","version":"5.22.1"},{"name":"vue-i18n","link":"git+https://github.com/kazupon/vue-i18n.git","license":"MIT","version":"8.18.2"},{"name":"vue-router","link":"git+https://github.com/vuejs/vue-router.git","license":"MIT","version":"3.3.4"},{"name":"vuetify","link":"git+https://github.com/vuetifyjs/vuetify.git","license":"MIT","version":"2.2.34"},{"name":"vuex","link":"git+https://github.com/vuejs/vuex.git","license":"MIT","version":"3.4.0"},{"name":"vuex-persistedstate","link":"git+https://github.com/robinvdvleuten/vuex-persistedstate.git","license":"MIT","version":"2.7.1"}]
      }
    },
  }
</script>

<style scoped>

</style>