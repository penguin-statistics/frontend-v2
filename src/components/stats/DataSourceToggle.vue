<i18n>
  {
    "zh": {
      "dataSourceToggle": {
        "loginNotice": "查看个人掉落数据前，请先登录",
        "all": "全平台",
        "personal": "个人"
      }
    },
    "en": {
      "dataSourceToggle": {
        "loginNotice": "Please log in before viewing personal drop data.",
        "all": "All",
        "personal": "Personal"
      }
    },
    "ja": {
      "dataSourceToggle": {
        "loginNotice": "個人のドロップデータを表示するにはログインが必要となります。",
        "all": "全体",
        "personal": "個人"
      }
    }
  }
</i18n>

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
          {{ $t('dataSourceToggle.loginNotice') }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <AccountManager @afterLogin="afterLogin" />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn-toggle v-model="dataSourceModifier">
      <v-btn small>
        {{ $t('dataSourceToggle.all') }}
      </v-btn>
      <v-btn small>
        {{ $t('dataSourceToggle.personal') }}
      </v-btn>
    </v-btn-toggle>
  </span>
</template>

<script>
import AccountManager from "@/components/toolbar/AccountManager";
import Console from "@/utils/Console";
export default {
  name: "DataSourceToggle",
  components: {
    AccountManager
  },
  data() {
    return {
      dialog: false,
      prefetchingResources: false,
      dataSourceId: null
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
    },
    dataSourceModifier: {
      get() {
        if (this.dataSourceId) return this.dataSourceId;
        const source = this.$store.state.dataSource;
        return source === "global" ? 0 : 1;
      },
      set(value) {
        if (value === 0) {
          // global
          this.dataSource = "global";
        } else if (value === 1) {
          this.dataSource = "personal";
        } else {
          Console.error("unknown data source", this.dataSource)
        }
      }
    }
  },
  methods: {
    afterLogin() {
      this.dialog = false;
      this.dataSource = "personal";
    }
  }
};
</script>

<style scoped>
</style>