<template>
  <div
    class="mt-4"
    style="position: relative;"
  >
    <v-subheader>
      <v-icon class="mr-2">
        {{ category.zones[0].icon }}
      </v-icon>
      <span>
        {{ $t(["zone.types", category.id].join(".")) }}
      </span>
    </v-subheader>
    <template v-if="tabs.needTabs">
      <v-tabs
        v-model="tab"
        v-haptic
        right
        show-arrows
        class="mt-0 mt-md-n12"
        style="margin-left: 12rem; width: calc(100% - 12rem);"
      >
        <v-tab
          v-for="[key, data] in tabs.entries"
          :key="key"
          :style="{minWidth: category.id === 'ACTIVITY_CLOSED' ? '60px' : undefined}"
        >
          <template v-if="!data.title">
            {{ key }}
          </template>
          <div
            v-else-if="data.title.type === 'translated:mainline-range'"
            class="d-flex flex-column align-center"
          >
            <span
              :class="{'shrinked': $i18n.locale === 'en'}"
              v-text="$t(data.title.keyPrefix).title"
            />
            <span
              class="caption"
              v-text="$t('zone.mainlineRange.subtitle', { from: data.title.range.from, to: data.title.range.to })"
            />
          </div>
          <div
            v-else-if="data.title.type === 'translated:double-line-titled'"
            class="d-flex flex-column align-center"
          >
            <span
              :class="{'shrinked': $i18n.locale === 'en'}"
              v-text="$t(data.title.keyPrefix).title"
            />
            <span
              class="caption"
              v-text="$t(data.title.keyPrefix).subtitle"
            />
          </div>
          <template v-else-if="data.title.type === 'translated:single-line-titled'">
            {{ $t(data.title.key) }}
          </template>
          <template v-else>
            <!-- literal -->
            {{ data.title.content }}
          </template>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="[key, data] in tabs.entries"
          :key="key"
        >
          <StageSelectorPanel
            :zones="data.zones"
            :large="data.zones.length === 1"
            @select="e => $emit('select', e)"
          />
        </v-tab-item>
      </v-tabs-items>
    </template>
    <StageSelectorPanel
      v-else
      :zones="tabs.entries"
      @select="e => $emit('select', e)"
    />
  </div>
</template>

<script>
import StageSelectorPanel from "@/components/stats/StageSelectorPanel";
import timeFormatter from "@/utils/timeFormatter";
export default {
  name: "StageSelectorCategory",
  components: {StageSelectorPanel},
  props: {
    category: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      tab: null
    }
  },
  computed: {
    tabs () {
      const findMainlineIndex = (zoneId) => {
        const match = /^main_(\d+)/.exec(zoneId)
        return match?.[1]
      }
      const mainlineZoneRanges = Object.entries(this.category.zones.reduce((prev, curr) => {
        if (!prev[curr.subType]) { prev[curr.subType] = [] }
        prev[curr.subType].push(curr)
        return prev
      }, {})).map(([k, v]) => {
        const first = v[0]
        const last = v[v.length - 1]
        
        return { subType: k, from: findMainlineIndex(first.zoneId), to: findMainlineIndex(last.zoneId) }
      })
      // const mainlineZoneRanges = this.category.zones.filter(el => el.subType === "MAINLINE")
      /** @type {Record<
       *    string,
       *    {
       *      zones: Zone[];
       *      title:
       *        { type: "literal"; content: string } |
       *        { type: "translated:double-line-titled"; keyPrefix: string } |
       *        { type: "translated:single-line-titled"; key: string } |
       *        null
       *      }
       *    }
       *  }>} */
      const map = {}
      this.category.zones.forEach(el => {
        const key = this.category.id === 'ACTIVITY_CLOSED'
            ? timeFormatter.dayjs(el.existence[this.$store.getters['dataSource/server']].openTime).year().toString()
            : el.subType

        if (!map[key]) {
          const title = (() => {
            if (!key) {
              return null
            }
            if (key && key.indexOf('20') === 0) {
              return { type: 'literal', content: key }
            }
            if (el.type === "MAINLINE") {
              const range = mainlineZoneRanges.find(range => range.subType === el.subType)
              if (range) {
                return { type: 'translated:mainline-range', range, keyPrefix: `zone.subTypes.${key}` }
              }
            }
            const t = this.$t(['zone.subTypes', key].join('.'))
            if (t.subtitle) {
              return { type: 'translated:double-line-titled', keyPrefix: `zone.subTypes.${key}` }
            }
            return { type: 'translated:single-line-titled', key: `zone.subTypes.${key}` }
          })()

          map[key] = {
            zones: [],
            title,
          }
        }
        map[key].zones.push(el)
      })
      console.log('Object.values(map).map(el => el.title)', Object.values(map).map(el => el.title))

      const entries = Object.values(map)
      const needTabs = entries.length > 1
      return {
        needTabs,
        entries: needTabs ? Object.entries(map) : Object.values(map)[0].zones
      }
    }
  },
  watch: {
    tabs: {
      immediate: true,
      handler (newValue) {
        if (newValue.needTabs) {
          this.tab = newValue.entries.length - 1
        }
      }
    }
  },
}
</script>

<style scoped>
.shrinked {
  /* text-transform: none !important; */
  letter-spacing: -0.35px !important;
  font-size: 0.8rem !important;
}
</style>
