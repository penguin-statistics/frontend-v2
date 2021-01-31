<template>
  <v-dialog
    :value="value"
    max-width="450px"
    v-on="$listeners"
  >
    <template v-slot:activator="props">
      <slot v-bind="props" />
    </template>

    <v-card>
      <v-card-title class="headline">
        <v-icon left>
          mdi-plus-circle
        </v-icon>
        添加新订阅
      </v-card-title>

      <v-card-text>
        <Subheader>
          订阅参数
        </Subheader>

        <v-row>
          <v-col cols="6">
            <v-select
              v-model="form.server"
              filled
              hide-details
              :items="localizedServers"
              :label="$t('server.name')"
              :rules="rules"
              class="mb-1"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="form.locale"
              filled
              hide-details
              :items="supports.localizations"
              :label="$t('settings.push.language')"
              :rules="rules"
              class="mb-1"
            />
          </v-col>
        </v-row>

        <!--        <v-form v-model="valid">-->
        <!--          <v-select-->
        <!--            v-model="form.category"-->
        <!--            hide-details-->
        <!--            filled-->
        <!--            :items="categories"-->
        <!--            :label="$t('settings.push.categories._name')"-->
        <!--            :rules="rules"-->
        <!--          />-->
        <!--        </v-form>-->

        <v-list>
          <!--          <v-subheader>-->
          <!--            {{ $t('settings.push.categories._name') }}-->
          <!--          </v-subheader>-->

          <v-list-item
            v-for="category in categories"
            :key="category"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('settings.push.categories.' + category).title }}
              </v-list-item-title>
              <v-list-item-subtitle class="v-list--force-line-break">
                {{ $t('settings.push.categories.' + category).subtitle }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                color="primary"
                small
                @click="add(category)"
              >
                订阅
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-haptic
          block
          large
          text
          @click="close"
        >
          {{ $t('meta.dialog.cancel') }}
        </v-btn>
        <!--        <v-spacer />-->
        <!--        <v-btn-->
        <!--          v-haptic-->
        <!--          color="primary"-->
        <!--          :disabled="!valid"-->
        <!--          @click="add"-->
        <!--        >-->
        <!--          {{ $t('meta.dialog.confirm') }}-->
        <!--        </v-btn>-->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import supports from "@/models/supports";
import Subheader from "@/components/global/Subheader";

export default {
  name: "NewPushSubscriptionDialog",
  components: {Subheader},
  props: {
    value: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      valid: false,
      form: {
        locale: null,
        server: null,
        category: null
      }
    }
  },
  computed: {
    supports() {
      return supports;
    },
    rules() {
      return [(v) => v !== null || "isNull"]
    },
    categories() {
      return supports.push.categories
    },
    localizedServers() {
      return supports.servers.map(el => {
        return {
          text: this.$t('server.servers.' + el),
          value: el
        }
      })
    }
  },
  created() {
    this.reset()
  },
  methods: {
    close() {
      this.$emit('input', false)
      this.reset()
    },
    reset() {
      this.form = {
        locale: this.$i18n.locale,
        server: this.$store.getters["dataSource/server"],
        category: null
      }
    },
    add(category) {
      this.form.category = category
      this.$emit('add', this.form)
      this.close()
    }
  },

}
</script>

<style scoped>

</style>