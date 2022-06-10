<template>
  <v-dialog
    v-model="showDialog"
    transition="scale-transition"
    max-width="550px"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        x-small
        text
        rounded
        outlined
        v-bind="attrs"
        v-on="on"
      >
        <v-icon
          x-small
          left
        >
          mdi-wrench
        </v-icon>
        自定义参数
      </v-btn>
    </template>

    <v-card class="pt-1">
      <v-card-title class="headline">
        <v-icon left>
          mdi-wrench
        </v-icon>
        置信区间自定义
      </v-card-title>

      <v-card-subtitle class="mt-0">
        在此处自定义置信区间的计算参数后，统计结果表格将会自动更新。
      </v-card-subtitle>

      <v-card-text>
        <v-container class="pt-0">
          <v-row class="flex-column">
            <Subheader>
              样本量
            </Subheader>

            <div
              class="d-inline-flex flex-wrap"
              style="gap: 8px"
            >
              <v-btn-toggle
                v-model="n"
                mandatory
              >
                <v-btn
                  v-for="nPreset in nPresets"
                  :key="nPreset.value"
                  text
                  outlined
                  :value="nPreset.value"
                >
                  <div class="d-flex flex-column">
                    <span>{{ nPreset.text }}</span>
                    <div
                      v-if="nPreset.typical"
                      class="d-flex overline"
                    >
                      通常值
                    </div>
                  </div>
                </v-btn>
              </v-btn-toggle>
            </div>

            <div class="caption mt-2">
              样本量越<strong class="orange--text">大</strong>，置信区间越<strong class="orange--text">窄</strong>
            </div>
          </v-row>

          <v-row class="flex-column mt-4">
            <Subheader>
              置信值
            </Subheader>

            <div
              class="d-inline-flex flex-wrap"
              style="gap: 8px"
            >
              <v-btn-toggle
                v-model="confidence"
                mandatory
              >
                <v-btn
                  v-for="confidencePreset in confidencePresets"
                  :key="confidencePreset.value"
                  text
                  outlined
                  :value="confidencePreset.value"
                >
                  <div class="d-flex flex-column">
                    <span>{{ confidencePreset.text }}</span>
                    <div
                      v-if="confidencePreset.typical"
                      class="d-flex overline"
                    >
                      通常值
                    </div>
                  </div>
                </v-btn>
              </v-btn-toggle>
            </div>

            <div class="caption mt-2">
              置信值越<strong class="orange--text">低</strong>，置信区间越<strong class="orange--text">窄</strong>
            </div>
          </v-row>

          <v-row class="flex-column mt-4">
            <Subheader>
              计算概要
            </Subheader>

            <blockquote class="blockquote-box">
              本列将计算：如果刷取 <strong class="orange--text">{{ nPresets.find(el => el.value === n).text }}</strong> 次此关卡的情况下，可根据现有数据断言以 <strong class="orange--text">{{ confidencePresets.find(el => el.value === confidence).text }}</strong> 之可能性，所得到的物品概率落于 [表内计算结果] 的所示区间内。
            </blockquote>
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
import Theme from "@/mixins/Theme";

export default {
  name: "DataTableFluctuationCustomize",
  components: {Subheader},
  mixins: [Theme],
  data() {
    return {
      showDialog: false,
      nPresets: [30, 50, 100, 200, 500].map(el => ({
        value: el,
        text: el,
        typical: el === 100,
      })),
      confidencePresets: [0.9, 0.95, 0.99, 0.997].map(el => ({
        value: el,
        text: `${el * 100}%`,
        typical: el === 0.95,
      })),
    }
  },
  computed: {
    ...mapGetters('options', ['fluctuationVisualize']),
    n: {
      get() {
        return this.$store.getters['options/fluctuationVisualize'].n;
      },
      set(value) {
        this.$store.commit('options/changeFluctuationVisualizeN', value);
      }
    },
    confidence: {
      get() {
        return this.$store.getters['options/fluctuationVisualize'].confidence;
      },
      set(value) {
        this.$store.commit('options/changeFluctuationVisualizeConfidence', value);
      }
    }
  }
}
</script>

<style scoped>
em {
  font-weight: bold;
}

</style>
