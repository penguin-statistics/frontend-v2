<template>
  <v-dialog
    v-model="active"
    origin="bottom left"
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
    <v-card>
      <v-card-title class="headline">
        <v-icon left>
          mdi-settings
        </v-icon>
        {{ $t('menu.settings.name') }}
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row class="flex-column">
            <ThemeSwitcher />

            <LocaleSwitcher />
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import ThemeSwitcher from "@/components/drawer/ThemeSwitcher";
  import LocaleSwitcher from "@/components/drawer/LocaleSwitcher";
  export default {
    name: "SettingsDialog",
    components: {LocaleSwitcher, ThemeSwitcher},
    data() {
      return {
        active: false
      }
    },
  }
</script>

<style scoped>

</style>