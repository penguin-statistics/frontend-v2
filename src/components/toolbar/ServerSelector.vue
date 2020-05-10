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
        <span class="monospace">{{ activeServerObject.name }}</span>
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
        </v-icon> 服务器切换
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
          <v-list-item-title class="mr-2">
            {{ server.name }}
          </v-list-item-title>
          <v-list-item-action v-if="activeServer === i">
            <v-icon small>
              mdi-check
            </v-icon>
          </v-list-item-action>
          <v-list-item-action-text
            class="monospace ml-2"
          >
            {{ server.id }}
          </v-list-item-action-text>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "ServerSelector",
    data() {
      return {
        servers: [
          {
            id: 'CN',
            name: '国服'
          },
          {
            id: 'US',
            name: '美服'
          },
          {
            id: 'JP',
            name: '日服'
          },
          {
            id: 'KR',
            name: '韩服'
          }
        ],
      }
    },
    computed: {
      ...mapGetters("ajax", ["pending"]),
      activeServer: {
        get () {
          return this.servers.indexOf(this.servers.find(el => el.id === this.$store.getters["dataSource/server"]))
        },
        set (localeIndex) {
          const serverObject = this.servers[localeIndex];
          this.changeServer(serverObject.id)
        }
      },
      activeServerObject () {
        return this.servers.find(el => el.id === this.$store.getters["dataSource/server"])
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