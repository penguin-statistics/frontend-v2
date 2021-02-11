<template>
  <v-dialog
    v-model="dialog"
    max-width="475px"
    :persistent="dirty"
  >
    <template v-slot:activator="props">
      <slot v-bind="props" />
    </template>

    <v-dialog
      v-model="dirtyDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          未保存
        </v-card-title>
        <v-card-text>
          您更改了订阅项，但并未保存。丢弃所有修改并退出吗？
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="dirtyDialog = false"
          >
            {{ $t('meta.dialog.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            @click="dirtyDialog = false; close()"
          >
            {{ $t('meta.dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-title class="headline">
        <v-icon left>
          mdi-bell
        </v-icon>

        推送通知设置
      </v-card-title>

      <v-card-text>
        <Subheader>
          订阅项目管理
        </Subheader>

        <NewPushSubscriptionDialog
          v-model="addDialog" :preferences="preferences"
          @add="add"
        >
          <template #default="{ on }">
            <v-btn 
              v-haptic
              block
              depressed
              large
              color="primary"
              v-on="on"
            >
              <v-icon left>
                mdi-plus-circle
              </v-icon>
              添加新订阅
            </v-btn>
          </template>
        </NewPushSubscriptionDialog>

        <v-list
          two-line
          subheader
          class="mt-2"
        >
          <v-subheader>
            订阅列表
          </v-subheader>

          <v-list-item
            v-if="!preferences.length"
            class="justify-center grey--text py-0"
          >
            无订阅项
          </v-list-item>

          <v-list-item
            v-for="(preference, i) in preferences"
            :key="preference.key"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ preference.localizedCategory }}
              </v-list-item-title>
              <v-list-item-subtitle class="v-list--force-line-break">
                {{ preference.localizedServer }} — 消息语言 {{ preference.localizedLocale }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                color="error"
                @click="remove(i)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-text>
        <v-btn
          block
          color="orange"
          @click="debug = !debug"
        >
          <v-icon>
            {{ debug ? "mdi-chevron-up" : "mdi-chevron-down" }}
          </v-icon>
          {{ debug ? "折叠调试项" : "展开调试项" }}
        </v-btn>
      </v-card-text>

      <v-expand-transition>
        <v-card-text v-if="debug">
          <Subheader>
            调试
          </Subheader>
          <p>
            <v-btn
              small
              outlined
              @click="update"
            >
              更新
            </v-btn>
            已订阅项目表 <pre>{{ preferences }}</pre>
          </p>
        </v-card-text>
      </v-expand-transition>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          :disabled="saving"
          @click="gentleClose"
        >
          {{ $t('meta.dialog.close') }}
        </v-btn>
        <v-btn
          v-haptic
          depressed
          color="primary"
          :disabled="!dirty"
          :loading="saving"
          @click="save"
        >
          {{ $t('meta.dialog.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import penguin from "@/utils/native/penguin";
import Subheader from "@/components/global/Subheader";
import NewPushSubscriptionDialog from "@/components/drawer/NewPushSubscriptionDialog";
import supports from "@/models/supports";
import snackbar from "@/utils/snackbar";
import unmarshaller from "@/utils/unmarshaller";
import marshaller from "@/utils/marshaller";

export default {
  name: "PushNotificationSettings",
  components: {NewPushSubscriptionDialog, Subheader},
  data() {
    return {
      dialog: false,
      addDialog: false,
      dirtyDialog: false,
      saving: false,
      debug: false,
      dirty: false,
      originalPrefs: [],
    }
  },
  computed: {
    preferences() {
      return this.originalPrefs.map(el => {
        return {
          ...el,
          key: this.generateKey(el),
          localizedLocale: (supports.localizations.find(e => e.value === el.locale) || {text: el.locale}).text,
          localizedServer: this.$t('server.servers.' + el.server),
          localizedCategory: this.$t('settings.push.categories.' + el.category).title,
        }
      })
    }
  },
  watch: {
    dialog(value) {
      if (value) this.update()
    }
  },
  methods: {
    generateKey({locale, server, category}) {
      return [locale, server, category].join("_")
    },
    update() {
      penguin.getLastSyncedPushPreferences()
        .then(preferences => {
          console.log(preferences.preferences, typeof preferences.preferences, preferences[0])
          this.originalPrefs = unmarshaller.pushPreferences(preferences.preferences)
        })
    },
    save() {
      const m = marshaller.pushPreferences(this.originalPrefs)
      console.log(m)
      penguin.submitNewPushPreferences(m)
        .then(() => {
          this.dirty = false
          snackbar.launch("success", 5000, "成功保存推送设置")
        })
    },
    remove(i) {
      this.originalPrefs.splice(i, 1)
      this.dirty = true
    },
    gentleClose() {
      if (this.dirty) {
        this.dirtyDialog = true
        return
      }
      this.close()
    },
    close() {
      this.dialog = false
      this.dirty = false
    },
    add(content) {
      const newKey = this.generateKey(content)
      console.log("adding", JSON.stringify(content), newKey, this.preferences)
      if (this.originalPrefs.find(el => this.generateKey(el) === newKey)) {
        snackbar.launch("warning", 15000, "请不要重复添加：拥有相同订阅参数的订阅已存在于订阅列表内", "")
        return
      }
      this.originalPrefs.push(content)
      this.dirty = true
    }
  },
}
</script>

<style scoped>

</style>