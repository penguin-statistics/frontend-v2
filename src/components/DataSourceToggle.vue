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
        <v-card-text>
          查看个人掉落数据前，请先登录
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <AccountManager @afterLogin="afterLogin" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn-toggle
      v-model="dataSource"
      mandatory
    >
      <v-btn
        value="global"
        text
      >
        全平台
      </v-btn>
      <v-btn
        value="personal"
        text
      >
        个人
      </v-btn>
    </v-btn-toggle>
  </span>
</template>

<script>
import AccountManager from '@/components/AccountManager'
export default {
  name: "DataSourceToggle",
  components: {
    AccountManager
  },
  data() {
    return {
      dialog: false,
      prefetchingResources: false
    };
  },
  computed: {
    dataSource: {
      get() {
        return this.$store.state.dataSource;
      },
      async set(value) {
        switch (value) {
          case "global":
            break;
          case "personal":
            // refresh personal data
            if (!this.$store.getters.authed) {
              // please login
              this.dialog = true;
              return;
            }
            // fetch data
            this.$store.dispatch("refreshPersonalMatrixData");
            // change data source after fetch data
            break;
        }
        this.$store.commit("switchDataSource", value);
      }
    }
  },
  methods: {
    afterLogin () {
      this.dialog = false;
      this.dataSource = "personal";
    }
  }
};
</script>

<style scoped>
</style>