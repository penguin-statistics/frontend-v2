<template>
  <v-dialog
    v-model="dialog"
    max-width="650px"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex flex-row align-center justify-center mt-3">
        <v-tooltip
          content-class="transparent"
          right
          nudge-right="-16"
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-expand-x-transition>
              <v-icon
                v-if="value"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
              >
                mdi-cube
              </v-icon>
            </v-expand-x-transition>
          </template>
          <v-card
            max-width="400px"
          >
            <v-card-title>
              {{ $t('query.selector.stage.title') }}
            </v-card-title>
            <v-card-text>
              {{ $t('query.selector.stage.subtitle') }}
            </v-card-text>
          </v-card>
        </v-tooltip>

        <v-btn
          v-haptic
          class="flex-grow-1"
          large
          :disabled="disabled"
          v-bind="attrs"
          v-on="on"
        >
          <span
            v-if="value"
            class="d-flex align-center justify-center"
          >
            <v-icon
              small
              left
            >
              {{ selectedZone.icon }}
            </v-icon>
            {{ selectedZone.translatedName }} | {{ selectedStage.translatedCode }}
          </span>
          <div
            v-else
            class="d-flex align-center"
          >
            <v-icon left>
              mdi-cube
            </v-icon>
            {{ $t('query.selector.stage.title') }}
            <small class="ml-1">*{{ $t('validator.required') }}</small>
          </div>
        </v-btn>
        <!--        <v-expand-x-transition>-->
        <!--          <div v-if="value">-->
        <!--            <v-btn-->
        <!--              icon-->
        <!--              @click="clear"-->
        <!--            >-->
        <!--              <v-icon>-->
        <!--                mdi-close-->
        <!--              </v-icon>-->
        <!--            </v-btn>-->
        <!--          </div>-->
        <!--        </v-expand-x-transition>-->
      </div>
    </template>

    <v-card>
      <v-card-title class="title">
        {{ $t('query.selector.stage.title') }}
      </v-card-title>
      <div class="mx-6">
        <template v-for="category in categorizedZones">
          <v-subheader
            :key="category.id"
            class="px-2"
          >
            <v-icon
              class="mr-2"
            >
              {{ category.zones[0].icon }}
            </v-icon>
            <span>
              {{ $t(`zone.types.${category.id}`) }}
            </span>
            <v-divider class="mx-4" />
          </v-subheader>
          <v-row
            v-for="zone in category.zones"
            :key="zone.zoneId"
            class="d-flex flex-column flex-sm-row mx-2 my-4"
          >
            <div
              class="d-flex flex-column justify-center align-center text-right zone-title"
            >
              {{ translate(zone, "zoneName") }}
            </div>
            <v-divider
              vertical
              class="mx-2"
            />
            <div
              class="flex-wrap align-center"
              style="flex: 1 1 0"
            >
              <StageCard
                v-for="stage in zone.stages"
                :key="stage.stageId"
                :stage="stage"

                :chosen="states[stage.stageId]"
                class="d-inline"

                @click.native="select(stage.stageId)"
              />
            </div>
          </v-row>
        </template>
      </div>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          @click="dialog = false"
        >
          {{ $t('meta.dialog.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import get from "@/utils/getters";
  import strings from "@/utils/strings";
  import StageCard from "@/components/stats/StageCard";

  export default {
    name: "QuerySelectorStage",
    components: {StageCard},
    props: {
      /** Stage ID */
      value: {
        type: String,
        default () {
          return undefined
        }
      },
      disabled: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data() {
      return {
        dialog: false
      }
    },
    computed: {
      categorizedZones() {
        const categories = ["ACTIVITY_OPEN", "MAINLINE", "WEEKLY", "ACTIVITY_CLOSED"];
        const results = [];
        for (const category of categories) {
          let zones = get.zones.byType(category.startsWith("ACTIVITY") ? "ACTIVITY" : category, false);
          if (category === "ACTIVITY_OPEN") {
            zones = zones.filter(zone => !zone.isOutdated);
          } else if (category === "ACTIVITY_CLOSED") {
            zones = zones.filter(zone => zone.isOutdated);
          }
          zones = zones.map(el => {
            el.stages = get.stages.byParentZoneId(el.zoneId)
            return el
          })

          if (zones && zones.length) {
            results.push({
              id: category,
              zones: zones
            })
          }
        }
        return results;
      },
      states () {
        return {
          [this.value]: true
        }
      },
      selectedStage () {
        const result = get.stages.byStageId(this.value)
        return {
          ...result,
          translatedCode: this.translate(result, "code")
        }
      },
      selectedZone () {
        const result = get.zones.byZoneId(this.selectedStage.zoneId, false)
        return {
          ...result,
          translatedName: this.translate(result, "zoneName")
        }
      }
    },
    methods: {
      translate (object, key) {
        return strings.translate(object, key)
      },
      select (stageId) {
        this.$emit("input", stageId)
        this.dialog = false
      },
      clear () {
        this.$emit('input', null)
      }
    },
  }
</script>

<style scoped>
  .zone-title {
    flex: 0 1 5rem;
  }
  @media (max-width: 599px) {
    .zone-title {
      flex: 1 0 3rem;
    }
  }
</style>