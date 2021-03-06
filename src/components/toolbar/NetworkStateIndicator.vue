<template>
  <div>
    <v-slide-x-reverse-transition>
      <v-card
        v-if="delayedShow"
        class="network-state-indicator transition-all"
        :class="{'error': haveError, 'blue darken-2': !haveError}"
      >
        <!--        <ul style="list-style: none; padding-left: 0;">-->
        <!--          <template v-for="state in states">-->
        <!--            <v-expand-transition :key="state.id">-->
        <!--              <li-->
        <!--                v-if="state.pending || state.error"-->
        <!--                class="d-flex flex-row align-center"-->
        <!--              >-->
        <!--                <v-icon-->
        <!--                  v-if="!state.pending"-->
        <!--                  small-->
        <!--                  :color="state.error ? 'error darken-4' : 'success lighten-1'"-->
        <!--                  :class="{'have-error-state__other': haveError && !state.error, 'have-error-state__self': haveError && state.error}"-->
        <!--                >-->
        <!--                  {{ state.error ? "mdi-alert" : "mdi-check-circle" }}-->
        <!--                </v-icon>-->
        <!--                <v-progress-circular-->
        <!--                  v-else-->
        <!--                  indeterminate-->
        <!--                  :size="14"-->
        <!--                  :width="2"-->
        <!--                  style="margin-left: 1px"-->
        <!--                />-->
        <!--                <span class="ml-1 caption">-->
        <!--                  {{ $t(`fetch.failed.error.${state.id}`) }}-->
        <!--                </span>-->
        <!--              </li>-->
        <!--            </v-expand-transition>-->
        <!--          </template>-->
        <!--        </ul>-->
        <v-fade-transition>
          <span
            v-if="haveError && !dialog"
            class="d-flex flex-column"
            style="cursor: pointer"
            @click="openDialog"
          >
            <PreloaderInline
              v-if="pending"
              small
              class="my-2 mx-auto"
            />
            <v-icon
              v-else
              :size="48"
              class="my-4 mx-auto"
            >
              mdi-close-network
            </v-icon>

            <span class="caption white--text">
              {{ $t('fetch.failed.title') }} ({{ errors.length }})
            </span>
          </span>
          <span
            v-else-if="pending"
            class="d-flex flex-column"
          >
            <PreloaderInline
              small
              class="my-2 mx-auto"
            />
            <span class="caption white--text">
              {{ $t('fetch.loading') }} ({{ percentage }})
            </span>
          </span>
        </v-fade-transition>
      </v-card>
    </v-slide-x-reverse-transition>
    <v-dialog
      v-model="dialog"
      width="600"
      :origin="origin"
    >
      <v-card>
        <v-card-title
          class="headline red"
          primary-title
        >
          <v-icon class="mr-2">
            mdi-alert
          </v-icon>
          <span>{{ $t('fetch.failed.title') }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <span class="subtitle-1">
            {{ $t('fetch.failed.subtitle') }}
          </span>
          <v-divider class="mt-3 mb-1" />
          <v-subheader>
            {{ $t('meta.details') }}
          </v-subheader>
          <v-list two-line>
            <v-list-item
              v-for="error in errors"
              :key="error.id"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <span class="monospace grey--text">#{{ error.id }} - </span>
                  {{ $t(`fetch.failed.error.${error.id}`) }}
                </v-list-item-title>
                <v-list-item-subtitle class="d-flex monospace">
                  <v-icon
                    x-small
                    left
                    color="grey"
                  >
                    mdi-alert
                  </v-icon>
                  {{ error.error }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-progress-circular
                  v-if="error.pending"
                  indeterminate
                  :width="3"
                />
                <v-icon v-else>
                  mdi-alert-circle-outline
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            :loading="pending"
            @click="refreshData"
          >
            <v-icon left>
              mdi-database-refresh
            </v-icon>
            {{ $t('fetch.failed.retry') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import PreloaderInline from '@/components/global/PreloaderInline'
import haptics from '@/utils/native/haptics'

export default {
  name: 'NetworkStateIndicator',
  components: { PreloaderInline },
  data () {
    return {
      dialog: false,
      origin: 'center center',
      delayedShow: false,
      timer: null
    }
  },
  computed: {
    ...mapGetters('ajax', ['pending', 'errors']),
    ...mapState('ajax', ['states']),
    haveError () {
      return this.errors.length > 0
    },
    show () {
      return (this.haveError && !this.dialog) || this.pending
    },
    percentage () {
      const states = this.$store.state.ajax.states
      const pending = states.filter(el => el.pending).length
      return `${Math.ceil(100 - (pending / states.length) * 100)}%`
    },
    ajaxStates () {
      return this.states
    }
  },
  watch: {
    haveError (newValue, oldValue) {
      if (newValue && !oldValue) {
        // error appeared. force open the window
        this.dialog = true
      } else if (!newValue && oldValue) {
        // error resolved. force close the window
        this.dialog = false
      }
    },
    show (newValue) {
      const self = this

      // we only delay (old)true -> (current)false

      // if there's already a timer, cancel it
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      // avoid delaying (apply immediately)
      if (newValue === true) this.delayedShow = newValue

      // do delay
      if (newValue === false) {
        this.timer = setTimeout(function () {
          self.delayedShow = newValue
          haptics.success()
        }, 175)
      }
    }
  },
  methods: {
    async refreshData () {
      await this.$store.dispatch('data/fetch', true)
    },
    openDialog (e) {
      this.dialog = true
      this.origin = `${e.clientX}px ${e.clientY}px`
    }
  }
}
</script>

<style>
  .network-state-indicator {
    position: fixed !important;
    right: 0;
    bottom: 0;
    padding: 4px 8px;
    border-radius: 4px 0 0 4px !important;
    margin-bottom: calc(max(env(safe-area-inset-bottom), 8px)) !important;
    z-index: 1000001; /* to override crisp & stay on top of the server switcher notifier */
  }

  .have-error-state__other {
    text-shadow: 0 0 3px rgba(0, 0, 0, .5);
  }
  .have-error-state__self {
    text-shadow: 0 0 5px rgba(255, 255, 255, .5);
  }
</style>
