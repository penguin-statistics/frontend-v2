<template>
  <div>
    <Subheader>
      {{ $t('settings.category.data') }}
    </Subheader>

    <v-card-text class="pr-0 pt-0">
      <ul>
        <li>
          本地数据条目数：{{ dataSize }} 条
        </li>
      </ul>
    </v-card-text>

    <v-btn
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

    <DataResetter />
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
      dataSize() {
        return this.$store.getters["data/length"];
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