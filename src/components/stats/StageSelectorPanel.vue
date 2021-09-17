<template>
  <v-expansion-panels
    v-model="panels"
    :hover="!large"
    class="mb-2"
    :readonly="large"
  >
    <v-expansion-panel
      v-for="zone in zones"
      :key="zone.zoneId"
      class="bkop-light stage-card--background"
      :style="{ 'background-image': zone.background ? `url(${cdnDeliver(zone.background)}) !important` : null }"
    >
      <v-expansion-panel-header
        v-haptic
        :hide-actions="large"
        class="overflow-hidden bkop-medium"
        :class="{ 'stage-card--header': !!zone.background, 'stage-card--transparent': large }"
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
            {{ $t("zone.status." + zone.timeValid) }}
          </span>
          <span
            v-if="zone.isPermanentOpen"
            class="text--darken-1 font-weight-bold orange--text ml-2 mr-1"
          >
            {{ $t("zone.status.permanentOpen") }}
          </span>

          <span
            class="subtitle-1 pl-2"
            :class="{
              'text--darken-1 font-weight-bold': zone.isActivity && small,
              'red--text': zone.isActivity && small && zone.timeValid === 1,
              'green--text': zone.isActivity && small && zone.timeValid === 0,
              'grey--text': zone.isActivity && small && zone.timeValid === -1
            }"
          >
            {{ strings.translate(zone, "zoneName") }}
          </span>

          <v-spacer />

          <v-chip
            v-if="zone.isActivity"
            small
            disabled
            class="mr-8"
          >
            {{ zone.activityStartDate }}
          </v-chip>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content :class="{ 'stage-card--content': !!zone.background, 'stage-card--large-content': large }">
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
            v-haptic
            :stage="stage"
            @click.native="$emit('select', {zoneId: zone.zoneId, stageId: stage.stageId})"
          />
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import StageCard from "@/components/stats/StageCard";
import CDN from "@/mixins/CDN";
import Theme from "@/mixins/Theme";
import strings from "@/utils/strings";

export default {
name: "StageSelectorPanel",
  components: {StageCard},
  mixins: [CDN, Theme],
  props: {
    zones: {
      type: Array,
      required: true
    },
    large: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      internalPanels: []
    }
  },
  computed: {
    strings() {
      return strings;
    },
    small () {
      return this.$vuetify.breakpoint.smAndDown
    },
    panels: {
      get () {
        return this.large ? 0 : this.internalPanels
      },
      set (val) {
        this.internalPanels = val
      }
    }
  },
  methods: {
    genActivityTime (zone) {
      return zone.isPermanentOpen
          ? this.$t('zone.status.permanentOpen')
          : this.$t('zone.opensAt', zone.activityActiveTime)
    }
  },
}
</script>

<style scoped>
.stage-card--background {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
}

.theme--light .stage-card--header {
  background: rgba(240, 240, 240, 0.9) !important;
  background: linear-gradient(to bottom, rgba(240, 240, 240, 0.9), rgba(240, 240, 240, 0.85)) !important;
}

.theme--light .stage-card--content {
  background: rgba(255, 255, 255, 0.85) !important;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.7)) !important;
}

.theme--dark .stage-card--header {
  background: rgba(30, 30, 30, 0.9) !important;
  background: linear-gradient(to bottom, rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.85)) !important;
}

.theme--dark .stage-card--content {
  background: rgba(0, 0, 0, 0.8) !important;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7)) !important;
}

.theme--light .stage-card--transparent {
  background: rgba(255, 255, 255, 0.85) !important;
  cursor: default !important;
  border-radius: 4px 4px 0 0 !important;
}

.theme--dark .stage-card--transparent {
  background: rgba(0, 0, 0, 0.85) !important;
  cursor: default !important;
  border-radius: 4px 4px 0 0 !important;
}

.theme--light .stage-card--large-content,
.theme--dark .stage-card--large-content {
  border-radius: 0 0 4px 4px !important;
}
</style>