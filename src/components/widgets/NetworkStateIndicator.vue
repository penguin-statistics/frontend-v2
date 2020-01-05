<template>
  <div>
    <v-dialog
      v-model="model"
      width="600"
    >
      <v-card>
        <v-card-title
          class="headline red"
          primary-title
        >
          <v-icon>mdi-alert</v-icon>
          <span class="ml-2">{{ $t('fetch.failed.title') }}</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <span class="subheading">
            {{ $t('fetch.failed.subtitle') }}
          </span>
          <v-divider class="my-4" />
          <v-subheader>
            {{ $t('meta.details') }}
          </v-subheader>
          <v-list two-line>
            <v-list-tile
              v-for="error in $store.getters.ajaxErrors"
              :key="error.id"
              avatar
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ error.id }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ error.error }}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-progress-circular
                  v-if="error.pending"
                  indeterminate
                />
                <v-icon v-else>
                  mdi-alert-circle-outline
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            :loading="$store.getters.ajaxPending"
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
    <v-fade-transition>
      <span
        v-if="haveError"
        style="cursor: pointer"
        @click="model = true"
      >
        <v-progress-circular
          v-if="$store.getters.ajaxPending"
          indeterminate
          color="white"
          class="mr-1"
          :size="16"
          :width="2"
        />
        <v-icon
          v-else
          :size="16"
        >
          mdi-alert
        </v-icon>

        <span>
          {{ $t('fetch.failed.title') }} ({{ $store.getters.ajaxErrors.length }})
        </span>
      </span>
      <span
        v-else-if="$store.getters.ajaxPending"
      >
        <v-progress-circular
          indeterminate
          color="white"
          class="mr-1"
          :size="16"
          :width="2"
        />
        <span>
          {{ $t('meta.loading') }}
        </span>
      </span>
    </v-fade-transition>
  </div>
</template>

<script>
  export default {
    name: "NetworkStateIndicator",
    data () {
      return {
        model: false,
        close: false,
      }
    },
    computed: {
      haveError () {
        return this.$store.getters.ajaxErrors.length > 0
      }
    },
    watch: {
      haveError(newValue, oldValue) {
        if (newValue && !oldValue) {
          // changed from false to true
          this.model = true
        }
      }
    },
    methods: {
      async refreshData () {
        await this.$store.dispatch("fetchData", true);
      },
    },
  }
</script>

<style scoped>

</style>