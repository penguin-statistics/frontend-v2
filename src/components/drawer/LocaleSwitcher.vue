<template>
  <v-select
    v-model="activeLocale"
    hide-details
    filled
    :items="filteredLocalizations"
    :label="$t('menu.languages')"
    transition="slide-y-transition"
  >
    <template #item="{item}">
      {{ item.text }}
      <v-icon
        v-if="item.beta"
        small
        class="ml-1"
      >
        mdi-beta
      </v-icon>
      <v-spacer />
      <!--      <span class="monospace ml-2">-->
      <!--        {{ item.value }}-->
      <!--      </span>-->
      <v-icon v-if="item.value === activeLocale">
        mdi-check
      </v-icon>
      <v-progress-circular
        v-if="busy === item.value"
        indeterminate
        size="24"
        width="3"
      />
      <!--      <v-icon v-if="busy === item.value">-->
      <!--        mdi-timer-sand-empty-->
      <!--      </v-icon>-->
    </template>
  </v-select>
</template>

<script>
import {mapGetters} from 'vuex'
import I18n from '@/mixins/I18n'

export default {
  name: 'LocaleSwitcher',
  mixins: [I18n],
  data() {
    return {
      localizations: [
        {
          value: "zh",
          push: "ZH_CN",
          text: "简体中文",
        },
        {
          value: "zh_CN_x_seaborn",
          push: "ZH_CN",
          text: "简体中文 (海嗣体变体)",
          bindThemeStyle: 'seaborn'
        },
        {
          value: "en",
          push: "EN_US",
          text: "English",
        },
        {
          value: "en_US_x_seaborn",
          push: "EN_US",
          text: "English (Seaborn Variant)",
          bindThemeStyle: 'seaborn'
        },
        {
          value: "ja",
          push: "JA_JP",
          text: "日本語",
        },
        {
          value: "ja_JP_x_seaborn",
          push: "JA_JP",
          text: "日本語 (シーボーン変種)",
          bindThemeStyle: 'seaborn'
        },
        {
          value: "ko",
          push: "KO_KR",
          text: "한국어",
        },
        {
          value: "ko_KR_x_seaborn",
          push: "KO_KR",
          text: "한국어 (시보른 변종)",
          bindThemeStyle: 'seaborn'
        }
      ],
      busy: null
    }
  },
  computed: {
    ...mapGetters('settings', ['language']),
    activeLocale: {
      get() {
        return this.$i18n.locale
      },
      set(localeId) {
        this.busy = localeId
        setTimeout(() => {
          this.changeLocale(localeId, true)
          this.$ga.event(
              'settings',
              'language',
              localeId
          )
          this.$nextTick(function () {
            this.busy = null
          })
        })
      }
    },
    filteredLocalizations() {
      const currentActiveThemeStyle = this.$store.getters['settings/themeStyle']
      const anyBindThemeStyle = this.localizations.some((item) => {
        return item.bindThemeStyle === currentActiveThemeStyle
      })
      if (anyBindThemeStyle) {
        return this.localizations.filter((item) => {
          return item.bindThemeStyle === currentActiveThemeStyle
        })
      } else {
        return this.localizations.filter((item) => {
          return !item.bindThemeStyle
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
