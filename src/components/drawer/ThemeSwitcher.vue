<template>
  <v-select
    v-model="appDark"
    :menu-props="{ offsetY: true }"
    filled
    :items="themes"
    :label="$t('menu.settings.themes.name')"
    transition="slide-y-transition"
  >
    <template v-slot:item="{ item }">
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
    <template v-slot:selection="{item}">
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
  import {mapGetters} from "vuex";

  export default {
    name: "ThemeSwitcher",
    computed: {
      ...mapGetters('settings', ['dark']),
      appDark: {
        get () {
          return this.dark
        },
        set (value) {
          this.$store.commit('settings/switchDark', value)
        }
      },
      themes () {
        return [
          {
            icon: "mdi-brightness-auto",
            text: this.$t('menu.settings.themes.system'),
            value: "system"
          },
          {
            icon: "mdi-brightness-2",
            text: this.$t('menu.settings.themes.dark'),
            value: "dark"
          },
          {
            icon: "mdi-brightness-7",
            text: this.$t('menu.settings.themes.light'),
            value: "light"
          }
        ]
      }
    },
  }
</script>

<style scoped>

</style>