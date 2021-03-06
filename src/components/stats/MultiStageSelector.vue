<template>
  <v-card>
    <v-card-title>
      {{ $t('stage.selector.plannerExclude') }}
    </v-card-title>
    <v-card-actions class="mx-4">
      <v-spacer />
      <v-btn
        v-haptic
        outlined
        color="error"
        @click="disableAll"
      >
        {{ $t('stage.selector.excludeAll') }}
      </v-btn>
      <v-btn
        v-haptic
        outlined
        color="success"
        @click="enableAll"
      >
        {{ $t('stage.selector.includeAll') }}
      </v-btn>
    </v-card-actions>
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
            {{ $t(['zone.types', category.id].join('.')) }}
          </span>
          <v-divider class="mx-4" />
          <v-checkbox
            v-haptic
            v-bind="statuses.category[category.id]"

            @click.self="toggleCategory(category.id, statuses.category[category.id])"
          />
        </v-subheader>
        <v-row
          v-for="zone in category.zones"
          :key="zone.zoneId"
          class="d-flex flex-column flex-sm-row mx-2 my-4"
        >
          <div
            class="d-flex flex-column justify-center align-start text-center zone-title"
          >
            <v-checkbox
              v-haptic
              v-bind="statuses.zone[zone.zoneId]"

              hide-details
              :label="translate(zone, 'zoneName')"
              class="ma-0 pa-0"
              @click.stop="toggleZone(category.id, zone.zoneId, statuses.zone[zone.zoneId])"
            />
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

              @click.native="toggle(stage.stageId)"
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
        @click="$emit('close')"
      >
        {{ $t('meta.dialog.close') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import get from '@/utils/getters'
import strings from '@/utils/strings'
import StageCard from '@/components/stats/StageCard'

export default {
  name: 'MultiStageSelector',
  components: { StageCard },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // states: {}
    }
  },
  computed: {
    categorizedZones () {
      const categories = ['ACTIVITY_OPEN', 'MAINLINE', 'ACTIVITY_PERMANENT', 'WEEKLY']
      const results = []
      for (const category of categories) {
        let zones = get.zones.byType(category === 'ACTIVITY_OPEN' ? 'ACTIVITY' : category)
        if (category === 'ACTIVITY_OPEN') zones = zones.filter(zone => !zone.isOutdated)
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
      return results
    },
    statuses () {
      const statuses = {
        category: {},
        zone: {}
      }
      for (const category of this.categorizedZones) {
        const categoryCount = [0, 0] // [trues, falses]
        for (const zone of category.zones) {
          const zoneCount = [0, 0] // [trues, falses]

          for (const stage of zone.stages) {
            zoneCount[this.states[stage.stageId] ? 0 : 1] += 1
            categoryCount[this.states[stage.stageId] ? 0 : 1] += 1
          }

          if (zoneCount[0] === 0) {
            this.$set(statuses.zone, zone.zoneId, { inputValue: false })
          } else if (zoneCount[1] === 0) {
            this.$set(statuses.zone, zone.zoneId, { inputValue: true })
          } else {
            this.$set(statuses.zone, zone.zoneId, { indeterminate: true })
          }
        }
        if (categoryCount[0] === 0) {
          this.$set(statuses.category, category.id, { inputValue: false })
        } else if (categoryCount[1] === 0) {
          this.$set(statuses.category, category.id, { inputValue: true })
        } else {
          this.$set(statuses.category, category.id, { indeterminate: true })
        }
      }

      return statuses
    },
    states () {
      const states = {}
      for (const stage of get.stages.all()) {
        if (stage.isOutdated) continue
        // if found, means user has explicitly excluded this stage. set false. otherwise true.
        // this.value refers to the parent v-model value
        this.$set(states, stage.stageId, !this.value.find(el => el === stage.stageId))
      }
      return states
    }
  },
  methods: {
    translate (object, key) {
      return strings.translate(object, key)
    },
    toggle (stageId) {
      this.states[stageId] = !this.states[stageId]
      this.update()
    },
    update () {
      const entries = []
      for (const entry of Object.entries(this.states).filter(el => !el[1])) entries.push(entry[0])
      this.$emit('input', entries)
    },
    toggleCategory (categoryId, statuses) {
      let switchTo = true
      if (statuses.inputValue === true) switchTo = false

      for (const zone of this.categorizedZones.find(el => el.id === categoryId).zones) {
        for (const stage of zone.stages) {
          this.states[stage.stageId] = switchTo
        }
      }

      this.update()
    },
    toggleZone (categoryId, zoneId, statuses) {
      let switchTo = true
      if (statuses.inputValue === true) switchTo = false

      for (const stage of this.categorizedZones
        .find(el => el.id === categoryId)
        .zones.find(el => el.zoneId === zoneId)
        .stages
      ) {
        this.states[stage.stageId] = switchTo
      }

      this.update()
    },
    setAll (state) {
      for (const key of Object.keys(this.states)) this.states[key] = state
    },
    disableAll () {
      this.setAll(false)
      this.update()
    },
    enableAll () {
      this.setAll(true)
      this.update()
    }
  }
}
</script>

<style scoped>
.zone-title {
  flex: 0 1 6.5rem;
}
@media (max-width: 599px) {
  .zone-title {
    flex: 1 0 3rem;
  }
}
</style>
