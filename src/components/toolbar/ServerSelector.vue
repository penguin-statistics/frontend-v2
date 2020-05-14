<template>
  <v-menu
    bottom
    left
    open-on-hover
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        rounded
        class="mx-1"
        v-on="on"
      >
        <v-icon
          left
          small
        >
          mdi-server
        </v-icon>
        <span class="monospace">
          {{ $t("server.servers." + activeServerId) }}
        </span>
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
        </v-icon> {{ $t("server.switch") }}
      </v-subheader>
      <v-list-item-group
        v-model="activeServer"
        mandatory
      >
        <v-list-item
          v-for="(server, i) in servers"
          :key="i"
          :disabled="pending"
        >
          <v-list-item-title class="mr-2 monospace">
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
  import config from "@/config"
  import {mapGetters} from "vuex";

  export default {
    name: "ServerSelector",
    data() {
      return {
        servers: config.servers
      }
    },
    computed: {
      ...mapGetters("ajax", ["pending"]),
      activeServer: {
        get () {
          return this.servers.indexOf(this.servers.find(el => el === this.$store.getters["dataSource/server"]))
        },
        set (localeIndex) {
          this.changeServer(this.servers[localeIndex])
        }
      },
      activeServerId () {
        return this.servers.find(el => el === this.$store.getters["dataSource/server"])
      }
    },
    methods: {
      changeServer(serverId) {
        this.$store.commit("dataSource/changeServer", serverId)
        this.$store.dispatch("data/fetch", false)
      }
    },
  }
</script>

<style scoped>

</style>