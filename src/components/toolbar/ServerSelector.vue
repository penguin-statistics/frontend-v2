<template>
  <v-menu
    bottom
    left
    open-on-hover
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-haptic
        rounded
        class="mx-1"
        v-bind="attrs"
        large
        v-on="on"
      >
        <v-icon
          left
          small
        >
          mdi-server
        </v-icon>
        <div class="d-flex flex-column align-start justify-center">
          <span
            class="caption"
            style="line-height: 1rem"
          >
            <!--            <span class="grey&#45;&#45;text">{{ $t('server.selected') }}</span>-->
            <span class="grey--text">
              {{ $t("server.name") }}
            </span>
          </span>
          <span class="heading">
            {{ $t("server.servers." + activeServerId) }}
          </span>
        </div>
      </v-btn>
    </template>

    <v-list>
      <v-subheader
        style="height: 36px;"
        class="mb-1"
      >
        <v-icon
          small
          color="grey lighten-1"
          class="mr-2"
        >
          mdi-server
        </v-icon>
        {{ $t("server.name") }}
      </v-subheader>
      <v-list-item-group
        v-model="activeServer"
        mandatory
      >
        <v-list-item
          v-for="(server, i) in servers"
          :key="i"
          v-haptic
          :disabled="pending"
        >
          <v-list-item-title class="mr-2">
            {{ $t("server.servers." + server) }}
          </v-list-item-title>
          <v-list-item-action v-if="activeServerId === server">
            <v-progress-circular
              v-if="pending"
              indeterminate
              :width="2"
              :size="16"
            />
            <v-icon
              v-else
              small
            >
              mdi-check
            </v-icon>
          </v-list-item-action>
          <v-list-item-action-text
            class="monospace ml-2"
          >
            {{ server }}
          </v-list-item-action-text>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import supports from '@/models/supports'

export default {
  name: 'ServerSelector',
  data () {
    return {
      servers: supports.servers,
      update: false
    }
  },
  computed: {
    ...mapGetters('ajax', ['pending']),
    activeServer: {
      get () {
        return this.update || this.servers.indexOf(this.servers.find(el => el === this.$store.getters['dataSource/server']))
      },
      set (localeIndex) {
        if (this.$store.getters['dataSource/serverLocked']) {
          this.$store.commit('dataSource/changeLockState', 2)
          this.update = localeIndex
          this.$nextTick(function () {
            this.update = false
          })
        } else {
          this.changeServer(this.servers[localeIndex])
        }
      }
    },
    activeServerId () {
      return this.servers.find(el => el === this.$store.getters['dataSource/server'])
    }
  },
  methods: {
    changeServer (serverId) {
      this.$store.commit('planner/clearExcludes')
      this.$store.commit('dataSource/changeServer', serverId)
      this.$store.dispatch('data/fetch', false)
    }
  }
}
</script>

<style scoped>

</style>
