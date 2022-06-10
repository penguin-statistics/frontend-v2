<template>
  <v-dialog
    v-model="showDialog"
    transition="scale-transition"
    max-width="550px"
  >
    <template #activator="{ on, attrs }">
      <div
        class="d-flex flex-column mr-4 digdown-hoverable transition-all"
        style="font-size: 12px; opacity: 0.8"
        v-bind="attrs"
        v-on="on"
      >
        <div
          class="d-flex flex-row align-center"
          style="gap: 8px"
        >
          <v-icon
            x-small
            style="transform: translateY(-2px)"
          >
            mdi-arrow-collapse-up
          </v-icon>
          <span>{{ confidenceInterval.upper }}</span>
          <v-spacer />
          <span>{{ confidenceInterval.upperAmount }}</span>
        </div>
        <div
          class="d-flex flex-row align-center"
          style="gap: 8px"
        >
          <v-icon
            x-small
          >
            mdi-arrow-collapse-down
          </v-icon>
          <span>{{ confidenceInterval.lower }}</span>
          <v-spacer />
          <span>{{ confidenceInterval.lowerAmount }}</span>
        </div>
      </div>
    </template>

    <v-card class="pt-1">
      <v-card-title class="headline">
        <v-icon left>
          mdi-information-outline
        </v-icon>
        置信区间单元格
      </v-card-title>

      <v-card-subtitle class="mt-0">
        这是对本置信区间单元格内数据的简要解释。若需自定义刷取次数、置信值等参数，请 <DataTableFluctuationCustomize />
      </v-card-subtitle>

      <v-card-text>
        <v-container class="pt-0">
          <v-row class="flex-column align-center">
            <div
              class="d-flex flex-column display-1 text-left"
            >
              <div
                class="d-flex flex-row align-center monospace"
                style="gap: 8px"
              >
                <v-icon style="transform: translateY(-4px)">
                  mdi-arrow-collapse-up
                </v-icon>
                <span class="mr-4 green--text">{{ confidenceInterval.upper }}</span>
                <v-spacer />
                <span class="cyan--text">{{ confidenceInterval.upperAmount }}</span>
              </div>
              <div
                class="d-flex flex-row align-center monospace"
                style="gap: 8px"
              >
                <v-icon>
                  mdi-arrow-collapse-down
                </v-icon>
                <span class="mr-4 green--text">{{ confidenceInterval.lower }}</span>
                <v-spacer />
                <span class="cyan--text">{{ confidenceInterval.lowerAmount }}</span>
              </div>
            </div>
          </v-row>

          <v-row class="flex-column mt-4">
            <Subheader>
              概述
            </Subheader>

            <blockquote class="blockquote-box">
              如果刷取 <strong class="orange--text">{{ fluctuationVisualize.n }}</strong> 次关卡 <strong class="yellow--text">{{ strings.translate(item.stage, 'code') }}</strong> 的情况下，可根据现有数据断言以 <strong class="orange--text">{{ fluctuationVisualize.confidence * 100 }}%</strong> 之可能性，所得到物品 <strong class="yellow--text">{{ strings.translate(item.item, 'name') }}</strong> 的数量落于 <strong class="cyan--text">{{ confidenceInterval.lowerAmount }} 个</strong> (获得概率 <strong class="green--text">{{ confidenceInterval.lower }}</strong>) 至 <strong class="cyan--text">{{ confidenceInterval.upperAmount }} 个</strong> (获得概率 <strong class="green--text">{{ confidenceInterval.upper }}</strong>) 之间。
            </blockquote>
          </v-row>

          <v-row class="flex-column mt-4">
            <Subheader>
              原数据
            </Subheader>

            <div>
              <p>用于计算本单元格所使用的原数据为：</p>
              <ul>
                <li>
                  样本量：<span class="monospace-pure">{{ fluctuationVisualize.n }}</span>
                </li>
                <li>
                  标准差：<span class="monospace-pure">{{ item.stdDev }}</span>
                </li>
                <li>
                  置信值：<span class="monospace-pure">{{ fluctuationVisualize.confidence * 100 }}% <small>(使用 z 值 {{ confidenceInterval.zScore }})</small></span>
                </li>
                <li>
                  平均值：<span class="monospace-pure">{{ item.percentage }} <small>(由全站数据集 {{ item.quantity }} 掉落数 / {{ item.times }} 样本数 得出)</small></span>
                </li>
              </ul>
            </div>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          @click="showDialog = false"
        >
          {{ $t('meta.dialog.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";
import Subheader from "@/components/global/Subheader";
import strings from "@/utils/strings";
import DataTableFluctuationCustomize from "@/components/stats/DataTableFluctuationCustomize";

const zScores = {
  0.9: 1.645,
  0.95: 1.96,
  0.99: 2.576,
  0.997: 3.291,
}

const tDistributionUsageThreshold = 30

export default {
  name: 'DataTableFluctuationVisualizer',
  components: {DataTableFluctuationCustomize, Subheader},
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      showDialog: false,
    }
  },
  computed: {
    ...mapGetters('options', ['fluctuationVisualize']),
    confidenceInterval() {
      const { item } = this
      const { stdDev, percentage } = item

      const n = this.fluctuationVisualize.n
      const z = zScores[this.fluctuationVisualize.confidence]

      let offset
      if (n <= tDistributionUsageThreshold) {
        // use t-distribution to calculate confidence interval
        offset = z * (stdDev / Math.sqrt(n))
      } else {
        offset = z * (stdDev / Math.sqrt(n))
      }

      const lowerValue = Math.max(0, (percentage - offset))
      const upperValue = Math.max(0, (percentage + offset))

      return {
        mode: 'z',
        lower: `${(lowerValue * 100).toFixed(2)}%`,
        upper: `${(upperValue * 100).toFixed(2)}%`,
        lowerAmount: (lowerValue * n).toFixed(2),
        upperAmount: (upperValue * n).toFixed(2),
        zScore: z,
      }
    },
    strings() {
      return strings
    }
  }
}
</script>

<style scoped>
.digdown-hoverable {
  cursor: help;
  border-radius: 4px;
  padding: 6px 6px 4px;
  margin: -4px;
  line-height: 1.4;
}

</style>
