<template>
  <v-stepper
    v-model="step"
    :alt-labels="!small"
    class="transparent elevation-0 full-width pa-4"
  >
    <v-stepper-header
      class="bkop-light elevation-4"
      style="border-radius: 4px"
    >
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        :step="1"
      >
        <span
          class="text-center"
          style="word-break: keep-all"
        >
          {{ $t('zone.name') }} & {{ $t('stage.name') }}
        </span>
        <small
          v-if="step > 1"
          class="mt-2"
        >
          {{ selectedStage.code || '' }}
        </small>
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step === 2"
        :step="2"
      >
        {{ name }}
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items class="stepper-overflow-initial">
      <v-stepper-content
        :step="1"
        :class="{'pa-0': small}"
      >
        <v-row class="px-1">
          <v-col
            v-for="(categories, index) in categorizedZones"
            :key="index"
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
          >
            <div
              v-for="category in categories"
              :key="category.id"
            >
              <v-subheader>
                <v-icon
                  class="mr-2"
                >
                  {{ category.zones[0].icon }}
                </v-icon>
                <span>
                  {{ $t(['zone.types', category.id].join('.')) }}
                </span>
              </v-subheader>
              <v-expansion-panels
                hover
                class="mb-2"
              >
                <v-expansion-panel
                  v-for="zone in category.zones"
                  :key="zone.zoneId"
                  class="bkop-light stage-card--background"
                  :style="{'background-image': zone.image ? `url(${zone.image}) !important` : null}"
                >
                  <v-expansion-panel-header
                    class="overflow-hidden bkop-medium"
                    :class="{'stage-card--header': !!zone.image}"
                  >
                    <v-row align="center">
                      <span
                        v-if="zone.isActivity && !small"
                        :class="{
                          'text--darken-1 font-weight-bold ml-2 mr-1': true,
                          'red--text': zone.isOutdated,
                          'green--text': !zone.isOutdated }"
                      >
                        {{ zone.isOutdated ? $t('zone.status.closed') : $t('zone.status.open') }}
                      </span>

                      <span
                        :class="{'subtitle-1 pl-2': true, 'text--darken-1 font-weight-bold': zone.isActivity && small, 'red--text': zone.isActivity && small && zone.isOutdated,
                                 'green--text': zone.isActivity && small && !zone.isOutdated}"
                      >
                        {{ strings.translate(zone, "zoneName") }}
                      </span>

                      <!--                        <v-spacer />-->

                      <!--                        <span class="font-weight-bold monospace mr-6">-->
                      <!--                          <v-badge-->
                      <!--                            inline-->
                      <!--                            color="black"-->
                      <!--                            :content="zone.stages.length"-->
                      <!--                          />-->
                      <!--                        </span>-->
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content
                    :class="{'stage-card--content': !!zone.image}"
                  >
                    <div
                      v-if="zone.isActivity"
                      class="caption mb-2 mt-1"
                    >
                      {{ genActivityTime(zone.activityActiveTime) }}
                    </div>
                    <div class="pt-2">
                      <StageCard
                        v-for="stage in getStages(zone.zoneId)"
                        :key="stage.stageId"
                        :stage="stage"

                        @click.native="selectStage(zone.zoneId, stage.stageId, stage.code)"
                      />
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>
        </v-row>
      </v-stepper-content>
      <v-stepper-content
        :step="2"
        class="pa-0 pt-2"
      >
        <span
          v-if="!$vuetify.breakpoint.xs"
          class="stage-id--background font-weight-black display-4 px-12 py-6"
        >
          {{ selectedStage.code || "" }}
        </span>
        <slot />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";
  import StageCard from "@/components/stats/StageCard";
  import Console from "@/utils/Console";
  import {mapGetters} from "vuex";
  import CDN from "@/mixins/CDN";

  export default {
    name: "StageSelector",
    components: {StageCard},
    mixins: [CDN],
    props: {
      name: {
        type: String,
        required: true
      },
      hideClosed: {
        type: Boolean,
        default () {
          return false
        }
      },
      routerNames: {
        type: Object,
        default () {
          return {
            index: "",
            details: ""
          }
        }
      }
    },
    data() {
      return {
        internalStep: 1,
        selected: {
          zone: null,
          stage: null
        },
        stageImages: {
          "act5d0_zone1": this.cdnResource('/backgrounds/zones/act5d0_zone1.jpg'),
          "act6d5_zone1": this.cdnResource('/backgrounds/zones/act6d5_zone1.jpg'),
          "act7d5_zone1": this.cdnResource('/backgrounds/zones/act7d5_zone1.jpg'),
          "act9d0_zone1": this.cdnResource('/backgrounds/zones/act9d0_zone1.jpg'),
          "A001_zone1": this.cdnResource('/backgrounds/zones/A001_zone1.jpg'),
          "A003_zone1": this.cdnResource('/backgrounds/zones/A003_zone1.jpg'),
          "main_0": this.cdnResource('/backgrounds/zones/main_0.jpg'),
          "main_1": this.cdnResource('/backgrounds/zones/main_1.jpg'),
          "main_2": this.cdnResource('/backgrounds/zones/main_2.jpg'),
          "main_3": this.cdnResource('/backgrounds/zones/main_3.jpg'),
          "main_4": this.cdnResource('/backgrounds/zones/main_4.jpg'),
          "main_5": this.cdnResource('/backgrounds/zones/main_5.jpg'),
          "main_6": this.cdnResource('/backgrounds/zones/main_6.jpg'),
          "main_7": this.cdnResource('/backgrounds/zones/main_7.jpg'),
          "main_e0": this.cdnResource('/backgrounds/zones/main_e0.jpg'),
          "gachabox": this.cdnResource('/backgrounds/zones/gachabox.jpg'),
        }
      }
    },
    computed: {
      ...mapGetters("settings", ["lowData"]),
      bindRouter () {
        return this.routerNames.index !== "" && this.routerNames.details !== ""
      },
      step: {
        get () {
          return this.internalStep
        },
        set (val) {
          this.internalStep = val;
          if (val === 1) this.$emit("select", {zone: null, stage: null});

          if (!this.bindRouter) return;
          if (val === 1) {
            this.$router.push({
              name: this.routerNames.index
            });
          } else if (val === 2) {
            this.$router.push({
              name: this.routerNames.details,
              params: {
                zoneId: this.selected.zone,
                stageId: this.selected.stage
              }
            })
          }
        }
      },
      strings () {
        return strings
      },
      small () {
        return this.$vuetify.breakpoint.xsOnly
      },
      categorizedZones() {
        const categoriesSet = [["ACTIVITY_OPEN", "MAINLINE"], ["WEEKLY"]];
        if (!this.hideClosed) categoriesSet[1].push("ACTIVITY_CLOSED");
        const result = [[], []];
        for (const [index, categories] of categoriesSet.entries()) {
          for (const category of categories) {
            let filter;
            let zones = get.zones.byType(category.startsWith("ACTIVITY") ? "ACTIVITY" : category);
            if (category === "ACTIVITY_OPEN") {
              filter = zone => !zone.isOutdated;
            } else if (category === "ACTIVITY_CLOSED") {
              filter = zone => zone.isOutdated;
            }
            if (filter) zones = zones.filter(filter);

            if (this.lowData) {
              zones = zones.map(el => {
                el.image = null
                return el
              })
            } else {
              zones = zones.map(el => {
                if (el.zoneId in this.stageImages) el.image = this.stageImages[el.zoneId]
                return el
              })
            }

            if (zones && zones.length) {
              result[index].push({
                id: category,
                zones: zones
              })
            }
          }
        }
        return result;
      },
      selectedStage() {
        if (!this.selected.stage) return {};
        return get.stages.byStageId(this.selected.stage);
      },
    },
    watch: {
      '$route' () {
        this.checkRoute()
      }
    },
    beforeMount () {
      this.checkRoute()
    },
    methods: {
      getStages (zoneId) {
        return get.stages.byParentZoneId(zoneId);
      },
      selectStage (zone, stage) {
        Console.log("StageSelector", "chose", zone, stage);
        this.selected.zone = zone;
        this.selected.stage = stage;
        this.$emit("select", {zone, stage});
        this.step += 1
      },
      checkRoute () {
        if (!this.bindRouter) return;
        if (this.$route.name === this.routerNames.details) {
          this.internalStep = 2;
          const zone = this.$route.params.zoneId;
          const stage = this.$route.params.stageId;
          this.selected.zone = zone;
          this.selected.stage = stage;
          this.$emit("select", {zone, stage});
        } else if (this.$route.name === this.routerNames.index) {
          this.internalStep = 1;

          this.selected.zone = null;
          this.selected.stage = null;
        }
      },
      genActivityTime (message) {
        return message[0] === message[1] ? this.$t('zone.status.permanentOpen') : this.$t('zone.opensAt', message)
      }
    },
  }
</script>

<style scoped>
  .full-width {
    width: 100%;
  }

.stage-id--background {
  position: absolute;
  bottom: 0;
  right: 0;
  color: rgba(255, 255, 255, .45);
  user-select: none;
  z-index: 0;
  letter-spacing: -.10em !important;
  word-break: break-all;
  overflow: hidden;
  pointer-events: none;
  text-align: right;
}
  .theme--light .stage-id--background {
    color: rgba(0, 0, 0, .075);
  }

  .stage-card--background {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
  }

  .theme--light .stage-card--header {
    background: rgba(255, 255, 255, .9) !important;
    background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.85)) !important;
  }

  .theme--light .stage-card--content {
    background: rgba(255, 255, 255, .7) !important;
    background: linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.3)) !important;
  }

  .theme--dark .stage-card--header {
    background: rgba(30, 30, 30, .9) !important;
    background: linear-gradient(rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.8)) !important;
  }

  .theme--dark .stage-card--content {
    background: rgba(0, 0, 0, .7) !important;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)) !important;
  }
</style>