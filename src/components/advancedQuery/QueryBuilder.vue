<template>
  <v-card class="bkop-light mx-4 pt-4">
    <v-item-group
      v-model="index"
      class="text-center py-2"
      mandatory
    >
      <v-item
        v-for="n in value.length"
        :key="`btn-${n}`"
        v-slot:default="{ active, toggle }"
      >
        <v-btn
          :input-value="active"
          icon
          @click="toggle"
        >
          <v-icon v-if="n === 1">
            mdi-poll-box
          </v-icon>
          <v-icon v-else>
            mdi-numeric-{{ n - 1 }}-box
          </v-icon>
        </v-btn>
      </v-item>
    </v-item-group>

    <v-window
      :value="index"
    >
      <v-window-item
        v-for="(query, index) in value"
        :key="index"
        :value="index"
      >
        <v-card-text class="pt-0">
          <div class="d-flex align-center">
            <h1 class="heading">
              <span v-if="index === 0">
                {{ $t('query.title.main') }}
              </span>
              <span v-else>
                {{ $t('query.title.comparison', {index}) }}
              </span>
            </h1>
            <v-spacer />
            <v-btn
              icon
              color="error"
              :disabled="!removeable"
              @click="removeQuery(index)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </div>
          <div class="flex-column pt-2">
            <QuerySelectorType v-model="query.type" />
            <QuerySelectorStage v-model="query.stage" />
            <QuerySelectorItem v-model="query.item" />

            <v-divider class="my-4" />

            <QuerySelectorTimeRange v-model="query.timeRange" />
            <QuerySelectorServer v-model="query.server" />
            <QuerySelectorSource v-model="query.source" />
            <v-expand-transition v-if="query.type === 'trend'">
              <QuerySelectorInterval v-model="query.interval" />
            </v-expand-transition>
          </div>
        </v-card-text>
      </v-window-item>
    </v-window>

    <div class="pa-4 flex-column">
      <v-btn
        block
        outlined
        class="mb-1"
        :disabled="!addable"
        @click="addQuery"
      >
        <v-icon left>
          mdi-plus-circle
        </v-icon>
        {{ $t('query.operation.add') }}
      </v-btn>
      <v-btn
        block
        large
        :disabled="!valid"
        color="primary"
        :loading="result.busy"
        @click="execute"
      >
        <v-icon left>
          mdi-send
        </v-icon>
        {{ $t('query.operation.execute') }}
      </v-btn>
    </div>
    <v-dialog
      v-model="result.busy"
      persistent
      no-click-animation
      overlay-opacity="0.9"
    >
      <v-card
        class="pa-5 py-10"
      >
        <v-row justify="center">
          <v-col
            cols="12"
            class="text-center"
          >
            <v-progress-circular
              indeterminate
              :size="32"
              :width="4"
              class="my-6"
            />
            <h1 class="overline">
              Executing Query
            </h1>
            <h1 class="title mb-6">
              {{ $t('query.operation.inProgress') }}
            </h1>
            <p class="subtitle-1 mb-4">
              <DoYouKnow />
            </p>
            <v-btn
              outlined
              color="error"
              @click="cancel"
            >
              取消查询
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import config from "@/config"
  import QuerySelectorItem from "@/components/advancedQuery/selectors/QuerySelectorItem";
  import QuerySelectorStage from "@/components/advancedQuery/selectors/QuerySelectorStage";
  import QuerySelectorTimeRange from "@/components/advancedQuery/selectors/QuerySelectorTimeRange";
  import QuerySelectorServer from "@/components/advancedQuery/selectors/QuerySelectorServer";
  import QuerySelectorSource from "@/components/advancedQuery/selectors/QuerySelectorSource";
  import query from "@/apis/query";
  import marshaller from "@/utils/marshaller";
  import QuerySelectorType from "@/components/advancedQuery/selectors/QuerySelectorType";
  import QuerySelectorInterval from "@/components/advancedQuery/selectors/QuerySelectorInterval";

  export default {
    name: "QueryBuilder",
    components: {
      QuerySelectorInterval,
      QuerySelectorType,
      QuerySelectorSource, QuerySelectorItem, QuerySelectorStage, QuerySelectorTimeRange, QuerySelectorServer},
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        index: 0,
        result: {
          busy: false
        }
      }
    },
    computed: {
      current() {
        return this.value[this.index];
      },
      addable() {
        return this.value.length < config.advancedQuery.maxQueries
      },
      removeable () {
        return this.value.length > 1
      },
      valid () {
        for (const query of this.value) {
          if (!query["stage"]) return false
          if (!query["item"].length) return false
          if (!query["timeRange"].length) return false
          if (query["type"] === "trend" && !query["interval"]) return false
        }
        return true
      }
    },
    methods: {
      addQuery() {
        this.$emit('input', [...this.value, Object.assign({}, this.current)])
        this.$nextTick(function () {
          this.index = this.value.length - 1
        })
      },
      removeQuery (i) {
        if (i === this.index) {
          this.index = this.index - 1
        }
        this.value.splice(i, 1)
      },
      execute () {
        this.result.busy = true
        query.advancedQuery(
          marshaller.advancedQuery(this.value)
        )
          .then(({data}) => {
            console.log(data)
            data = data["advanced_results"]
            this.$emit("result", data)
          })
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
            this.result.busy = false
          })
      },
      cancel () {
        this.result.busy = false
      }
    },
  }
</script>

<style scoped>

</style>