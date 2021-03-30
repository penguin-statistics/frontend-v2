<template>
  <div>
    <v-dialog
      v-model="expanded"
      :overlay-opacity="0.8"
      max-width="600px"
      content-class="elevation-0"
    >
      <div v-if="expanded">
        <div class="d-flex">
          <h2
            class="title"
            v-text="$t('report.recognition.confirm.abnormal.details')"
          />
          <v-spacer />
          <v-btn
            icon
            @click="expanded = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>

        <RecognizeResultAlertCardMono
          v-for="(alert, index) in alertsWithMessage"
          :key="index"
          :alert="alert"
          expanded
        />
      </div>
    </v-dialog>

    <div
      v-ripple
      class="cursor-pointer"
      @click="expanded = true"
    >
      <RecognizeResultAlertCardMono
        v-for="(alert, index) in alertsWithMessage"
        :key="index"
        :alert="alert"
      />
    </div>
  </div>
</template>

<script>
import RecognizeResultAlertCardMono from "@/components/recognition/RecognizeResultAlertCardMono";
export default {
  name: "RecognizeResultAlertCard",
  components: {RecognizeResultAlertCardMono},
  props: {
    alerts: {
      type: Array,
      default: () => ([])
    },
  },
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    alertsWithMessage() {
      const deduplicated = []
      for (const alert of this.alerts) {
        const found = deduplicated.find(el => el.what === alert.what)
        if (found) {
          found.count += 1
          continue
        }
        deduplicated.push({
          count: 1,
          color: alert.type === 'WARNING' ? 'warning darken-2' : 'red darken-3',
          ...alert
        })
      }
      return deduplicated.map(el => ({...el, ...this.message(el.what)}));
    }
  },
  methods: {
    message(alertType) {
      const m = this.$t('report.recognition.exceptions.' + alertType);
      if (typeof m === 'object') return m
      return {
        title: m
      }
    }
  },
}
</script>

<style scoped>

</style>