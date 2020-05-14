<template>
  <v-dialog
    v-model="showDialog"
    transition="scale-transition"
    max-width="750px"
  >
    <template v-slot:activator="{ on }">
      <slot />
      <div
        class="sparkline cursor-pointer"
        v-on="on"
      >
        <v-sparkline
          v-if="sparklineValue"
          :value="sparkline.value"
          :gradient="sparkline.gradient"
          :smooth="sparkline.radius || false"
          :padding="sparkline.padding"
          :line-width="sparkline.width"
          :stroke-linecap="sparkline.lineCap"
          :gradient-direction="sparkline.gradientDirection"
          auto-draw
          :auto-draw-duration="3000"
          auto-draw-easing="cubic-bezier(0.165, 0.84, 0.44, 1)"
        />
      </div>
    </template>
    <DialogCard
      :title="meta.name"
      :subtitle="$t('stats.trends.name')"
      @close="showDialog = false"
    >
      <Plotly
        v-if="showDialog"
        :data="plotlyData.data"
        :layout="plotlyData.layout"
        v-bind="plotlyData.options"
        class="charts my-4"
      />
    </DialogCard>
  </v-dialog>
</template>

<script>
import formatter from "@/utils/timeFormatter";
import Theme from "@/mixins/Theme";
import DialogCard from "@/components/global/DialogCard";
import { Plotly } from "vue-plotly";

export default {
  name: "Charts",
  components: {DialogCard, Plotly},
  mixins: [Theme],
  props: {
    xStart: {
      type: Number,
      default: 1
    },
    interval: {
      type: Number,
      default: 86400000
    },
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    dataKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    sparklineKey: {
      type: String,
      required: true
    },
    sparklineSubKey: {
      type: String,
      required: true
    },
    chartsId: {
      type: String,
      required: true
    },
    meta: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      initAt: Date.now(),
      showDialog: this.value
    };
  },
  computed: {
    gradient() {
      return this.dark ?
        ["rgba(255, 255, 255, .3)", "rgba(255, 255, 255, 1)"] :
        ["rgba(0, 0, 0, .3)", "rgba(0, 0, 0, 1)"]
    },
    sparkline() {
      return {
        width: 14,
        radius: 100,
        padding: 8,
        lineCap: "round",
        gradient: this.gradient,
        value: this.sparklineValue,
        gradientDirection: "left"
      };
    },
    computedChartsId() {
      return `${this.initAt.toString()}_${this.chartsId}`;
    },
    xAxis() {
      let array = this.data[this.sparklineKey].map((item, index) => {
        return new Date(this.xStart + index * this.interval);
      });
      return formatter.dates(array);
    },
    yAxis() {
      let yAxis = Object.keys(this.data)
        .map(yAxisKey => {
          if (this.dataKeys.indexOf(yAxisKey) > -1) {
            return this.data[yAxisKey];
          }
        })
        .filter(data => data != null);
      return yAxis;
    },
    sparklineData() {
      if (
        this.sparklineKey &&
        this.sparklineSubKey &&
        this.data[this.sparklineKey] &&
        this.data[this.sparklineSubKey] &&
        this.data[this.sparklineKey].length &&
        this.data[this.sparklineSubKey].length
      ) {
        let array = [];
        for (
          let index = 0;
          index < this.data[this.sparklineKey].length;
          index++
        ) {
          if (this.data[this.sparklineSubKey][index]) {
            let temp =
              this.data[this.sparklineKey][index] /
              this.data[this.sparklineSubKey][index];
            temp *= 100;
            array.push(temp);
          } else {
            array.push(null);
          }
        }
        return array;
      }
      return [];
    },
    filterSparklineData () {
      return this.sparklineData.filter(data => data !== null)
    },
    sparklineValue() {
      if (
        this.sparklineKey &&
        this.sparklineSubKey &&
        this.sparklineData.length
      ) {
        let noZeroArray = this.filterSparklineData.filter(data => data !== 0);
        let tempArray = [];
        if (noZeroArray.length > 15) {
          tempArray = noZeroArray.slice(-15);
        } else {
          tempArray = this.filterSparklineData;
        }
        if (tempArray.length > 1) {
          return tempArray;
        } else {
          return [0, 0];
        }
      } else {
        return null;
      }
    },
    plotlyData () {
      if (this.showDialog) {
        const traceArray = Object.keys(this.yAxis).map(yAxisKey => {
          return {
            x: this.xAxis,
            y: this.yAxis[yAxisKey],
            opacity: .8,
            type: "bar",
            name: this.$t('stats.trends.set.sample'),
            connectgaps: true,
          };
        });
        traceArray.push({
          x: this.xAxis,
          y: this.sparklineData,
          yaxis: "y2",
          error_y: {
            type: 'percent',
            value: 10
          },
          opacity: 1,
          line: { shape: "spline", smoothing: 0.5 },
          connectgaps: true,
          name: this.$t('stats.trends.set.rate')
        });

        return {
          data: traceArray,
          layout: {
            // width: "500px",
            // height: "500px",
            yaxis: {
              title: this.$t('stats.trends.set.sample'),
              titlefont: { color: this.$vuetify.theme.currentTheme.accent2 },
              tickfont: { color: this.$vuetify.theme.currentTheme.accent2 }
            },
            yaxis2: {
              title: this.$t('stats.trends.set.rate'),
              titlefont: { color: this.$vuetify.theme.currentTheme.accent3 },
              tickfont: { color: this.$vuetify.theme.currentTheme.accent3 },
              overlaying: "y",
              side: "right"
            },
            paper_bgcolor: this.$vuetify.theme.currentTheme.background,
            plot_bgcolor: this.$vuetify.theme.currentTheme.background,
            font: {
              color: this.$vuetify.theme.currentTheme.text,
            }
          },
          options: {
            displayLogo: false,
            toImageButtonOptions: {
              format: 'png', // one of png, svg, jpeg, webp
              filename: `penguin-stats_export-${this.chartsId}_time${new Date().getTime()}`,
              height: 1000,
              width: 1400,
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
          }
        }
      } else {
        return {
          data: [],
          layout: {},
          options: {}
        }
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
.charts-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.sparkline {
  width: 40px;
}
</style>
