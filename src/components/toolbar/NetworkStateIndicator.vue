<template>
  <div>
    <v-dialog
      v-model="model"
      width="600"
      origin="right bottom"
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

        <v-card-text class="pa-6">
          <span class="subtitle-1">
            {{ $t('fetch.failed.subtitle') }}
          </span>
          <v-divider class="my-6" />
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
                  {{ error.id }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ error.error }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-progress-circular
                  v-if="error.pending"
                  indeterminate
                />
                <v-icon v-else>
                  mdi-alert-circle-outline
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

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
    <v-slide-x-reverse-transition>
      <v-card
        v-if="(haveError && !model) || pending"
        class="network-state-indicator"
        :class="{'error': haveError, 'blue darken-2': !haveError}"
      >
        <v-fade-transition>
          <span
            v-if="haveError && !model"
            style="cursor: pointer"
            @click="model = true"
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

            <span class="caption">
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
            <span class="caption">
              {{ $t('meta.loading') }}
            </span>
          </span>
        </v-fade-transition>
      </v-card>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "NetworkStateIndicator",
    data () {
      return {
        model: false,
      }
    },
    computed: {
      ...mapGetters('ajax', ['pending', 'errors']),
      haveError () {
        return this.errors.length > 0
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
    },
  }
</script>

<style scoped>
  .network-state-indicator {
    position: fixed;
    right: 0;
    bottom: 0;
    padding: 4px 8px;
    border-radius: 4px 0 0 4px !important;
    margin-bottom: calc(max(env(safe-area-inset-bottom), 8px)) !important;
  }
</style>