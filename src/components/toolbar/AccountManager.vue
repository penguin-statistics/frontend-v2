<i18n>
{
	"en": {
		"failed": {
			"message": "Failed to log in: {message}",
			"notfound": "This User ID cannot be found. Please not that this is not the ID in the game. You will get one after your first drop report."
		},
		"loggedOut": "Logged out",
		"login": "Login",
		"logout": "Logout",
		"logoutPrompt": "Are you sure?",
		"notice": "You can connect and manage drop reports using your User ID. If you don't have a User ID yet, you will be automatically assigned one after you've made your first report.",
		"success": "Successfully logged in",
		"userId": "User ID",
    "details": "Account",
    "loggedAs": "Logged in as"
	},
	"ja": {
		"failed": {
			"message": "ログイン失敗：{message}",
			"notfound": "指定されたユーザーIDが見つかりませんでした"
		},
		"loggedOut": "ログアウトしました",
		"login": "ログイン",
		"logout": "ログアウト",
		"logoutPrompt": "本当にログアウトしますか？",
		"notice": "ユーザーIDはアップロードの際にのみ使用します。このIDを使用し各機器を登録することでデータを1つのアカウントに統合することが可能となり、アップロードの管理や個人のドロップデータを調べることが可能となります。",
		"success": "ログイン成功",
		"userId": "ユーザーID"
	},
	"ko": {
		"failed": {
			"message": "로그인에 실패했습니다: {message}",
			"notfound": "지정된 사용자 ID를 찾을 수 없습니다"
		},
		"loggedOut": "로그아웃 되었습니다",
		"login": "로그인",
		"logout": "로그아웃",
		"logoutPrompt": "정말로 로그아웃 하시겠습니까?",
		"notice": "사용자 ID는 당신의 보고서를 확인하는데 사용됩니다. 이 ID를 다른 기기에 입력하면 편리하게 보고서를 관리하고 검사할 수 있습니다.",
		"success": "성공적으로 로그인 되었습니다.",
		"userId": "사용자 ID"
	},
	"zh": {
		"failed": {
			"message": "登录失败：{message}",
			"notfound": "未找到此用户ID。请注意这不是游戏内的ID。在本站上传一次掉落数据即可自动获得。"
		},
		"loggedOut": "已退出登录",
		"login": "登录",
		"logout": "退出登录",
		"logoutPrompt": "确定要退出登录吗？",
		"notice": "用户 ID 仅用来标记您的上传身份。在不同设备上使用此 ID 登录，可让掉落数据集中于一个账号下，方便管理上传以及查看个人掉落数据。若无用户 ID，上传一次掉落后即可拥有用户 ID。",
		"success": "登录成功",
		"userId": "用户 ID",
    "details": "账户信息",
    "loggedAs": "已登录为"
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
    >
      {{ snackbar.text }}
      <v-btn
        text
        @click="snackbar.enabled = false"
      >
        {{ $t('meta.dialog.close') }}
      </v-btn>
    </v-snackbar>

    <v-dialog
      v-model="auth.dialog"
      max-width="550px"
    >
      <v-card class="py-2 px-1">
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

            {{ $t('meta.dialog.submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="auth.detailPrompt"
      max-width="450px"
    >
      <v-card class="pa-2">
        <v-card-title>
          <span class="headline">
            {{ $t('details') }}
          </span>
        </v-card-title>
        <v-card-text>
          <Subheader class="mb-2">
            {{ $t('loggedAs') }}
          </Subheader>
          <span
            class="text-center monospace"
            style="font-size: 36px"
          >
            <span style="font-size: 16px">
              PenguinID#
            </span>{{ $store.getters['auth/username'] }}
          </span>

          <v-btn
            color="error"
            block
            large
            class="mt-6"

            @click="logout"
          >
            <v-icon left>
              mdi-logout-variant
            </v-icon>
            {{ $t('logout') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="$store.getters['auth/loggedIn']"

      icon
      @click="auth.detailPrompt = true"
    >
      <v-icon>mdi-account-check</v-icon>
    </v-btn>

    <v-btn
      v-if="!$store.getters['auth/loggedIn']"

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
  import Subheader from "@/components/global/Subheader";

  export default {
    name: "AccountManager",
    components: {Subheader},
    data() {
      return {
        auth: {
          buttonHovered: false,
          dialog: false,
          username: '',
          loading: false,
          detailPrompt: false
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
      const userId = Cookies.get(this.cookies.key);
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
            this.$emit('afterLogin');
            this.auth.dialog = false
            this.$store.dispatch("data/refreshPersonalMatrix");
          })
          .catch((err) => {
            Console.info("AccountManager", "auth failed", err)
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
        this.auth.detailPrompt = false;
        this.$store.commit("dataSource/changeSource", "global");
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
