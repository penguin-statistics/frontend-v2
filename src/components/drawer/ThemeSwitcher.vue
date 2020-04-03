<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        class="mx-1"
        v-on="on"
        @click="appDark = !appDark"
      >
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('menu.invertColors') }}</span>
  </v-tooltip>
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
          this.$vuetify.theme.dark = value;
          this.$store.commit('settings/switchDark', value)
        }
      },
    },
  }
</script>

<style scoped>

</style>