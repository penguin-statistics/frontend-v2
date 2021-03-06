<template>
  <span>
    <v-dialog
      v-model="prefetchingResources"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ $t('meta.loading') }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('dataSource.title') }}
        </v-card-title>
        <v-card-text>
          {{ $t('dataSource.loginNotice') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <AccountManager @afterLogin="afterLogin" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn-toggle
      v-model="dataSource"
      active-class="font-weight-bold"
      mandatory
      borderless
      class="data-source-switch"
    >
      <v-btn
        v-haptic
        small
        value="global"
      >
        {{ $t('dataSource.global') }}
      </v-btn>
      <v-btn
        v-haptic
        small
        value="personal"
      >
        {{ $t('dataSource.personal') }}
      </v-btn>
    </v-btn-toggle>
  </span>
</template>

<script>
import AccountManager from '@/components/toolbar/AccountManager'
import { mapGetters } from 'vuex'
export default {
  name: 'DataSourceToggle',
  components: {
    AccountManager
  },
  data () {
    return {
      dialog: false,
      prefetchingResources: false,
      dataSourceId: null
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('dataSource', ['source']),
    dataSource: {
      get () {
        return this.source
      },
      async set (value) {
        switch (value) {
          case 'global':
            break
          case 'personal':
            // refresh personal data
            if (!this.loggedIn) {
              // please login
              this.dialog = true
              return
            }
            // fetch data
            this.$store.dispatch('data/refreshPersonalMatrix')
            // change data source after fetch data
            break
        }
        this.$store.commit('dataSource/changeSource', value)
      }
    }
  },
  methods: {
    afterLogin () {
      this.dialog = false
      this.dataSource = 'personal'
    }
  }
}
</script>

<style scoped>
  .theme--light.data-source-switch {
    border: 1px solid rgba(0, 0, 0, .8);
  }
  .theme--dark.data-source-switch {
    border: 1px solid rgba(255, 255, 255, .6);
  }
</style>
