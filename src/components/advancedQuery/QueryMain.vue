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
      <div class="d-flex align-center justify-center overline my-2 mx-4">
        现在显示的查询结果数据为缓存数据，缓存于 2020-05-20 01:48:03 (1分钟前)。若需要获取最新数据，请再次「执行查询」。
      </div>
      <v-divider class="mx-4 my-2" />
      <div class="d-flex align-center justify-center overline mt-2 mx-4">
        「高级查询」意在为有更复杂数据分析需求的用户提供更高自由度使用企鹅物流数据统计的可能性。由于本功能所带来的高自由度，在不了解相关统计学学术内容前尝试分析此功能所得出的统计结果可能会存在误导性。企鹅物流数据统计提醒各位二次数据分析的刀客塔：请在分析数据时不要断章取义、故意使用本站数据引导舆论。高级查询功能的受众群体是熟悉统计学等学科的用户，开放后便于他们以更多维度分析数据集。我们欢迎对掉落数据感兴趣并进行客观与科学分析的刀客塔，但我们不欢迎带有个人情绪或既定立场的情况下、尝试错误地从本站数据中得出对任何实体不利结论的用户。
      </div>
      <div class="d-flex align-center justify-center overline mt-2 mx-4">
        「高级查询」功能所产出的所有数据信息均受本站「数据许可协议」保护。转载、公开或以任何形式复制、发行、再传播本站任何内容时，必须注明从企鹅物流数据统计转载，并提供版权标识、许可协议标识、免责标识和作品链接；且未经许可，不得将本站内容或由其衍生作品用于商业目的。
      </div>
      <div class="d-flex align-center justify-center overline mt-2 mx-4">
        本站不对「高级查询」功能所产出的所有数据信息做任何形式的承诺或背书。使用此服务即代表您接受本站的「最终用户许可协议」和「隐私协议」。
      </div>
      <div class="d-flex align-center justify-center text-center overline mt-4 mx-4">
        企鹅物流数据统计 2020
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
  import QueryResults from "@/components/advancedQuery/QueryResults";
  import QueryBuilder from "@/components/advancedQuery/QueryBuilder";
  import OffTitle from "@/components/global/OffTitle";

  const cacheKey = "AdvancedQuery"
  let restored = null;

  export default {
    name: "QueryMain",
    components: {OffTitle, QueryBuilder, QueryResults},
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
    data() {
      return {
        queries: [
          {
            type: "matrix",
            stage: null,
            item: [],
            timeRange: [],
            server: this.$store.getters["dataSource/server"],
            source: "global",
            interval: null,
          }
        ],
        result: null
      }
    },
    watch: {
      queries (val) { this.saveCache("queries", val) },
      result (val) { this.saveCache("result", val) },
    },
    created () {
      if (this.cache && this.$store.getters["cache/have"](cacheKey)) {
        const content = this.$store.getters["cache/content"](cacheKey)
        for (const [key, value] of Object.entries(content)) {
          this.$set(this, key, value)
        }
        restored = Object.assign({}, content)
      }

      // rehydrate preset settings
      if (this.preset) {
        if (this.preset.stage) this.queries[0].stage = this.preset.stage
        if (this.preset.item) this.queries[0].item = this.preset.item
      }
    },
    methods: {
      updateResult(data) {
        const results = []
        for (const [index, result] of Object.entries(data)) {
          results.push({
            type: this.queries[index]["type"],
            query: this.queries[index],
            result
          })
        }
        this.result = results
      },
      saveCache (key, data) {
        if (!this.cache) return
        const current = this.$store.getters["cache/content"](cacheKey)
        let saving;
        if (current) {
          saving = Object.assign(current, {[key]: data})
        } else {
          saving = Object.assign({}, {[key]: data})
        }
        console.log("saving", key, saving, saving === restored, restored, "curr", current)
        if (saving === restored) return
        this.$store.commit("cache/set", {
          key: cacheKey,
          value: saving
        })
      }
    },
  }
</script>

<style>
  html {
    overscroll-behavior-x: none;
  }
</style>