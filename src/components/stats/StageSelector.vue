<template>
  <v-stepper
    v-model="step"
    alt-labels
    class="transparent elevation-0 full-width pa-md-2 pa-lg-4 pa-xl-4"
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
          :gradient="dark ? '160deg, rgba(0, 0, 0, .95), rgba(0, 0, 0, .4)' : '160deg, rgba(255, 255, 255, .95), rgba(255, 255, 255, .4)'"

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
            opacity="0"
            :style="{'background': dark ? 'linear-gradient(150deg, rgba(0, 0, 0, .95), rgba(0, 0, 0, 0))' : 'linear-gradient(150deg, rgba(255, 255, 255, .95), rgba(255, 255, 255, 0))'}"
          />
        </v-img>
      </v-fade-transition>

      <BackButton
        :name="$t('stage.selector.title')"
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
              v-haptic

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
              v-haptic

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
        :class="{'pa-0': small, 'pa-2': !small}"
      >
        <v-row class="px-1">
          <v-col
            cols="12"
            :class="{'pb-0': !preferencedStages.haveAny}"
          >
            <v-subheader>
              <v-icon
                class="mr-2"
                :color="preferencedStages.haveAny ? '' : 'grey'"
              >
                mdi-chevron-double-right
              </v-icon>
              <span>
                {{ preferencedStages.haveAny ? $t('stage.actions._name.selector') : $t('stage.actions._name.selectorEmpty') }}
              </span>
            </v-subheader>

            <v-card
              v-if="preferencedStages.haveAny"
              class="bkop-light"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-card-title class="pt-2 subtitle-1">
                    <v-icon left>
                      mdi-star
                    </v-icon>
                    {{ $t('stage.actions.star.name') }}
                  </v-card-title>
                  <v-card-text class="pb-2 px-6">
                    <template v-if="preferencedStages.favorites.length">
                      <StageCard
                        v-for="stage in preferencedStages.favorites"
                        :key="stage.stageId"
                        v-haptic
                        :stage="stage"

                        @click.native="selectStage(stage.zoneId, stage.stageId)"
                      />
                    </template>

                    <template v-else>
                      <div
                        v-for="text in $t('stage.actions.star.empty')"
                        :key="text"
                        class="caption text-left justify-center grey--text"
                        v-text="text"
                      />
                    </template>
                  </v-card-text>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-card-title class="pt-2 subtitle-1">
                    <v-icon left>
                      mdi-history
                    </v-icon>
                    {{ $t('stage.actions.history.name') }}

                    <v-spacer />
                    <v-btn
                      v-haptic.notification="'WARNING'"
                      small
                      text
                      :disabled="!preferencedStages.histories.length"
                      @click="$store.commit('stagePreferences/clearHistory')"
                    >
                      {{ $t('stage.actions.history.clear') }}
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pb-2 px-6">
                    <template v-if="preferencedStages.histories.length">
                      <div class="history-stage-cards">
                        <StageCard
                          v-for="stage in preferencedStages.histories"
                          :key="stage.stageId"
                          v-haptic
                          :stage="stage"

                          @click.native="selectStage(stage.zoneId, stage.stageId)"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <div
                        v-for="text in $t('stage.actions.history.empty')"
                        :key="text"
                        class="caption text-left justify-center grey--text"
                        v-text="text"
                      />
                    </template>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>

            <v-divider v-if="!preferencedStages.haveAny" />
          </v-col>

          <v-col
            v-for="(categories, index) in categorizedZones"
            :key="index"
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            class="mt-n4"
          >
            <StageSelectorCategory
              v-for="category in categories"
              :key="category.id"
              :category="category"
              @select="e => selectStage(e.zoneId, e.stageId)"
            />
          </v-col>
        </v-row>
      </v-stepper-content>
      <v-stepper-content
        :step="2"
        class="pa-0 pt-2"
      >
        <slot />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import BackButton from '@/components/stats/BackButton'
import StageCard from '@/components/stats/StageCard'
import StageSelectorCategory from "@/components/stats/StageSelectorCategory"
import CDN from '@/mixins/CDN'
import Theme from '@/mixins/Theme'
import Console from '@/utils/Console'
import existUtils from '@/utils/existUtils'
import get from '@/utils/getters'
import strings from '@/utils/strings'
import { mapGetters } from 'vuex'

