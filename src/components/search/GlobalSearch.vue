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
      v-bind="computedBinding"
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
          v-haptic
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
        <template #default="{item, index, active}">
          <SearchResultNormal
            :key="item.id"
            :query="debouncedSearch"
            :tabindex="active ? 2 : -1"
            :result="item"
            :index="index"
          />
        </template>
      </recycle-scroller>
    </v-slide-y-transition>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
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
    },
    autofocus: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      engine: null,
      debouncedSearch: "",
      engineLoading: true
    }
  },

  computed: {
    search: {
      get() {
        return this.debouncedSearch;
      },
      set: debounce(function(newValue) {
        this.debouncedSearch = newValue;
      }, 30)
    },
    results() {
      if (this.debouncedSearch === '') return []
      const results = this.engine.search(this.debouncedSearch)
        .map(el => ({
          ...el,
          ...el.item,
          id: `${el.type}_${el.item.stageId || el.item.itemId}`,
        }))
      Console.debug('Search', 'query', this.debouncedSearch, 'got result', results)
      return results
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
        this.$store.getters["ajax/pendingByKey"]("zones"),
        this.$store.getters["ajax/pendingByKey"]("stages"),
        this.$store.getters["ajax/pendingByKey"]("items"),
      ].some(el => !!el)
    },
    valid () {
      return this.debouncedSearch && this.results.length
    },
    computedBinding () {
      const binding = {}
      if (this.autofocus) binding['autofocus'] = 'autofocus'
      return binding
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
    // console.log(this.engine)

    const self = this
    this.engine.ready().then(() => {
      self.debouncedSearch = self.query
      self.debouncedSearch = self.debouncedSearch + ' '
      self.debouncedSearch = self.debouncedSearch.slice(0, -1)

      self.engineLoading = false
    })
  },
  methods: {
    reset() {
      Console.info("SearchEngine", "search engine has been reinitialized due to change detected in dependency")
      this.debouncedSearch = ""
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