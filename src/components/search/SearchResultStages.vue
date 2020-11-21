<template>
  <v-card
    class="bkop-light radius-2 cursor-pointer"
    ripple
    hover

    :to="{ name: 'StatsByStage_Selected', params: { zoneId: stage.zoneId, stageId: stage.stageId } }"
  >
    <v-card-text class="d-flex flex-row align-center">
      <div
        class="monospace stage-code-preview"
      >
        {{ stageCodePreview.v }}
      </div>
      <div class="ml-4">
        <h2 class="headline">
          {{ name.zone }}
          -
          {{ name.stage }}
        </h2>
        <span class="monospace grey--text mt-1">
          #{{ stage.stageId }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import get from "@/utils/getters"
import strings from "@/utils/strings";

export default {
  name: "SearchResultItems",
  props: {
    result: {
      type: Object,
      required: true
    },
  },
  computed: {
    name() {
      return {
        stage: strings.translate(this.stage, "code"),
        zone: strings.translate(this.zone, "zoneName")
      }
    },
    stage() {
      return get.stages.byStageId(this.result.stageId)
    },
    zone() {
      return get.zones.byZoneId(this.stage.zoneId)
    },
    stageCodePreview() {
      if (this.stage.isPermanentOpen) {
        return {
          v: this.$t('zone.types.ACTIVITY_PERMANENT')
        }
      } else if (this.stage.type === "MAINLINE") {
        return {
          v: this.name.stage
        }
      } else {
        return {
          s: true,
          v: this.name.stage
        }
      }
    }
  },
}
</script>

<style scoped>
.stage-code-preview {
  font-size: 1.7rem;
  letter-spacing: -.05rem;
  word-wrap: break-word;
  max-width: 180px;
}
</style>