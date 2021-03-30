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
import { mapGetters } from 'vuex'
import I18n from '@/mixins/I18n'
import supports from '@/models/supports'

export default {
  name: 'LocaleSwitcher',
  mixins: [I18n],
  data () {
    return {
      localizations: supports.localizations,
      busy: null
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
    }
  }
}
</script>

<style scoped>

</style>
