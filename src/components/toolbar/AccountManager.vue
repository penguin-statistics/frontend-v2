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
        v-haptic
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
          {{ $t('auth.login') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            type="info"
            border="left"
            class="mt-2 mb-6"
          >
            {{ $t('auth.notice') }}
          </v-alert>
          <v-text-field
            v-model="auth.username"
            :label="`${$t('auth.userId')} *`"
            :error-messages="error"
            required
            clearable
            outlined
            :hide-details="error === ''"

            @keyup.enter.native="login"
            @input="emitError"
          >
            <template #append-outer>
              <v-dialog
                v-model="historyDialog"
                max-width="450px"
              >
                <template #activator="{ on, attrs }">
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
            v-haptic
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
            {{ $t('auth.details') }}
          </span>
        </v-card-title>
        <v-card-text>
          <Subheader class="mb-2">
            {{ $t('auth.loggedAs') }}
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
            {{ $t('auth.logout') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="$store.getters['auth/loggedIn']"
      v-haptic

      icon
      @click="auth.detailPrompt = true"
    >
      <v-icon>mdi-account-check</v-icon>
    </v-btn>

    <v-btn
      v-if="!$store.getters['auth/loggedIn']"
      v-haptic

      icon
      @click="auth.dialog = true"
    >
      <v-icon>mdi-login-variant</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { service } from '@/utils/service'
import Console from '@/utils/Console'
import Subheader from '@/components/global/Subheader'
import ForgotAccount from '@/components/toolbar/ForgotAccount'
import TooltipBtn from '@/components/global/TooltipBtn'

export default {
  name: 'AccountManager',
  components: { TooltipBtn, ForgotAccount, Subheader },
  data () {
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
        color: '',
        text: ''
      },
      historyDialog: false,
      error: ''
    }
  },
  methods: {
    loggedIn () {
      this.snackbar = {
        enabled: true,
        color: 'success',
        text: this.$t('auth.success')
      }
      this.auth.dialog = false
      this.$ga.event('account', 'login', 'login_success', 1)
      this.$emit('afterLogin')
    },
    login () {
      this.auth.loading = true
      const authorizingUserId = this.auth.username
      service.post('/users', authorizingUserId, { headers: { 'Content-Type': 'text/plain' } })
        .then(() => {
          this.loggedIn()
        })
        .catch((err) => {
          Console.info('AccountManager', 'auth failed', err)
          if (err.response && err.response.status && err.response.status === 404) {
            this.error = this.$t('auth.failed.message', { message: this.$t('failed.notfound') })
          } else {
            this.error = this.$t('auth.failed.message', { message: err.errorMessage })
          }
        })
        .finally(() => {
          this.auth.loading = false
        })
    },
    logout () {
      this.$store.dispatch('auth/logout')
      this.snackbar = {
        enabled: true,
        color: 'success',
        text: this.$t('auth.loggedOut')
      }
      this.auth.detailPrompt = false
      this.$store.commit('dataSource/changeSource', 'global')
    },
    emitError () {
      this.error = ''
    }
  }
}
</script>

<style scoped>
.c-s {
  cursor: pointer !important
}
</style>
