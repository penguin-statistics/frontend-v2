<template>
  <v-row
    class="fill-height"
    :align="result ? 'start' : 'center'"
    justify="center"
    no-gutters
  >
    <v-col
      cols="12"
      :sm="result ? 6 : 9"
      :md="result ? 5 : 8"
      :lg="result ? 4 : 6"
      :xl="result ? 3 : 6"
    >
      <OffTitle :content="$t('query.panel.builder')" />
      <QueryBuilder
        v-model="queries"
        @update="saveCache('queries', queries)"
        @result="updateResult"
      />
      <div
        v-if="restored"
        class="d-flex justify-center overline my-2 mx-4"
      >
        {{ $t('query.panel.footer.cache') }}
      </div>
      <v-divider
        v-if="restored"
        class="mx-4 my-2"
      />

      <div class="d-flex align-center justify-center text-center overline mt-2 mx-4">
        {{ $t('query.panel.footer.disclaimer') }}
      </div>
    </v-col>
    <v-col
      v-if="result"
      cols="12"
      sm="6"
      md="7"
      lg="8"
      xl="9"
      class="justify-start"
    >
      <OffTitle :content="$t('query.panel.results')" />
      <QueryResults :results="result" />
    </v-col>
    <!--    <v-col cols="12">-->
    <!--      <code>Queries: {{ queries }}</code>-->
    <!--      <code class="ml-1">Marshalled: {{ marshalled }}</code>-->
    <!--    </v-col>-->
  </v-row>
</template>

<script>
import QueryResults from '@/components/advancedQuery/QueryResults'
import QueryBuilder from '@/components/advancedQuery/QueryBuilder'
import OffTitle from '@/components/global/OffTitle'

const cacheKey = 'AdvancedQuery'

export default {
  name: 'QueryMain',
  components: { OffTitle, QueryBuilder, QueryResults },
  props: {
    preset: {
      type: Object,
      default: function () {
        return null
      }
    },
    cache: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      queries: [
        {
          type: 'matrix',
          stage: null,
          item: [],
          timeRange: [],
          server: this.$store.getters['dataSource/server'],
          source: 'global',
          interval: null
        }
      ],
      result: null,
      restored: null
    }
  },
  watch: {
    queries (val) { this.saveCache('queries', val) },
    result (val) { this.saveCache('result', val) }
  },
  created () {
    if (this.cache && this.$store.getters['cache/have'](cacheKey)) {
      const content = this.$store.getters['cache/content'](cacheKey)
      for (const [key, value] of Object.entries(content)) {
        this.$set(this, key, value)
      }
      this.restored = Object.assign({}, content)
    }

    // rehydrate preset settings
    if (this.preset) {
      if (this.preset.stage) this.queries[0].stage = this.preset.stage
      if (this.preset.item) this.queries[0].item = this.preset.item
    }
  },
  methods: {
    updateResult (data) {
      const results = []
      for (const [index, result] of Object.entries(data)) {
        results.push({
          type: this.queries[index].type,
          query: this.queries[index],
          result
        })
      }
      this.result = results
    },
    saveCache (key, data) {
      if (!this.cache) return
      const current = this.$store.getters['cache/content'](cacheKey)
      let saving
      if (current) {
        saving = Object.assign(current, { [key]: data })
      } else {
        saving = Object.assign({}, { [key]: data })
      }
      if (saving === this.restored) return
      this.$store.commit('cache/set', {
        key: cacheKey,
        value: saving
      })
    }
  }
}
</script>

<style>

</style>
