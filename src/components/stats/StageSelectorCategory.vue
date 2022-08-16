<template>
  <div class="mt-4">
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
      >
        <v-tab
          v-for="[key, value] in tabs.entries"
          :key="key"
        >
          <div
            v-if="$t('zone.subTypes.' + key).title"
            class="d-flex flex-column align-center"
          >
            <span
              :class="{'shrinked': $i18n.locale === 'en'}"
              v-text="$t('zone.subTypes.' + key).title"
            />
            <span
              class="caption"
              v-text="$t('zone.subTypes.' + key).subtitle"
            />
          </div>
          <template v-else>
            {{ $t('zone.subTypes.' + key) }}
          </template>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="[key, value] in tabs.entries"
          :key="key"
        >
          <StageSelectorPanel
            :zones="value"
            :large="value.length === 1"
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
      const map = {}
      this.category.zones.forEach(el => {
        const key = this.category.id === 'ACTIVITY_CLOSED'
            ? timeFormatter.dayjs(el.existence[this.$store.getters['dataSource/server']].openTime).year()
            : el.subType

        if (!map[key]) map[key] = []
        map[key].push(el)
      })
      const entries = Object.values(map)
      const needTabs = entries.length > 1
      return {
        needTabs,
        entries: needTabs ? Object.entries(map) : Object.values(map)[0]
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