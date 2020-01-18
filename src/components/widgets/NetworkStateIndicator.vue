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
          <v-icon>mdi-alert</v-icon>
          <span class="ml-2">{{ $t('fetch.failed.title') }}</span>
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
              v-for="error in $store.getters.ajaxErrors"
              :key="error.id"
              avatar
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
        v-if="haveError && !model"
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
          class="mr-1"
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
        await this.$store.dispatch("fetchData", true);
      },
    },
  }
</script>

<style scoped>

</style>