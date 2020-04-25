<template>
  <v-dialog
    v-model="active"
    max-width="400px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        ripple
        text
        outlined
        class="flex-grow-1"
        v-on="on"
      >
        <v-icon left>
          mdi-settings
        </v-icon>
        {{ $t('menu.settings.name') }}
      </v-btn>
    </template>
    <v-card :color="`${dark ? 'blue-grey darken-3' : 'white'}`">
      <v-card-title class="headline">
        <v-icon left>
          mdi-settings
        </v-icon>
        {{ $t('menu.settings.name') }}
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row class="flex-column">
            <ThemeSwitcher class="mb-2" />

            <LocaleSwitcher class="mb-2" />
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="active = false"
        >
          {{ $t('dialog.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import ThemeSwitcher from "@/components/drawer/ThemeSwitcher";
  import LocaleSwitcher from "@/components/drawer/LocaleSwitcher";
  import Theme from "@/mixins/Theme";
  export default {
    name: "SettingsDialog",
    components: {LocaleSwitcher, ThemeSwitcher},
    mixins: [Theme],
    data() {
      return {
        active: false
      }
    },
  }
</script>

<style scoped>

</style>