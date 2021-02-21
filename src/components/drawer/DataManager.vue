<template>
  <div>
    <Subheader>
      {{ $t('settings.category.data') }}
    </Subheader>

    <v-card-text class="pr-0 pt-0">
      <ul>
        <li>
          {{ $t('settings.data.server') }}<span class="monospace">{{ dataStats.keys.filter(el => !~el.indexOf("_")).join(", ") }}</span>
        </li>
        <li>
          {{ $t('settings.data.size') }}<span class="monospace">{{ dataStats.size }}</span>
        </li>
      </ul>
    </v-card-text>

    <v-btn
      v-haptic
      outlined
      block
      class="mb-2"
      :loading="pending"
      @click="refreshData"
    >
      <v-icon left>
        mdi-database-refresh
      </v-icon>
      {{ $t('menu.refreshData') }}
    </v-btn>

    <DataResetter v-if="!$env.isApp">
      <template v-slot:default="{ on }">
        <v-btn
          v-haptic.notification="'WARNING'"
          depressed
          block
          color="error"
          v-on="on"
        >
          <v-icon left>
            mdi-database-remove
          </v-icon>
          {{ $t('settings.data.reset.title') }}...
        </v-btn>
      </template>
    </DataResetter>
  </div>
</template>

<script>
  import Subheader from "@/components/global/Subheader";
  import DataResetter from "@/components/drawer/DataResetter";
  import {mapGetters} from "vuex";
  export default {
    name: "DataManager",
    components: {DataResetter, Subheader},
    computed: {
      ...mapGetters("ajax", ["pending"]),
      dataStats() {
        return this.$store.getters["data/stats"];
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

</style>