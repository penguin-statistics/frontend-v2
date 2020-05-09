<template>
  <v-row>
    <v-col
      cols="12"
      class="flex-column"
    >
      <v-card class="bkop-light">
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
            v-for="(query, i) in value"
            :key="i"
            :value="i"
          >
            <v-card-text class="pt-0">
              <div class="d-flex align-center">
                <h1 class="headline">
                  <span v-if="i === 0">
                    主查询
                  </span>
                  <span v-else>
                    对比查询 #{{ i }}
                  </span>
                </h1>
                <v-spacer />
                <v-btn
                  icon
                  color="error"
                  :disabled="!removeable"
                  @click="removeQuery(i)"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </div>
              <div class="flex-column pt-2">
                <QuerySelectorItem
                  v-model="query.item"
                  :disabled="!!query.stage"
                />
                <QuerySelectorStage
                  v-model="query.stage"
                  :disabled="!!query.item"
                />

                <v-divider class="my-4" />

                <QuerySelectorTimeRange v-model="query.timeRange" />
                <!--                <QuerySelectorServer v-model="query.server" />-->
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
            添加对比查询
          </v-btn>
          <v-btn
            block
            large
            color="primary"
          >
            <v-icon left>
              mdi-send
            </v-icon>
            执行查询
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from "@/config"
  import QuerySelectorItem from "@/components/advancedQuery/selectors/QuerySelectorItem";
  import QuerySelectorStage from "@/components/advancedQuery/selectors/QuerySelectorStage";
  import QuerySelectorTimeRange from "@/components/advancedQuery/selectors/QuerySelectorTimeRange";
  import QuerySelectorServer from "@/components/advancedQuery/selectors/QuerySelectorServer";

  export default {
    name: "QueryBuilder",
    components: {QuerySelectorItem, QuerySelectorStage, QuerySelectorTimeRange, QuerySelectorServer},
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        index: 0
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
      }
    },
  }
</script>

<style scoped>

</style>