<template>
  <div>
    <v-slide-x-reverse-transition>
      <v-card
        v-if="show"
        class="network-state-indicator transition-all"
        :class="{'error': haveError, 'blue darken-2': !haveError}"
      >
        <v-fade-transition>
          <span
            v-if="haveError && !model"
            style="cursor: pointer"
            @click="openModel"
          >
            <v-progress-circular
              v-if="pending"
              indeterminate
              color="white"
              class="mr-1"
              :size="16"
              :width="2"
            />
            <v-icon
              v-else
              small
              class="mr-1"
            >
              mdi-alert
            </v-icon>

            <span class="caption white--text">
              {{ $t('fetch.failed.title') }} ({{ errors.length }})
            </span>
          </span>
          <span
            v-else-if="pending"
          >
            <v-progress-circular
              indeterminate
              color="white"
              class="mr-1"
              :size="16"
              :width="2"
            />
            <span class="caption white--text">
              {{ $t('meta.loading') }} ({{ percentage }})
            </span>
          </span>
        </v-fade-transition>
      </v-card>
    </v-slide-x-reverse-transition>
    <v-dialog
      v-model="model"
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
  import {mapGetters} from "vuex";

  export default {
    name: "NetworkStateIndicator",
    data () {
      return {
        model: false,
        origin: 'center center'
      }
    },
    computed: {
      ...mapGetters('ajax', ['pending', 'errors']),
      haveError () {
        return this.errors.length > 0
      },
      show () {
        return (this.haveError && !this.model) || this.pending
      },
      percentage() {
        const states = this.$store.state.ajax.states
        const pending = states.filter(el => el.pending).length
        return `${Math.ceil(100 - (pending / states.length) * 100)}%`
      }
    },
    watch: {
      haveError(newValue, oldValue) {
        if (newValue && !oldValue) {
          // error appeared. force open the window
          this.model = true
        } else if (!newValue && oldValue) {
          // error resolved. force close the window
          this.model = false
        }
      }
    },
    methods: {
      async refreshData () {
        await this.$store.dispatch("data/fetch", true);
      },
      openModel (e) {
        this.model = true;
        this.origin = `${e.clientX}px ${e.clientY}px`
      }
    },
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
    z-index: 1000001; /* to override crisp */
  }
</style>