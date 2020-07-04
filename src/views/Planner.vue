<template>
  <v-container
    fluid
    class="fill-height align-content-center justify-center"
  >
    <v-dialog
      v-model="calculation.done"
      scrollable
      max-width="calc(max(450px, 80vw))"
    >
      <PlannerResult
        v-if="calculation.done"
        :result="calculation.data"
        @close="calculation.done = false"
      />
    </v-dialog>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="5"
        md="4"
        lg="3"
        xl="3"
        class="px-0"
      >
        <v-row
          no-gutters
          class="my-3 mx-6 flex-column"
          align="start"
        >
          <span class="title">
            {{ $t('planner.options._name') }}
          </span>
          <v-switch
            v-model="options.byProduct"
            :label="$t('planner.options.byProduct')"
            hide-details
          />
          <v-switch
            v-model="options.requireExp"
            :label="$t('planner.options.requireExp')"
            hide-details
          />
          <v-switch
            v-model="options.requireLmb"
            :label="$t('planner.options.requireLmb')"
            hide-details
          />
          <v-dialog
            v-model="excludeDialog"
            max-width="700px"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="mt-4"
                v-on="on"
              >
                <v-icon left>
                  mdi-cube
                </v-icon>
                {{ $t('planner.options.excludeStage') }}{{ excludes.length ? ` (${excludes.length})` : "" }}
              </v-btn>
            </template>
            <MultiStageSelector
              v-model="excludes"
              @close="excludeDialog = false"
            />
          </v-dialog>
          <v-btn
            class="mt-2"
            @click="reset"
          >
            <v-icon left>
              mdi-delete
            </v-icon>
            {{ $t('planner.options.reset') }}
          </v-btn>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="7"
        md="8"
        lg="9"
        xl="9"
        class="pt-0 pb-2 px-0"
      >
        <v-row
          no-gutters
          class="my-3 mx-6"
          align="center"
          justify="space-around"
        >
          <v-dialog
            v-model="ioDialog"
            width="800"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="green white--text"
                class="my-1"
                large
                v-on="on"
              >
                <v-icon left>
                  mdi-file-restore
                </v-icon>
                {{ $t('planner.actions.importExport') }}
              </v-btn>
            </template>
            <PlannerIO
              :config="{items, options, excludes}"
              @close="ioDialog = false"
              @reset="reset"
            />
          </v-dialog>
          <v-btn
            color="red white--text"
            class="my-1"
            :loading="calculation.pending"
            large
            @click="calculate"
          >
            <v-icon left>
              mdi-calculator
            </v-icon>
            {{ $t('planner.actions.calculate') }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      class="pt-2"
      dense
    >
      <v-col
        v-for="itemData in items"
        :key="itemData.id"
        xl="1"
        md="2"
        sm="3"
        class="col-xs-1-2 col-md-1-10 col-lg-1-8"
        cols="4"
      >
        <PlannerItemStepper
          :item-id="itemData.id"
          :have.sync="itemData.have"
          :need.sync="itemData.need"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import get from "@/utils/getters";
  import {mapGetters, mapState} from "vuex";
  import PlannerIO from "@/components/planner/PlannerIO";
  import PlannerItemStepper from "@/components/planner/PlannerItemStepper";
  import PlannerResult from "@/components/planner/PlannerResult";
  import Console from "@/utils/Console";
  import MultiStageSelector from "@/components/stats/MultiStageSelector";
  import planner from "@/apis/planner";
  import marshaller from "@/utils/marshaller";
  import snackbar from "@/utils/snackbar";
  import strings from "@/utils/strings";

  export default {
    name: "Planner",
    components: {MultiStageSelector, PlannerResult, PlannerItemStepper, PlannerIO},
    data() {
      return {
        calculation: {
          pending: false,
          done: false,
          data: {},
        },
        ioDialog: false,
        excludeDialog: false
        // options: {
        //   byProduct: false,
        //   requireExp: false,
        //   requireLmb: false,
        //   calculateStore: false
        // },
      }
    },
    computed: {
      ...mapState("planner", [
        "items",
        "options",
      ]),
      ...mapGetters("dataSource", ["server"]),
      excludes: {
        get () {
          return this.$store.getters["planner/config"].excludes
        },
        set (v) {
          this.$store.commit("planner/changeExcludes", v)
        }
      }
    },
    watch: {
      items: {
        handler (value) {
          this.$store.commit("planner/changeItems", value)
        },
        deep: true
      },
      options: {
        handler (value) {
          this.$store.commit("planner/changeOptions", value)
        },
        deep: true
      },
      excludes: {
        handler (value) {
          this.$store.commit("planner/changeExcludes", value)
        },
        deep: true
      },
      server () {
        this.updateItemStructure(this.getInitialItems(), this.items)
      }
    },

    created() {
      if (this.items.length === 0) {
        this.$store.commit("planner/changeItems", this.getInitialItems())
      }
      if (this.items.length !== this.getInitialItems().length) {
        this.updateItemStructure(this.getInitialItems(), this.items)
      }
    },

    methods: {
      getInitialItems () {
        return get.items.all(false)
          .filter(item => item.itemType === "MATERIAL" && item.itemId.length === 5 || item.itemType === "ARKPLANNER")
          .map(item => ({
            id: item.itemId,
            need: 0,
            have: 0,
          }))
      },
      updateItemStructure (target, source) {
        const results = [];
        const processedItemIds = [];
        for (const item of source) {
          if (target.find(el => el.id === item.id)) {
            // target have this item
            results.push(item)
            processedItemIds.push(item.id)
          }
        }
        for (const item of target) {
          if (!processedItemIds.find(el => el === item.id)) {
            // source does NOT have this item
            results.push(item)
          }
        }

        this.$store.commit("planner/changeItems", results)
      },
      reset () {
        this.$store.commit("planner/changeItems", this.getInitialItems())
      },
      calculate() {
        Console.info("Planner", "planning with config", {
          items: this.items,
          options: this.options,
          excludes: this.excludes
        })
        this.calculation.pending = true;

        planner.plan(
          marshaller.planner.plan(this)
        )
          .then(({data}) => {
            if (data.error === true) {
              return snackbar.launch("error", 15000, "planner.calculationError", {
                error: data.reason
              })
            }

            data.stages = data.stages.map(el => {
              el.materials = [];
              el.stage = get.stages.byStageId(el.stage)
              el.stage.code = strings.translate(el.stage, "code")
              for (const [id, value] of Object.entries(el.items)) {
                const item = get.items.byItemId(id);
                el.materials.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            data.syntheses = data.syntheses.map(el => {
              el.target = {
                item: get.items.byItemId(el.target)
              };
              el.target.name = strings.translate(el.target.item, "name");
              el.items = [];
              for (const [id, value] of Object.entries(el.materials)) {
                const item = get.items.byItemId(id);
                el.items.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            data.values = data.values.map(el => {
              el.materials = [];
              for (const {name, value} of el.items) {
                if (parseFloat(value) === 0) continue;
                const item = get.items.byItemId(name);
                el.materials.push({
                  name: strings.translate(item, "name"),
                  item,
                  value
                })
              }
              return el
            });
            Console.debug("Planner", "received plan", data)
            this.$set(this.calculation, "data", data);
            this.calculation.done = true
          })
          .catch((err) => {
            Console.error("Planner", "failed to refresh plan", err)
            snackbar.networkError()
          })
          .finally(() => {
            this.calculation.pending = false;
          })
      }
    }
  }
</script>

<style scoped>
  .planner-import-export, ::v-deep .planner-import-export textarea {
    word-break: break-all;
    line-height: 1.2 !important;
    font-size: 12px;
  }

  ::v-deep .planner-import-export textarea {
    padding: 8px 0;
  }

  .card-item {
    border: 2px solid #4350b0;
    height: 100%
  }
</style>