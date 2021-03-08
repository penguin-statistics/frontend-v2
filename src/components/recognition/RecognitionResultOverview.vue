<template>
  <div>
    <FactTable>
      <FactTableItem
        title="已成功识别共计"
        :content="success + ' 张截图'"
      />
      <FactTableItem
        title="识别成功率"
      >
        <template #content>
          <span class="monospace">{{ ((success / total) * 100).toFixed(0) + '%' }}</span>
        </template>
      </FactTableItem>
      <v-divider
        v-if="warning || error"
        vertical
        class="ml-2 mr-6"
      />
      <FactTableItem
        v-if="warning || error"
        title="其中，异常截图共计"
        :content="(warning + error) + ' 个'"
      />
      <FactTableItem
        v-if="warning"
        title="警告截图总计"
        :content="warning + ' 个'"
      />
      <FactTableItem
        v-if="error"
        title="拒绝截图总计"
        :content="error + ' 个'"
      />

      <v-divider
        class="ml-2 mr-6"
        vertical
      />
      <FactTableItem
        title="数据集服务器"
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
        title="识别用时"
      >
        <template #content>
          <span class="monospace">
            517ms
          </span>
        </template>
      </FactTableItem>
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
    warning: {
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
    }
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
