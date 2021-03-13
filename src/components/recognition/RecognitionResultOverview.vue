<template>
  <div>
    <FactTable class="flex-column flex-md-row flex-lg-row flex-xl-row">
      <div class="d-flex flex-row">
        <FactTableItem
          content-class="monospace"
          :title="$t('report.recognition.confirm.overview.total')"
          :content="$t('report.recognition.confirm.overview.count', {count: total})"
        />
        <FactTableItem
          content-class="monospace"
          :title="$t('report.recognition.confirm.overview.success')"
          :content="$t('report.recognition.confirm.overview.count', {count: success})"
        />
        <!--        <FactTableItem-->
        <!--          v-if="warning"-->
        <!--          title="识别警告"-->
        <!--          :content="warning + ' 张'"-->
        <!--        />-->
        <FactTableItem
          v-if="error"
          :title="$t('report.recognition.confirm.overview.error')"
          content-class="monospace"
          :content="$t('report.recognition.confirm.overview.count', {count: error})"
        />
      </div>

      <v-divider
        class="ml-2 mr-6 hidden-sm-and-down"
        vertical
      />

      <div class="d-flex flex-row mt-4 mt-md-0 mt-lg-0 mt-xl-0">
        <FactTableItem
          content-class="monospace"
          :title="$t('report.recognition.confirm.overview.server')"
        >
          <template #content>
            <div class="d-flex align-center">
              <v-icon
                left
                small
              >
                mdi-server
              </v-icon>
              {{ server }}
            </div>
          </template>
        </FactTableItem>
        <FactTableItem
          content-class="monospace"
          :title="$t('report.recognition.confirm.overview.duration')"
        >
          <template #content>
            <span class="monospace">
              {{ duration }}ms
            </span>
          </template>
        </FactTableItem>
      </div>
    </FactTable>
  </div>
</template>

<script>
import FactTable from "@/components/stats/fact-table/FactTable";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";
export default {
  name: 'RecognitionResultOverview',
  components: {FactTableItem, FactTable},
  props: {
    success: {
      type: Number,
      default () { return 0 }
    },
    error: {
      type: Number,
      default () { return 0 }
    },
    total: {
      type: Number,
      default () { return 0 }
    },
    duration: {
      type: String,
      default () { return "#" }
    },
  },
  computed: {
    server () {
      return this.$t('server.servers.' + this.$store.getters['dataSource/server'])
    }
  }
}
</script>
<style>
@keyframes star {
  from {opacity: 0.2}
  to {opacity: 1}
}
@keyframes postMove {
  from {top: -20px; opacity:0}
  to {top: 0px; opacity:1}
}
</style>
