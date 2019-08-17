<i18n>
  {
    "zh": {
      "notice": "用户 ID 仅用来标记您的上传身份。在不同设备上使用此 ID 登录，可让掉落数据集中于一个账号下，方便管理上传以及查看个人掉落数据。",
      "success": "登录成功",
      "failed": "登录失败：{message}",
      "login": "登录",
      "logout": "退出登录",
      "logoutPrompt": "确定要退出登录吗？",
      "loggedOut": "已退出登录",
      "userId": "用户 ID"
    },
    "en": {
      "notice": "The User ID helps us identifies your upload identity. Inputting this ID on other devices enable you to manage and inspect your uploads with ease.",
      "success": "Successfully logged in",
      "failed": "Failed to log in: {message}",
      "login": "Login",
      "logout": "Logout",
      "logoutPrompt": "Are you sure?",
      "loggedOut": "Logged out",
      "userId": "User ID"
    }
  }
</i18n>

<template>
  <div>
    <v-snackbar
      v-model="snackbar.enabled"
      :color="snackbar.color"
      :timeout="5000"

      top
      right
    >
      {{ snackbar.text }}
      <v-btn
        flat
        @click="snackbar.enabled = false"
      >
        {{ $t('dialog.close') }}
      </v-btn>
    </v-snackbar>
    
    <v-dialog
      v-model="auth.dialog"
      max-width="450px"
    >
      <v-card class="pa-2">
        <v-card-title>
          <span class="headline">
            {{ $t('login') }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-alert
            :value="true"
            type="info"
          >
            {{ $t('notice') }}
          </v-alert>
          <v-divider class="my-4" />
          <v-text-field
            v-model="auth.username"
            :label="`${$t('userId')} *`"
            required
            hide-details

            outline

            @keyup.enter.native="login"
          />
        </v-card-text>
        <v-card-actions class="mx-2 mb-3">
          <v-btn
            color="primary"
            block
            :loading="auth.loading"
            :disabled="auth.username === ''"
            large
            @click="login"
          >
            <v-icon left>
              mdi-login-variant
            </v-icon>

            {{ $t('dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="auth.logoutPrompt"
      max-width="450px"
    >
      <v-card class="pa-2">
        <v-card-title>
          <span class="headline">
            {{ $t('logout') }}
          </span>
        </v-card-title>
        <v-card-text>
          {{ $t('logoutPrompt') }}
        </v-card-text>
        <v-card-actions class="mx-2 mb-2">
          <v-btn
            color="error"
            block
            large
            @click="logout"
          >
            <v-icon left>
              mdi-logout-variant
            </v-icon>
            {{ $t('logout') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-hover v-if="$store.getters.authed">
      <transition
        slot-scope="{ hover }"

        :name="`slide-x${hover ? '-reverse' : ''}-transition`"
        mode="out-in"
        duration="30"
      >
        <v-btn
          v-if="hover && !mobile"
          key="logout"
          round
          @click="logout"
        >
          <v-icon
            left
          >
            mdi-logout-variant
          </v-icon>
          {{ $t('logout') }}
        </v-btn>

        <v-chip
          v-else
          key="nameTag"
          style="box-shadow: 0 0 0 4px rgba(0, 0, 0, .3)"
          @click="auth.logoutPrompt = true"
        >
          <v-icon
            left
          >
            mdi-account-circle
          </v-icon>
          {{ $store.getters.authUsername }}
        </v-chip>
      </transition>
    </v-hover>

    <v-btn
      v-if="!$store.getters.authed"
      round
      icon
      @click="auth.dialog = true"
    >
      <v-icon>mdi-login-variant</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import service from '@/utils/service'
  import Cookies from 'js-cookie'

  export default {
    name: "AccountManager",
    data() {
      return {
        auth: {
          buttonHovered: false,
          dialog: false,
          username: '',
          loading: false,
          logoutPrompt: false
        },
        snackbar: {
          enabled: false,
          color: "",
          text: ""
        },
        cookies: {
          key: "userID"
        }
      }
    },
    computed: {
      mobile() {
        return !!("ontouchstart" in window) || window.navigator.maxTouchPoints > 0;
      }
    },
    methods: {
      login() {
        this.auth.loading = true;
        service.post("/users", this.auth.username, {headers: {'Content-Type': 'text/plain'}})
          .then(() => {
            this.$store.commit("authLogin", this.auth.username);
            Cookies.set(this.cookies.key, this.auth.username, {expires: 7, path: "/"});
            console.log(Cookies);
            this.snackbar = {
              enabled: true,
              color: "success",
              text: this.$t('success')
            };
            this.auth.dialog = false
          })
          .catch((err) => {
            this.snackbar = {
              enabled: true,
              color: "error",
              text: this.$t('failed', {message: err.errorMessage})
            }
          })
          .finally(() => {
            this.auth.loading = false
          })
      },
      logout() {
        Cookies.remove(this.cookies.key);
        this.$store.commit("authLogout");
        this.snackbar = {
          enabled: true,
          color: "success",
          text: this.$t('loggedOut')
        };
      }
    },
  }
</script>

<style scoped>
.c-s {
  cursor: pointer !important
}
</style>