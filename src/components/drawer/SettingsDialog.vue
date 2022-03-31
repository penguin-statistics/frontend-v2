<template>
  <v-dialog
    v-model="active"
    max-width="500px"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-haptic
        ripple
        text
        outlined
        class="flex-grow-1"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>
          mdi-settings
        </v-icon>
        {{ $t("menu.settings.name") }}
      </v-btn>
    </template>
    <v-card :color="`${dark ? 'primary darken-3' : 'primary lighten-5'}`">
      <v-card-title class="headline">
        <v-icon left>
          mdi-settings
        </v-icon>
        {{ $t("menu.settings.name") }}
      </v-card-title>

      <v-card-text>
        <v-container class="pt-0">
          <v-row class="flex-column">
            <Subheader>
              {{ $t("settings.category.appearance") }}
            </Subheader>

            <ThemeStyleSwitcher class="mb-2" />

            <AppearanceSwitcher class="mb-2" />

            <LocaleSwitcher
              v-if="!$env.isAppIOS"
              class="mb-2"
            />

            <OptimizationSwitcher
              v-if="!$env.isAppIOS"
              class="mb-2"
            />

            <!--            <PushNotificationSettings v-if="false">-->
            <!--              <template #default="{ on }">-->
            <!--                <v-btn-->
            <!--                  v-if="$env.isApp"-->
            <!--                  v-haptic-->
            <!--                  large-->
            <!--                  block-->
            <!--                  color="indigo"-->
            <!--                  class="mb-3"-->
            <!--                  v-on="on"-->
            <!--                >-->
            <!--                  <v-icon left>-->
            <!--                    mdi-bell-->
            <!--                  </v-icon>-->
            <!--                  推送通知设置...-->
            <!--                </v-btn>-->
            <!--              </template>-->
            <!--            </PushNotificationSettings>-->

            <v-btn
              v-if="$env.isAppIOS"
              v-haptic
              depressed
              block
              color="primary"
              @click="openBundleSettings"
            >
              <v-icon left>
                mdi-settings
              </v-icon>
              语言与隐私设置
            </v-btn>

            <DataManager
              v-if="active"
              class="mt-2"
            />

            <template v-if="$env.isApp">
              <Subheader>
                {{ $t("settings.category.about") }}
              </Subheader>
              <div class="ml-4">
                <strong>Reunion Statistics</strong>
                —
                <strong>{{ version.VERSION }}</strong>
                <span class="overline monospace condensed ml-1">{{
                  version.GIT_COMMIT
                }}</span>
              </div>
            </template>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          @click="active = false"
        >
          {{ $t("meta.dialog.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import AppearanceSwitcher from "@/components/drawer/AppearanceSwitcher";
import LocaleSwitcher from "@/components/drawer/LocaleSwitcher";
import Theme from "@/mixins/Theme";
import OptimizationSwitcher from "@/components/drawer/OptimizationSwitcher";
import DataManager from "@/components/drawer/DataManager";
import Subheader from "@/components/global/Subheader";
import penguin from "@/utils/native/penguin";
import config from "@/config";
import ThemeStyleSwitcher from "@/components/drawer/ThemeStyleSwitcher";
export default {
  name: "SettingsDialog",
  components: {
    ThemeStyleSwitcher,
    Subheader,
    DataManager,
    OptimizationSwitcher,
    LocaleSwitcher,
    AppearanceSwitcher,
  },
  mixins: [Theme],
  data() {
    return {
      active: false,
    };
  },
  computed: {
    version() {
      return {
        VERSION: config.version || "v0.0.0",
        GIT_COMMIT: GIT_COMMIT.trim() || "unknown",
      };
    },
  },
  methods: {
    openBundleSettings: penguin.openBundleSettings,
  },
};
</script>

<style scoped></style>
