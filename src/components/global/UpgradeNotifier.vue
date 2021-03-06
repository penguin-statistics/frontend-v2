<template>
  <v-dialog
    :value="$store.getters['ui/outdated']"
    max-width="350px"
    persistent
  >
    <v-card class="slash-strip--warning-transparent">
      <v-card-title class="headline">
        <v-icon left>
          mdi-alert-circle
        </v-icon>
        {{ $t('version.upgrade.title') }}
      </v-card-title>

      <v-card-text>
        {{ $t('version.upgrade.subtitle') }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <DataResetter>
          <template v-slot:default="{ on }">
            <v-btn
              v-haptic
              color="white"
              text
              v-on="on"
            >
              {{ $t('version.upgrade.unable') }}
            </v-btn>
            <v-spacer />
          </template>
        </DataResetter>

        <v-btn
          v-haptic
          color="primary"
          depressed
          :loading="upgrading"
          @click="upgrade"
        >
          {{ $t('version.upgrade.action') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DataResetter from '@/components/drawer/DataResetter'
export default {
  name: 'UpgradeNotifier',
  components: { DataResetter },
  data () {
    return {
      upgrading: false
    }
  },
  methods: {
    upgrade () {
      this.upgrading = true
      setTimeout(function () {
        window.location.reload()
      }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
