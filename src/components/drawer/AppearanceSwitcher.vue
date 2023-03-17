<template>
  <v-select
    v-model="appDark"
    hide-details
    filled
    :items="themes"
    :label="$t('menu.settings.appearances.name')"
    transition="slide-y-transition"
    :disabled="disabled"
  >
    <template #item="{ item }">
      <v-icon
        left
      >
        {{ item.icon }}
      </v-icon>
      {{ item.text }}
      <v-spacer />
      <v-icon v-if="item.value === dark">
        mdi-check
      </v-icon>
    </template>
    <template #selection="{item}">
      <v-icon
        small
        left
      >
        {{ item.icon }}
      </v-icon>
      {{ item.text }}
    </template>
  </v-select>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'AppearanceSwitcher',
  computed: {
    ...mapGetters('settings', ['dark']),
    appDark: {
      get() {
        return this.dark
      },
      set(value) {
        this.$store.commit('settings/switchDark', value)
        this.$ga.event(
            'settings',
            'theme',
            value
        )
      }
    },
    themes() {
      return [
        {
          icon: 'mdi-brightness-auto',
          text: this.$t('menu.settings.appearances.system'),
          value: 'system'
        },
        {
          icon: 'mdi-brightness-2',
          text: this.$t('menu.settings.appearances.dark'),
          value: 'dark'
        },
        {
          icon: 'mdi-brightness-7',
          text: this.$t('menu.settings.appearances.light'),
          value: 'light'
        }
      ]
    },
    disabled() {
      return this.$store.getters['ui/activeThemeStyle'] === 'seaborn'
    }
  }
}
</script>

<style scoped>

</style>
