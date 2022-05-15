<template>
  <v-dialog
    v-model="showDialog"
    transition="scale-transition"
    max-width="550px"
  >
    <template #activator="{ on, attrs }">
      <div
        class="d-inline-flex flex-column mr-2 digdown-hoverable transition-all"
        v-bind="attrs"
        v-on="on"
      >
        <span style="font-size: 12px;opacity: 0.8">{{ confidenceInterval.upper }}</span>
        <span style="font-size: 12px;opacity: 0.8">{{ confidenceInterval.lower }}</span>
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
        这是对本置信区间单元格内数据的简要解释。若需自定义刷取次数、置信区间等参数，请使用表头的「自定义」按钮。
      </v-card-subtitle>

      <v-card-text>
        <v-container class="pt-0">
          <v-row class="flex-column align-center">
            <div class="d-inline display-1 text-left">
              <span class="monospace">
                {{ confidenceInterval.upper }}<br>{{ confidenceInterval.lower }}
              </span>
            </div>
          </v-row>

          <v-row class="flex-column mt-4">
            <Subheader>
              概述
            </Subheader>

            <blockquote class="blockquote-box">
              如果刷取 <strong class="orange--text">{{ fluctuationVisualize.n }}</strong> 次关卡 <strong class="yellow--text">{{ strings.translate(item.stage, 'code') }}</strong> 的情况下，可根据现有数据断言以 <strong class="orange--text">{{ fluctuationVisualize.confidence * 100 }}%</strong> 之可能性，所得到物品 <strong class="yellow--text">{{ strings.translate(item.item, 'name') }}</strong> 的概率落于 <strong class="cyan--text">{{ confidenceInterval.lower }}</strong> 至 <strong class="cyan--text">{{ confidenceInterval.upper }}</strong> 之间。
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
                  样本数：<span class="monospace-pure">{{ fluctuationVisualize.n }}</span>
                </li>
                <li>
                  标准差：<span class="monospace-pure">{{ item.stdDev }}</span>
                </li>
                <li>
                  置信值：<span class="monospace-pure">{{ fluctuationVisualize.confidence * 100 }}%</span>
                </li>
                <li>
                  平均值：<span class="monospace-pure">{{ item.percentage }}</span>
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

const zScores = {
  0.9: 1.645,
  0.95: 1.96,
  0.99: 2.576,
  0.997: 3.291,
}

const tDistributionUsageThreshold = 30

export default {
  name: 'DataTableFluctuationVisualizer',
  components: {Subheader},
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

      return {
        mode: 'z',
        lower: `${Math.max(0, ((percentage - offset) * 100)).toFixed(2)}%`,
        upper: `${Math.max(0, ((percentage + offset) * 100)).toFixed(2)}%`,
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
