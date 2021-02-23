<template>
  <v-card
    class="purple-card radius-2 cursor-pointer search-result-card ma-2"
    ripple
    hover

    :to="{ name: 'StatsByStage_Selected', params: { zoneId: stage.zoneId, stageId: stage.stageId } }"
  >
    <v-card-text class="d-flex flex-row align-center">
      <div
        class="monospace d-inline-flex align-center justify-center stage-code-preview"
      >
        {{ name.preview }}
      </div>
      <div class="ml-4">
        <span class="monospace grey--text mb-1">
          {{ name.subtitle }}
        </span>
        <h2 class="headline">
          {{ name.title }}
        </h2>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import get from "@/utils/getters"
import strings from "@/utils/strings";

export default {
  name: "SearchResultStages",
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    name() {
      const zoneName = strings.translate(this.zone, "zoneName")
      const zoneType = this.$t('zone.types.' + this.zone.type)
      const stageCode = strings.translate(this.stage, "code")

      return {
        title: (zoneName ? zoneName + ' — ' : '') + stageCode,
        subtitle: this.$t('stage.name') + (zoneType ? ' — ' + zoneType : ''),
        preview: this.zone.isPermanentOpen ? this.$t('zone.types.ACTIVITY_PERMANENT') : stageCode
      }
    },
    stage() {
      return get.stages.byStageId(this.result.stageId, false)
    },
    zone() {
      return get.zones.byZoneId(this.stage.zoneId, false)
    }
  },
}
</script>

<style scoped lang="scss">
.stage-code-preview {
  font-size: 1.7rem;
  letter-spacing: -.05rem;
  word-wrap: break-word;
  max-width: 180px;
  min-width: 60px;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  min-height: 48px;
}
.purple-card {
  .theme--light & {
    background: rgba(228, 214, 255, .9);
  }

  .theme--dark & {
    background: rgba(51, 31, 77, .9)
  }
}
</style>