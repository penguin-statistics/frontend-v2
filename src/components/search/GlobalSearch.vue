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
      :placeholder="$t('search.placeholder')"
      :hint="$t('search.hint')"
      persistent-hint
      :loading="loading"
      class="search-input-bar transition-background"
      :class="{'search__no-result': !results.length && search}"
      prepend-inner-icon="mdi-magnify"
      autocomplete="off"
      tabindex="1"
    >
      <template #append>
        <v-btn
          v-if="search"
          icon
          tabindex="100"

          @click="search = ''"
        >
          <v-icon>
            {{ $vuetify.icons.values.clear }}
          </v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <v-slide-y-transition>
      <recycle-scroller
        v-show="valid"
        :items="results"
        :item-size="103"
        class="search-results"
        :class="{'search-results--dense': pure}"
      >
        <template #default="{item, active}">
          <SearchResultNormal
            :key="item.id"
            :tabindex="active ? 2 : -1"
            :result="item"
          />
        </template>
      </recycle-scroller>
      <!--      <v-data-iterator-->
      <!--        v-show="search"-->
      <!--        :items="results"-->
      <!--        class="mx-2 search-results"-->
      <!--        :page="page"-->
      <!--      >-->
      <!--        <template #header="{ pagination }">-->
      <!--          <div class="d-flex flex-row justify-space-around align-center">-->
      <!--            <v-btn-->
      <!--              large-->
      <!--              :disabled="page <= 1"-->
      <!--              tabindex="101"-->
      <!--              @click="page -= 1"-->
      <!--            >-->
      <!--              <v-icon>-->
      <!--                mdi-chevron-left-->
      <!--              </v-icon>-->
      <!--              上一页-->
      <!--            </v-btn>-->

      <!--            <span>-->
      <!--              页 {{ pagination.page }} / 共 {{ pagination.pageCount }} 页, {{ pagination.itemsLength }} 条目-->
      <!--            </span>-->

      <!--            <v-btn-->
      <!--              large-->
      <!--              :disabled="page >= pagination.pageCount"-->
      <!--              tabindex="102"-->
      <!--              @click="page += 1"-->
      <!--            >-->
      <!--              下一页-->
      <!--              <v-icon>-->
      <!--                mdi-chevron-right-->
      <!--              </v-icon>-->
      <!--            </v-btn>-->
      <!--          </div>-->
      <!--        </template>-->

      <!--        <template #default="{ items }">-->
      <!--          <v-row>-->
      <!--            <v-col-->
      <!--              v-for="item in items"-->
      <!--              :key="item.id"-->
      <!--              cols="12"-->
      <!--              sm="12"-->
      <!--              md="12"-->
      <!--              lg="12"-->
      <!--              xl="12"-->
      <!--            >-->
      <!--              <SearchResult-->
      <!--                tabindex="1"-->
      <!--                :result="item"-->
      <!--              />-->
      <!--            </v-col>-->
      <!--          </v-row>-->
      <!--        </template>-->
      <!--      </v-data-iterator>-->
    </v-slide-y-transition>
    <!--    <h1 class="d-block mt-12 overline text-center grey&#45;&#45;text">-->
    <!--      {{ $t('search.footer') }}-->
    <!--    </h1>-->
  </div>
</template>

<script>
import CompactedSearchEngine from "@/utils/searchEngine";
import Console from "@/utils/Console";
import CDN from "@/mixins/CDN";
import SearchResultNormal from "@/components/search/SearchResultNormal";
export default {
  name: "GlobalSearch",
  components: {SearchResultNormal},
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
      page: 1,
      engineLoading: true
    }
  },

  computed: {
    results() {
      return this.engine.search(this.search)
      .map(el => ({
        ...el,
        id: `${el.type}_${el.stageId || el.itemId}`,
      }))
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
      ].some(el => !!el)
    },
    valid () {
      return this.search && this.results.length
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
    search(newValue) {
      this.$emit('update:query', newValue)
    },
    valid(newValue) {
      this.$emit('update:valid', newValue)
    }
  },
  created() {
    this.engine = new CompactedSearchEngine()
    console.log(this.engine)

    const self = this
    this.engine.ready().then(() => {
      self.search = self.query
      self.search = self.search + ' '
      self.search = self.search.slice(0, -1)

      self.engineLoading = false
    })
  },
  methods: {
    reset() {
      Console.info("SearchEngine", "search engine has been reinitialized due to change detected in dependency")
      this.search = ""
      this.engine = new CompactedSearchEngine()
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

  max-height: 70vh;
  padding: .5rem 6px;
  margin: .5rem -8px;
  box-shadow: inset 0 16px 16px -16px rgba(0, 0, 0, .2);

  .theme--light & {
    border: dashed rgba(18, 18, 18, .4);
    border-width: 0 1px;
  }

  .theme--dark & {
    border: dashed rgba(255, 255, 255, .4);
    border-width: 0 1px;
  }

  &--dense {
    max-height: 60vh !important;
  }
}
</style>