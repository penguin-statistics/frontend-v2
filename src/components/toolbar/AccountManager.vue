<i18n>
{
	"en": {
		"failed": {
			"message": "Failed to log in: {message}",
			"notfound": "This User ID cannot be found. Please note that this is not the ID in the game. You will get one after your first drop report."
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
			"notfound": "指定されたユーザーIDが見つかりませんでした。初めてドロップをアップロードすると、ユーザーIDを自動的に取得できます。"
		},
		"loggedOut": "ログアウトしました",
		"login": "ログイン",
		"logout": "ログアウト",
		"logoutPrompt": "本当にログアウトしますか？",
		"notice": "ユーザーIDはアップロードの際にのみ使用します。このIDを使用し各機器を登録することでデータを1つのアカウントに統合することが可能となり、アップロードの管理や個人のドロップデータを調べることが可能となります。",
		"success": "ログイン成功",
    "userId": "ユーザーID",
    "details": "アカウント",
    "loggedAs": "Logged in as"
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
			"notfound": "未找到此用户ID。请注意这不是游戏内的ID。在本站汇报一次掉落数据即可自动获得。"
		},
		"loggedOut": "已退出登录",
		"login": "登录",
		"logout": "退出登录",
		"logoutPrompt": "确定要退出登录吗？",
		"notice": "用户 ID 仅用来标记您的上传身份。在不同设备上使用此 ID 登录，可让掉落数据集中于一个账号下，方便管理掉落汇报以及查看个人掉落数据。若无用户 ID，汇报一次掉落后即可拥有用户 ID。",
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
            clearable
            outlined
            :hide-details="error === ''"

            @keyup.enter.native="login"
            @input="emitError"
          >
            <template v-slot:append-outer>
              <v-dialog
                v-model="historyDialog"
                max-width="450px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <TooltipBtn
                    v-bind="attrs"
                    icon
                    top="-8px"
                    :tip="$t('auth.forgot.activator')"
                    v-on="on"
                  >
                    <v-icon>
                      mdi-help-circle
                    </v-icon>
                  </TooltipBtn>
                </template>
                <ForgotAccount
                  v-if="historyDialog"
                  @loggedIn="loggedIn"
                  @close="historyDialog = false"
                />
              </v-dialog>
            </template>
          </v-text-field>
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
  import ForgotAccount from "@/components/toolbar/ForgotAccount";
  import TooltipBtn from "@/components/global/TooltipBtn";
  import config from "@/config"

  export default {
    name: "AccountManager",
    components: {TooltipBtn, ForgotAccount, Subheader},
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
        historyDialog: false,
        error: ""
      }
    },
    created () {
      const userId = Cookies.get(config.authorization.userId.cookieKey);
      if (userId) this.$store.dispatch("auth/login", {userId, prompted: false});
    },
    methods: {
      loggedIn() {
        this.snackbar = {
          enabled: true,
          color: "success",
          text: this.$t('success')
        };
        this.auth.dialog = false
        this.$ga.event('account', 'login', 'login_success', 1);
        this.$emit('afterLogin');
      },
      login() {
        this.auth.loading = true;
        const authorizingUserId = this.auth.username
        service.post("/users", authorizingUserId, {headers: {'Content-Type': 'text/plain'}})
          .then(() => {
            this.$store.dispatch("auth/login", {
              userId: authorizingUserId
            });
            this.loggedIn()
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
        Cookies.remove(config.authorization.userId.cookieKey);
        this.$store.dispatch("auth/logout");
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
