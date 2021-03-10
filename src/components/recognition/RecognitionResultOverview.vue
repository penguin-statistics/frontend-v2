<template>
  <div>
    <FactTable>
      <FactTableItem
        title="成功识别"
        :content="total + ' 张截图'"
      />
      <FactTableItem
        title="通过检测"
        :content="success + ' 张'"
      />
      <!--      <FactTableItem-->
      <!--        title="识别成功率"-->
      <!--      >-->
      <!--        <template #content>-->
      <!--          <span class="monospace">{{ ((success / total) * 100).toFixed(0) + '%' }}</span>-->
      <!--        </template>-->
      <!--      </FactTableItem>-->
      <!--      <v-divider-->
      <!--        v-if="warning || error"-->
      <!--        vertical-->
      <!--        class="ml-2 mr-6"-->
      <!--      />-->
      <FactTableItem
        v-if="warning"
        title="识别警告"
        :content="warning + ' 张'"
      />
      <FactTableItem
        v-if="error"
        title="识别异常"
        :content="error + ' 张'"
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
