<i18n>
  {
    "zh": {
      "notice": "用户 ID 仅用来标记您的上传身份。在不同设备上使用此 ID 登录，可让掉落数据集中于一个账号下，方便管理上传以及查看个人掉落数据。",
      "success": "登录成功",
      "failed": {
        "message": "登录失败：{message}",
        "notfound": "未找到所提供的用户 ID"
      },
      "login": "登录",
      "logout": "退出登录",
      "logoutPrompt": "确定要退出登录吗？",
      "loggedOut": "已退出登录",
      "userId": "用户 ID"
    },
    "en": {
      "notice": "The User ID helps us identifies your upload identity. Inputting this ID on other devices enable you to manage and inspect your uploads with ease.",
      "success": "Successfully logged in",
      "failed": {
        "message": "Failed to log in: {message}",
        "notfound": "The specified User ID could not been found"
      },
      "login": "Login",
      "logout": "Logout",
      "logoutPrompt": "Are you sure?",
      "loggedOut": "Logged out",
      "userId": "User ID"
    },
    "ja": {
      "notice": "ユーザーIDはアップロードの際にのみ使用します。このIDを使用し各機器を登録することでデータを1つのアカウントに統合することが可能となり、アップロードの管理や個人のドロップデータを調べることが可能となります。",
      "success": "ログイン成功",
      "failed": {
        "message": "ログイン失敗：{message}",
        "notfound": "指定されたユーザーIDが見つかりませんでした"
      },
      "login": "ログイン",
      "logout": "ログアウト",
      "logoutPrompt": "本当にログアウトしますか？",
      "loggedOut": "ログアウトしました",
      "userId": "ユーザーID"
    },
    "ko": {
      "notice": "The User ID helps us identifies your upload identity. Inputting this ID on other devices enable you to manage and inspect your uploads with ease.",
      "success": "Successfully logged in",
      "failed": {
        "message": "Failed to log in: {message}",
        "notfound": "The specified User ID could not been found"
      },
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
        text
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
        <v-card-title class="headline">
          {{ $t('login') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="info"
            border="left"
            class="mt-2 mb-6"
          >
            {{ $t('notice') }}
          </v-alert>
          <v-text-field
            v-model="auth.username"
            :label="`${$t('userId')} *`"
            :error-messages="error"
            required
            outlined
            :hide-details="error === ''"

            @keyup.enter.native="login"
            @input="emitError"
          />
        </v-card-text>
        <v-card-actions class="mx-4 mb-2">
          <v-btn
            :loading="auth.loading"
            :disabled="auth.username === ''"
            color="primary"
            block
            large
            @click="login"
          >
            <v-icon left>
              mdi-login-variant
            </v-icon>

            {{ $t('dialog.submit') }}
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

    <v-chip
      v-if="$store.getters['auth/loggedIn']"
      style="box-shadow: 0 0 0 4px rgba(0, 0, 0, .3)"
      @click="auth.logoutPrompt = true"
    >
      <v-icon 
        left
      >
        mdi-account-circle
      </v-icon>
      {{ $store.getters['auth/username'] }}
    </v-chip>

    <v-btn
      v-if="!$store.getters['auth/loggedIn']"
      rounded
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
  import Console from "@/utils/Console";

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
        },
        error: ""
      }
    },
    computed: {
      mobile() {
        return !!("ontouchstart" in window) || window.navigator.maxTouchPoints > 0;
      }
    },
    mounted () {
      let userId = Cookies.get(this.cookies.key);
      if (userId !== this.$store.getters['auth/username']) {
        this.$store.commit("auth/login", userId);
      }
    },
    methods: {
      login() {
        this.auth.loading = true;
        service.post("/users", this.auth.username, {headers: {'Content-Type': 'text/plain'}})
          .then(() => {
            this.$store.commit("auth/login", this.auth.username);
            Cookies.set(this.cookies.key, this.auth.username, {expires: 7, path: "/"});
            this.$ga.event('account', 'login', 'login_success', 1);
            this.snackbar = {
              enabled: true,
              color: "success",
              text: this.$t('success')
            };
            this.$store.dispatch("data/refreshPersonalMatrix");
            this.$emit('afterLogin');
            this.auth.dialog = false
          })
          .catch((err) => {
            Console.debug(err)
            if (err.response && err.response.status && err.response.status === 404) {
              this.error = this.$t('failed.message', {message: this.$t('failed.notfound')})
            } else {
              this.error = this.$t('failed.message', {message: err.errorMessage})
            }
          })
          .finally(() => {
            this.auth.loading = false
          })
      },
      logout() {
        Cookies.remove(this.cookies.key);
        this.$store.commit("auth/logout");
        this.snackbar = {
          enabled: true,
          color: "success",
          text: this.$t('loggedOut')
        };
        this.auth.logoutPrompt = false;
        this.$store.commit("dataSource/switch", "global");
      },
      emitError () {
        this.error = ''
      }
    },
  }
</script>

<style scoped>
.c-s {
  cursor: pointer !important
}
</style>
