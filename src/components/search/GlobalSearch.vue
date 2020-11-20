<template>
  <div
    class="transition-all"
    :class="{'search__no-input': !search && !pure}"
    style="width: 100%"
  >
    <v-img
      v-if="!pure"
      :src="cdnDeliver('/logos/penguin_stats_logo.png')"
      aspect-ratio="1"
      height="64px"
      contain
      class="mb-9"
    />
    <v-text-field
      v-model="search"
      solo
      full-width
      autofocus
      rounded
      clearable
      :placeholder="$t('search.placeholder')"
      :hint="$t('search.hint')"
      persistent-hint
      :loading="loading"
      class="search-input-bar transition-all"
      :class="{'search__no-result': !results.length && search}"
      prepend-inner-icon="mdi-magnify"
    />
    <v-slide-y-transition>
      <v-data-iterator
        v-show="search"
        :items="results"
        :loading="loading"
        class="mx-2 search-results"
        :page="page"
      >
        <template #header="{ pagination }">
          <div class="d-flex flex-row justify-space-around align-center">
            <v-btn
              large
              :disabled="page <= 1"
              @click="page -= 1"
            >
              <v-icon>
                mdi-chevron-left
              </v-icon>
              上一页
            </v-btn>

            <span>
              页 {{ pagination.page }} / 共 {{ pagination.pageCount }} 页, {{ pagination.itemsLength }} 条目
            </span>

            <v-btn
              large
              :disabled="page >= pagination.pageCount"
              @click="page += 1"
            >
              下一页
              <v-icon>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
        </template>

        <template #default="{ items }">
          <v-row>
            <v-col
              v-for="item in items"
              :key="item.id"
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
            >
              <SearchResult
                :result="item"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-slide-y-transition>
    <!--    <h1 class="d-block mt-12 overline text-center grey&#45;&#45;text">-->
    <!--      {{ $t('search.footer') }}-->
    <!--    </h1>-->
  </div>
</template>

<script>
import SearchEngine from "@/utils/searchEngine";
import Console from "@/utils/Console";
import CDN from "@/mixins/CDN";
export default {
  name: "GlobalSearch",
  mixins: [CDN],
  props: {
    query: {
      type: String,
      default: () => ""
    },
    pure: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      engine: null,
      search: "",
      page: 1
    }
  },

  computed: {
    results() {
      return this.engine.query(this.search)
    },
    dependencies() {
      return {
        locale: this.$i18n.locale,
        stages: this.$store.getters["data/content"]({id: "stages"}),
        items: this.$store.getters["data/content"]({id: "items"}),
      }
    },
    loading() {
      return [
        this.$store.getters["ajax/pendingByKey"]("stages"),
        this.$store.getters["ajax/pendingByKey"]("items"),
      ].some(el => el)
    }
  },
  watch: {
    "dependencies.locale"() {
      this.reset()
    },
    "dependencies.stages"(val) {
      this.engine.update("stages", val)
    },
    "dependencies.items"(val) {
      this.engine.update("items", val)
    },
    search(val) {
      const url = new URL(window.location.href)
      url.searchParams.delete("q")
      if (val) url.searchParams.set("q", val)
      window.history.replaceState(null, '', url.pathname + url.search)
    }
  },
  created() {
    this.engine = new SearchEngine()
    this.search = this.query
  },
  methods: {
    reset() {
      Console.info("SearchEngine", "search engine has been reinitialized due to change detected in dependency")
      this.search = ""
      this.engine = new SearchEngine()
    }
  },
}
</script>

<style scoped lang="scss">
.search__no-input {
  margin-top: 20vh
}

.search-input-bar {
  ::v-deep.v-input__slot {
    transition: all .225s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
    box-shadow: 0 0 5px rgba(0, 0, 0, .4), 0 0 0 1px rgba(255, 255, 255, .9) !important;
  }

  ::v-deep.v-messages__wrapper {
    text-align: center;
    letter-spacing: 0.05rem !important;
    margin-top: 4px;
  }

  &.v-input--is-focused ::v-deep.v-input__slot {
    box-shadow: 0 0 1px 3px rgba(255, 255, 255, .6), 0 0 0 1px rgba(255, 255, 255, .9) !important
  }
  &.search__no-result ::v-deep.v-input__slot {
    background: rgba(255, 82, 82, .4) !important
  }


  &.theme--light {
    &.search-input-bar ::v-deep.v-input__slot {
      box-shadow: 0 0 5px rgba(0, 0, 0, .4) !important
    }
    &.search-input-bar.v-input--is-focused ::v-deep.v-input__slot {
      box-shadow: 0 0 0 3px rgba(0, 0, 0, .4) !important
    }
  }
}

.search-results {
  ::v-deep .v-data-footer {
    display: none;
  }
}
</style>