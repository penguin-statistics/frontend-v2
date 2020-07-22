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
        此前登录过的 Penguin ID
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
              <v-list-item-title class="monospace">
                {{ userId.id }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userId.formattedTime.exact }} ({{ userId.formattedTime.relative }})
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="flex-row">
              <v-btn
                icon
                color="primary"
                class="mr-1"
                @click="loginAsUserId(userId.id)"
              >
                <v-icon>
                  mdi-login-variant
                </v-icon>
              </v-btn>
              <v-btn
                icon
                color="error"
                @click="deleteUserId(userId.id)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item class="justify-center grey--text py-0">
            暂无数据
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  import Subheader from "@/components/global/Subheader";
  import {mapGetters} from "vuex";
  import timeFormatter from "@/utils/timeFormatter";
  export default {
    name: "ForgotAccount",
    components: {Subheader},
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
        this.$emit('loggedIn')
        this.$store.dispatch("auth/login", userId)
      },
      up () {
        this.$forceUpdate()
      }
    },
  }
</script>

<style scoped>

</style>