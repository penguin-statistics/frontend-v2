<template>
  <v-select
    v-model="activeLocale"
    hide-details
    :menu-props="{ offsetY: true }"
    filled
    :items="localizations"
    :label="$t('menu.languages')"
    transition="slide-y-transition"
  >
    <template v-slot:item="{item}">
      {{ item.text }}
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
  import {mapGetters} from "vuex";
  import I18n from "@/mixins/I18n";

  export default {
    name: "LocaleSwitcher",
    mixins: [I18n],
    data() {
      return {
        localizations: [
          {
            value: 'zh',
            text: '中文'
          }, {
            value: 'en',
            text: 'English'
          }, {
            value: 'ja',
            text: '日本語'
          }, {
            value: 'ko',
            text: '한국어'
          }
        ],
        busy: null,
      }
    },
    computed: {
      ...mapGetters('settings', ['language']),
      activeLocale: {
        get () {
          return this.$i18n.locale
        },
        set (localeId) {
          this.busy = localeId
          setTimeout(() => {
            this.changeLocale(localeId, true)
            this.$nextTick(function () {
              this.busy = null
            })
          })
        }
      },
    },
  }
</script>

<style scoped>

</style>