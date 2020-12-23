<template>
  <v-dialog
    v-model="active"
    max-width="400px"
  >
    <v-card :color="`${dark ? 'blue-grey darken-3' : 'white'}`">
      <v-card-title class="headline">
        <v-icon left>
          mdi-link
        </v-icon>
        {{ $t("meta.outSiteDialog.title") }}
      </v-card-title>

      <v-card-text>
        <v-container class="pt-0">
          <v-row class="flex-column">
            <Subheader>
              {{ $t("meta.outSiteDialog.notice") }}
            </Subheader>
            <v-card
              :href="url"
              rel="noopener"
              target="_blank"
              @click="active = false"
            >
              <v-card-text>
                <v-row
                  align="center"
                  class="mx-0"
                >
                  <div 
                    class="grey--text" 
                    style="word-break: break-all;"
                  >
                    {{ url }}
                  </div>
                </v-row>
              </v-card-text>
            </v-card>
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
        <v-btn
          v-haptic
          text
          :href="url"
          rel="noopener"
          target="_blank"
          @click="active = false"
        >
          {{ $t("meta.dialog.confirm") }}
          <v-icon
            right
            small
          >
            mdi-open-in-new
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Theme from "@/mixins/Theme";
import store from "@/store";
import Subheader from "@/components/global/Subheader";
export default {
  name: "OutSiteDialog",
  components: { Subheader },
  mixins: [Theme],
  computed: {
    active: {
      get() {
        return this.$store.getters["ui/outSiteDialog"] ? true : false;
      },
      set(value) {
        store.commit("ui/setOutSiteDialog", value == false ? null : value);
      }
    },
    url() {
      return this.$store.getters["ui/outSiteDialog"];
    }
  }
};
</script>

<style scoped></style>
