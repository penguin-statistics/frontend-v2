<template>
  <v-card
    dark
    :class="`pa-2 pl-8 ${alert.color} mt-2 position-relative overflow-hidden`"
  >
    <v-icon
      x-large
      style="position: absolute; left: -10px; top: -6px; opacity: .4"
    >
      {{ icon }}
    </v-icon>
    <div class="text-break d-inline-flex flex-row full-width">
      <div>
        {{ alert.title }}
        <span
          v-if="alert.count > 1"
          class="ml-1 font-weight-bold"
        >
          ×{{ alert.count }}
        </span>
      </div>

      <v-spacer />

      <v-icon
        v-if="!expanded"
        small
        right
        class="degraded-opacity"
      >
        mdi-chevron-right
      </v-icon>
    </div>
    <div v-if="expanded">
      <div
        v-if="alert.subtitle"
        class="subtitle-2 degraded-opacity"
      >
        {{ alert.subtitle }}
      </div>
      <div
        class="monospace-pure degraded-opacity"
        style="font-size: 10px; line-height: 1.5"
      >
        {{ alert.what }}
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
name: "RecognizeResultAlertCardMono",
  props: {
    alert: {
      type: Object,
      required: true
    },
    expanded: {
      type: Boolean,
      default: () => false
    },
  },
  computed: {
    icon() {
      return this.alert.type === 'ERROR' ? 'mdi-alert-decagram' : 'mdi-alert-circle';
    }
  },
}
</script>

<style scoped>

</style>