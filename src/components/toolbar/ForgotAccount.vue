<i18n>
  {
    "en": {
      "failed": {
        "message": "Failed to log in: {message}",
        "notfound": "This User ID cannot be found. Please not that this is not the ID in the game. You will get one after your first drop report."
      }
    },
    "ja": {
      "failed": {
        "message": "ログイン失敗：{message}",
        "notfound": "指定されたユーザーIDが見つかりませんでした。初めてドロップをアップロードすると、ユーザーIDを自動的に取得できます。"
      }
    },
    "ko": {
      "failed": {
        "message": "로그인에 실패했습니다: {message}",
        "notfound": "지정된 사용자 ID를 찾을 수 없습니다"
      }
    },
    "zh": {
      "failed": {
        "message": "登录失败：{message}",
        "notfound": "未找到此用户ID。请注意这不是游戏内的ID。在本站汇报一次掉落数据即可自动获得。"
      }
    }
  }
</i18n>

<template>
  <v-card>
    <v-card-title class="title pb-1">
      <v-icon class="mr-1">
        mdi-help-circle
      </v-icon>
      无法登录？
    </v-card-title>
    <v-card-subtitle class="mt-0 pb-0">
      找回登录信息
    </v-card-subtitle>
    <v-card-text>
      <Subheader>
        此前曾登录的 PenguinID
      </Subheader>
      <!--      <v-chip-->
      <!--        v-for="userId in userIds"-->
      <!--        :key="userId.id"-->
      <!--        close-->
      <!--        class="mr-1"-->
      <!--        @click:close="deleteUserId(userId.id)"-->
      <!--      >-->
      <!--        <span class="monospace mr-1">-->
      <!--          {{ userId.id }}-->
      <!--        </span>-->
      <!--        <small class="caption">-->
      <!--          ({{ userId.formattedTime }})-->
      <!--        </small>-->
      <!--      </v-chip>-->
      <v-list>
        <template v-if="userIds.length">
          <v-list-item
            v-for="userId in userIds"
            :key="userId.id"
          >
            <v-list-item-content>
              <v-list-item-title>
                <span class="monospace">
                  {{ userId.id }}
                </span>
                <span class="grey--text">
                  —
                </span>
                <span class="caption">
                  {{ userId.version }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                最后于 {{ userId.formattedTime.relative }} 在本设备登录
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="flex-row">
              <TooltipBtn
                icon
                color="primary"
                class="mr-1"
                :loading="loading === userId.id"
                :disabled="loading && loading !== userId.id"
                tip="以此 PenguinID 登录"
                @click="loginAsUserId(userId.id)"
              >
                <v-icon>
                  mdi-login-variant
                </v-icon>
              </TooltipBtn>
              <TooltipBtn
                icon
                color="error"
                :disabled="loading === userId.id"
                tip="删除此 PenguinID 登录记录"
                @click="deleteUserId(userId.id)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </TooltipBtn>
            </v-list-item-action>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item class="justify-center grey--text py-0">
            暂无数据
          </v-list-item>
        </template>
        <v-list-item class="justify-center grey--text py-0 my-0 caption">
          本功能仅可找回于 v3.3.1 及更新版本客户端所登录的 PenguinID
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  import Subheader from "@/components/global/Subheader";
  import {mapGetters} from "vuex";
  import timeFormatter from "@/utils/timeFormatter";
  import service from "@/utils/service";
  import Console from "@/utils/Console";
  import TooltipBtn from "@/components/global/TooltipBtn";
  export default {
    name: "ForgotAccount",
    components: {TooltipBtn, Subheader},
    data() {
      return {
        loading: false
      }
    },
    computed: {
      ...mapGetters("options", ["userIdHistory"]),
      userIds() {
        return this.userIdHistory
          .slice()
          .sort((a, b) => b.time - a.time)
          .map(el => {
            return {
              ...el,
              formattedTime: {
                exact: timeFormatter.date(el.time, true, true),
                relative: timeFormatter.dayjs(el.time).fromNow(),
              }
            }
          });
      }
    },
    methods: {
      deleteUserId(userId) {
        this.$store.commit("options/removeUserIdHistory", userId)
      },
      loginAsUserId(userId) {
        this.loading = userId
        service.post("/users", userId, {headers: {'Content-Type': 'text/plain'}})
          .then(() => {
            this.$store.dispatch("auth/login", {userId})
            this.$emit('loggedIn')
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
            this.loading = false
          })
      },
      up () {
        this.$forceUpdate()
      }
    },
  }
</script>

<style scoped>

</style>