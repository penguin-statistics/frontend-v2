<template>
  <v-stepper
    v-model="step"
    alt-labels
    class="transparent elevation-0 full-width pa-md-4 pa-lg-4 pa-xl-4"
  >
    <v-stepper-header
      class="bkop-light elevation-4 py-4 px-5 d-flex flex-row position-relative align-center"
      style="border-radius: 4px"
    >
      <v-fade-transition>
        <v-img
          v-if="currentStageImage"
          key="exact"
          :src="currentStageImage"
          class="stepper-header--background"
          gradient="160deg, rgba(0, 0, 0, .95), rgba(0, 0, 0, .4)"

          style="filter: brightness(0.8)"
        />

        <v-img
          v-else
          key="default"
          :src="stageImages._default"
          class="stepper-header--background stepper-header--background__animated"
          position=""
        >
          <v-overlay
            absolute
            style="background: linear-gradient(to right, rgba(0, 0, 0, .95), rgba(0, 0, 0, 0))"
          />
        </v-img>
      </v-fade-transition>

      <BackButton
        name="关卡选择"
        :active="step > 1"

        @back="step = 1"
      />

      <v-spacer />

      <v-slide-x-transition>
        <div
          v-if="step === 2"
          class="d-flex flex-row"
        >
          <v-slide-x-transition hide-on-leave>
            <StageCard
              v-if="relativeStages.prev"
              key="left"

              left
              :dense="$vuetify.breakpoint.xsOnly"
              :stage="relativeStages.prev"
              @click.native="selectStage(relativeStages.prev.zoneId, relativeStages.prev.stageId, false)"
            />
          </v-slide-x-transition>

          <v-slide-x-reverse-transition hide-on-leave>
            <StageCard
              v-if="relativeStages.next"
              key="right"

              right
              :dense="$vuetify.breakpoint.xsOnly"
              :stage="relativeStages.next"
              @click.native="selectStage(relativeStages.next.zoneId, relativeStages.next.stageId, false)"
            />
          </v-slide-x-reverse-transition>
        </div>
      </v-slide-x-transition>

      <!--      <v-expand-transition>-->
      <!--        <div-->
      <!--          v-if="step === 2"-->
      <!--          class="d-flex flex-column align-start justify-center"-->
      <!--        >-->
      <!--          <h2 class="title">-->
      <!--            {{ name }}-->
      <!--          </h2>-->

      <!--          <span class="subtitle-1">-->
      <!--            {{ strings.translate(selectedStage, "code") }}-->
      <!--          </span>-->
      <!--        </div>-->
      <!--      </v-expand-transition>-->
    </v-stepper-header>
    <v-stepper-items>
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
              <!--              <OffTitle-->
              <!--                :content="$t(['zone.types', category.id].join('.'))"-->
              <!--                small-->
              <!--                class="pl-2"-->
              <!--              />-->
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
                        v-if="zone.isActivity && !small && zone.timeValid !== undefined"
                        :class="{
                          'red--text': zone.timeValid === 1,
                          'green--text': zone.timeValid === 0,
                          'grey--text': zone.timeValid === -1
                        }"
                        class="text--darken-1 font-weight-bold ml-2 mr-1"
                      >
                        {{ $t('zone.status.' + zone.timeValid) }}
                      </span>
                      <span
                        v-if="zone.isPermanentOpen"
                        class="text--darken-1 font-weight-bold orange--text ml-2 mr-1"
                      >
                        {{ $t('zone.status.permanentOpen') }}
                      </span>

                      <span
                        class="subtitle-1 pl-2"
                        :class="{'text--darken-1 font-weight-bold': zone.isActivity && small,
                                 'red--text': zone.isActivity && small && zone.timeValid === 1,
                                 'green--text': zone.isActivity && small && zone.timeValid === 0,
                                 'grey--text': zone.isActivity && small && zone.timeValid === -1
                        }"
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
                      class="caption mx-1 mt-3 mb-2"
                    >
                      {{ genActivityTime(zone) }}
                    </div>
                    <div class="pt-2">
                      <StageCard
                        v-for="stage in zone.stages"
                        :key="stage.stageId"
                        :stage="stage"

                        @click.native="selectStage(zone.zoneId, stage.stageId)"
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
          {{ strings.translate(selectedStage, "code") }}
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
  import existUtils from "@/utils/existUtils";
  import validator from "@/utils/validator";
  import BackButton from "@/components/stats/BackButton";

  export default {
    name: "StageSelector",
    components: {BackButton, StageCard},
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
          "act5d0_zone1": this.cdnDeliver('/backgrounds/zones/act5d0_zone1.jpg'),
          "act6d5_zone1": this.cdnDeliver('/backgrounds/zones/act6d5_zone1.jpg'),
          "act7d5_zone1": this.cdnDeliver('/backgrounds/zones/act7d5_zone1.jpg'),
          "act9d0_zone1": this.cdnDeliver('/backgrounds/zones/act9d0_zone1.jpg'),
          "act10d5_zone1": this.cdnDeliver('/backgrounds/zones/act10d5_zone1.jpg'),
          "act11d0_zone1": this.cdnDeliver('/backgrounds/zones/act11d0_zone1.jpg'),
          "1stact_zone1": this.cdnDeliver('/backgrounds/zones/A001_zone1.jpg'),
          "act3d0_zone1": this.cdnDeliver('/backgrounds/zones/A003_zone1.jpg'),
          "act4d0_zone1": this.cdnDeliver('/backgrounds/zones/main_e0.jpg'),
          "main_0": this.cdnDeliver('/backgrounds/zones/main_0.jpg'),
          "main_1": this.cdnDeliver('/backgrounds/zones/main_1.jpg'),
          "main_2": this.cdnDeliver('/backgrounds/zones/main_2.jpg'),
          "main_3": this.cdnDeliver('/backgrounds/zones/main_3.jpg'),
          "main_4": this.cdnDeliver('/backgrounds/zones/main_4.jpg'),
          "main_5": this.cdnDeliver('/backgrounds/zones/main_5.jpg'),
          "main_6": this.cdnDeliver('/backgrounds/zones/main_6.jpg'),
          "main_7": this.cdnDeliver('/backgrounds/zones/main_7.jpg'),
          "gachabox": this.cdnDeliver('/backgrounds/zones/gachabox.jpg'),
          "act12d0_zone1": this.cdnDeliver('/backgrounds/zones/act12d0_zone1.jpg'),
          "act13d0_zone1": this.cdnDeliver('/backgrounds/zones/act13d0_zone1.jpg'),
          "act13d5_zone1": this.cdnDeliver('/backgrounds/zones/act13d5_zone1.jpg'),
          // "act13d5_zone1": require("@/assets/zonePageBackgrounds/png/act13d5_zone1.png"),

          // 骑兵与猎人 复刻：复用原活动（1stact_zone1）
          "act13d2_zone1": this.cdnDeliver('/backgrounds/zones/A001_zone1.jpg'),

          // 选择页面背景
          "_default": this.cdnDeliver('/backgrounds/zones/default.jpg'),
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
        return this.$vuetify.breakpoint.smAndDown
      },
      categorizedZones() {
        const categoriesSet =
          this.hideClosed ?
            // Report
            [
              [["ACTIVITY_OPEN", "MAINLINE"], ["ACTIVITY_PERMANENT", "WEEKLY"]], // md, lg & xl
              [["ACTIVITY_OPEN", "MAINLINE"], ["ACTIVITY_PERMANENT", "WEEKLY"]]  // xs & sm
            ]
              :
            // Show Statistics
            [
              [["ACTIVITY_OPEN", "MAINLINE", "WEEKLY"], ["ACTIVITY_PERMANENT", "ACTIVITY_PENDING", "ACTIVITY_CLOSED"]], // md, lg & xl
              [["ACTIVITY_PENDING", "ACTIVITY_OPEN", "MAINLINE"], ["ACTIVITY_PERMANENT", "WEEKLY", "ACTIVITY_CLOSED"]]  // xs & sm
            ]

        const result = [[], []];
        for (const [index, categories] of categoriesSet[this.small ? 1 : 0].entries()) {
          for (const category of categories) {
            let filter;
            let zones = get.zones.byType(category.startsWith("ACTIVITY") ? "ACTIVITY" : category, false);
            zones = zones.filter(el => existUtils.existence(el, false))

            if (category === "ACTIVITY_OPEN") {
              filter = zone => zone.timeValid === 0;
            } else if (category === "ACTIVITY_CLOSED") {
              filter = zone => zone.timeValid === 1;
            } else if (category === "ACTIVITY_PENDING") {
              filter = zone => zone.timeValid === -1;
            } else if (category === "ACTIVITY_PERMANENT") {
              filter = zone => zone.isPermanentOpen;
            }

            if (filter) zones = zones.filter(filter);

            zones = zones
              .map(zone => {
                let stages = get.stages.byParentZoneId(zone.zoneId)
                if (this.hideClosed) {
                  stages = stages.filter(stage => !!stage["dropInfos"])
                }
                stages = stages.filter(el => existUtils.existence(el))

                return {
                  ...zone,
                  stages
                }
              })
              // filter out empty zones
              .filter(el => el.stages.length)

            // sort activity zones by its openTime
            if (category.startsWith("ACTIVITY")) {
              const server = this.$store.getters["dataSource/server"]
              zones = zones.slice()
                .sort((a, b) => a["existence"][server]["openTime"] - b["existence"][server]["openTime"])
            }

            if (this.lowData) {
              zones = zones.map(el => {
                return {
                  ...el,
                  image: null
                }
              })
            } else {
              zones = zones.map(el => {
                if (validator.have(this.stageImages, el.zoneId)) {
                  return {
                    ...el,
                    image: this.stageImages[el.zoneId]
                  }
                } else {
                  return el
                }
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
        return get.stages.byStageId(this.selected.stage)
      },
      currentStageImage() {
        const stage = this.selectedStage
        if (this.lowData) return null

        if (validator.have(this.stageImages, stage.zoneId)) {
          return this.stageImages[stage.zoneId]
        } else {
          return null
        }
      },
      relativeStages () {
        if (!this.selected.stage) return null;
        const allStagesInZone = get.stages.byParentZoneId(this.selected.zone);
        const stageInZoneIndex = allStagesInZone.indexOf(allStagesInZone.find(el => el.stageId === this.selected.stage));

        const self = this;

        function validStage(stage) {
          // console.log(stageInZoneIndex, stage)
          if (self.hideClosed && (!stage || !stage["dropInfos"])) return null
          return existUtils.existence(stage) ? stage : null
        }

        return {
          prev: stageInZoneIndex > 0 ? validStage(allStagesInZone[stageInZoneIndex - 1]) : null,
          next: stageInZoneIndex < (allStagesInZone.length - 1) ? validStage(allStagesInZone[stageInZoneIndex + 1]) : null
        }
      }
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
      selectStage (zone, stage, incrementStep = true) {
        Console.log("StageSelector", "chose", zone, stage);
        this.selected.zone = zone;
        this.selected.stage = stage;
        this.$emit("select", {zone, stage});
        if (incrementStep) {
          this.step += 1
        } else {
          this.$router.push({
            name: this.routerNames.details,
            params: {
              zoneId: this.selected.zone,
              stageId: this.selected.stage
            }
          })
        }
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
      genActivityTime (zone) {
        return zone.isPermanentOpen ? this.$t('zone.status.permanentOpen') : this.$t('zone.opensAt', zone.activityActiveTime)
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
    color: rgba(0, 0, 0, .3);
  }

  .stage-card--background {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
  }

  .theme--light .stage-card--header {
    background: rgba(240, 240, 240, .9) !important;
    background: linear-gradient(to bottom, rgba(240, 240, 240, 0.9), rgba(240, 240, 240, 0.85)) !important;
  }

  .theme--light .stage-card--content {
    background: rgba(255, 255, 255, .85) !important;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.7)) !important;
  }

  .theme--dark .stage-card--header {
    background: rgba(30, 30, 30, .9) !important;
    background: linear-gradient(to bottom, rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.85)) !important;
  }

  .theme--dark .stage-card--content {
    background: rgba(0, 0, 0, .8) !important;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.70)) !important;
  }

  .stepper-header--background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    
    border-radius: 4px !important;
    overflow: hidden;
  }

  ::v-deep .stepper-header--background__animated > .v-image__image {
    background-repeat: repeat;
    background-size: 600px;

    animation: stepper-header-background-animation 55s infinite linear;
  }

  @keyframes stepper-header-background-animation {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 600px 0%;
    }
  }

</style>