export default {
  name: 'StageSelector',
  components: {StageSelectorCategory, BackButton, StageCard },
  mixins: [CDN, Theme],
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
          index: '',
          details: ''
        }
      }
    },
    stage: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      internalStep: 1,
      selected: {
        zone: null,
        stage: null
      },
      stageImages: {
        // 选择页面背景
        _default: this.cdnDeliver('/backgrounds/zones/default.jpg')
      },
      activeTabs: {}
    }
  },
  computed: {
    ...mapGetters('settings', ['lowData']),
    bindRouter () {
      return this.routerNames.index !== '' && this.routerNames.details !== ''
    },
    step: {
      get () {
        return this.internalStep
      },
      set (val) {
        this.internalStep = val
        if (val === 1) this.$emit('select', { zone: null, stage: null })

        if (!this.bindRouter) return
        if (val === 1) {
          this.$router.push({
            name: this.routerNames.index
          })
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
    categorizedZones () {
      const categoriesSet = this.hideClosed
        ? [ // Report
          [
            ['ACTIVITY_OPEN', 'ACTIVITY_PENDING', 'MAINLINE', 'ACTIVITY_PERMANENT'],
            ['GACHABOX', 'WEEKLY']
          ], // md, lg & xl
          [
            ['ACTIVITY_OPEN', 'ACTIVITY_PENDING', 'MAINLINE', 'ACTIVITY_PERMANENT'],
            ['GACHABOX', 'WEEKLY']
          ] // xs & sm
        ]
        : [ // Show Statistics
          [
            ['ACTIVITY_OPEN', 'ACTIVITY_PENDING', 'MAINLINE', 'ACTIVITY_PERMANENT'],
            ['GACHABOX', 'RECRUIT', 'ACTIVITY_CLOSED', 'WEEKLY']
          ], // md, lg & xl
          [
            ['ACTIVITY_OPEN', 'ACTIVITY_PENDING', 'MAINLINE', 'ACTIVITY_PERMANENT'],
            ['GACHABOX', 'RECRUIT', 'ACTIVITY_CLOSED', 'WEEKLY']
          ] // xs & sm
        ]

      const result = [[], []]
      for (const [index, categories] of categoriesSet[this.small ? 1 : 0].entries()) {
        for (const category of categories) {
          let filter
          let zones = get.zones.byType((category.startsWith('ACTIVITY') && category !== 'ACTIVITY_PERMANENT') ? 'ACTIVITY' : category, false)
          zones = zones.filter(el => existUtils.existence(el))

          if (category === 'ACTIVITY_OPEN') {
            filter = zone => zone.timeValid === 0
          } else if (category === 'ACTIVITY_CLOSED') {
            filter = zone => zone.timeValid === 1
          } else if (category === 'ACTIVITY_PENDING') {
            filter = zone => zone.timeValid === -1
          }

          if (filter) zones = zones.filter(filter)

          zones = zones
            .map(zone => {
              let stages = get.stages.byParentZoneId(zone.zoneId)
              if (this.hideClosed) {
                stages = stages.filter(stage => !!stage.dropInfos)
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
          if (category.startsWith('ACTIVITY') && category !== 'ACTIVITY_PERMANENT') {
            const server = this.$store.getters['dataSource/server']
            zones = zones
              .slice()
              .sort((a, b) => a.existence[server].openTime - b.existence[server].openTime)
          }

          if (this.lowData) {
            zones = zones.map(el => {
              return {
                ...el,
                background: null
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
      return result
    },
    selectedZone () {
      if (!this.selected.zone) return {}
      return get.zones.byZoneId(this.selected.zone)
    },
    selectedStage () {
      if (!this.selected.stage) return {}
      return get.stages.byStageId(this.selected.stage)
    },
    currentStageImage () {
      const zone = this.selectedZone
      if (this.lowData) return null

      if (zone.background) return this.cdnDeliver(zone.background)
      return null
    },
    relativeStages () {
      if (!this.selected.stage) return null
      const allStagesInZone = get.stages.byParentZoneId(this.selected.zone)
      const stageInZoneIndex = allStagesInZone.indexOf(allStagesInZone.find(el => el.stageId === this.selected.stage))

      const self = this

      function validStage (stage) {
        // console.log(stageInZoneIndex, stage)
        if (self.hideClosed && (!stage || !stage.dropInfos)) return null
        return existUtils.existence(stage) ? stage : null
      }

      return {
        prev: stageInZoneIndex > 0 ? validStage(allStagesInZone[stageInZoneIndex - 1]) : null,
        next: stageInZoneIndex < (allStagesInZone.length - 1) ? validStage(allStagesInZone[stageInZoneIndex + 1]) : null
      }
    },
    preferencedStages () {
      const favorites = this.$store.getters['stagePreferences/favorites']
        .map(el => get.stages.byStageId(el))
        .filter(el => get.zones.byZoneId(el.zoneId, true, false))
      const histories = this.$store.getters['stagePreferences/histories']
        .map(el => get.stages.byStageId(el))
        .filter(el => get.zones.byZoneId(el.zoneId, true, false))

      return {
        favorites,
        histories,
        haveAny: !!favorites.length + histories.length
      }
    }
  },
  watch: {
    $route () {
      this.checkRoute()
    }
  },
  beforeMount () {
    this.checkRoute()
  },
  mounted () {
    if (this.stage) {
      const stage = get.stages.byStageCode(this.stage)
      if (!stage.stageId) {
        this.selectStage(stage.zoneId, stage.stageId)
      }
    }
  },
  methods: {
    selectStage (zone, stage, incrementStep = true) {
      Console.log('StageSelector', 'chose', zone, stage)
      this.selected.zone = zone
      this.selected.stage = stage
      this.$emit('select', { zone, stage })
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
      if (!this.bindRouter) return
      if (this.$route.name === this.routerNames.details) {
        this.internalStep = 2
        const zone = this.$route.params.zoneId
        const stage = this.$route.params.stageId
        this.selected.zone = zone
        this.selected.stage = stage
        this.$emit('select', { zone, stage })
      } else if (this.$route.name === this.routerNames.index) {
        this.internalStep = 1

        this.selected.zone = null
        this.selected.stage = null
      }
    }
  }
}
</script>

<style scoped>

  .history-stage-cards {
    /* 92px: 2 lines of cardHeight (38px stage card height + 2 * 4px margin) */
    max-height: 92px;
    overflow: hidden;

    /* 83(82.8)px: 1.8 * cardHeight */
    /* 65px: 2 * cardHeight - 4px margin */
    /*mask: linear-gradient(to right, rgba(0, 0, 0, 1) 90%, transparent);*/
    /*-webkit-mask: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 1)), color-stop(92), to(rgba(0, 0, 0, 0)));*/
    /*-webkit-mask: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 1) ), to(rgba(0, 0, 0, 0)));*/
  }

</style>
