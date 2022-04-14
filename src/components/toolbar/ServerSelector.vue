<template>
  <v-menu
    bottom
    left
    open-on-hover
    transition="slide-y-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-haptic
        rounded
        class="mx-1"
        v-bind="attrs"
        large
        :disabled="serverLocked"
        v-on="on"
      >
        <v-icon
          left
          small
        >
          {{ serverLocked ? "mdi-server-security" : "mdi-server" }}
        </v-icon>
        <div class="d-flex flex-column align-start justify-center">
          <span
            class="caption"
            style="line-height: 1rem"
          >
            <span class="degraded-opacity">
              {{ $t("server.name") }}
            </span>
          </span>
          <span class="heading">
            {{ $t("server.servers." + activeServerId) }}
          </span>
        </div>
        <v-scale-transition origin="center center">
          <v-icon
            v-if="serverLocked"
            right
            small
          >
            mdi-lock
          </v-icon>
        </v-scale-transition>
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
          <v-list-item-action-text class="monospace ml-2">
            {{ server }}
          </v-list-item-action-text>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";
import supports from "@/models/supports";
import snackbar from "@/utils/snackbar";

export default {
  name: "ServerSelector",
  data() {
    return {
      servers: supports.servers,
    };
  },
  computed: {
    ...mapGetters("ajax", ["pending"]),
    ...mapGetters("ui", ["serverLocked"]),
    activeServer: {
      get() {
        return (
          this.update ||
          this.servers.indexOf(
            this.servers.find(
              (el) => el === this.$store.getters["dataSource/server"]
            )
          )
        );
      },
      set(localeIndex) {
        this.changeServer(this.servers[localeIndex]);
      },
    },
    activeServerId() {
      return this.servers.find(
        (el) => el === this.$store.getters["dataSource/server"]
      );
    },
  },
  methods: {
    changeServer(serverId) {
      const oldServerId = this.$store.getters["dataSource/server"];
      this.$store.commit("planner/clearExcludes");
      this.$store.dispatch("data/clean", oldServerId);
      this.$store.commit("dataSource/changeServer", serverId);
      this.$store.dispatch("data/fetch", false);
    },
    notify() {
      if (this.serverLocked) {
        snackbar.launch(
          "info",
          10000,
          "进行掉落识别时不可切换服务器。若需切换，请先退出掉落识别页面"
        );
      }
    },
  },
};
</script>

<style scoped></style>
