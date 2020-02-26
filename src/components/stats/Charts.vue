<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <slot />
      <div
        class="sparkline"
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
        />
      </div>
    </template>
    <div class="charts-wrapper">
      <v-toolbar>
        <v-toolbar-title>Charts</v-toolbar-title>

        <v-spacer />

        <v-btn
          icon
          @click="showDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div
        :id="computedChartsId"
        class="charts"
      />
    </div>
  </v-dialog>
</template>

<script>
import Plotly from "@/vendors/plotly";
import formatter from "@/utils/timeFormatter";
export default {
  name: "Charts",
  props: {
    xStart: {
      type: Number,
      default: 1
    },
    interval: {
      type: Number,
      default: 1
    },
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return [10, 15, 13, 17];
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
    height: {
      type: Number,
      default: window.innerHeight - 64 // minus toolbar height
    },
    width: {
      type: Number,
      default: window.innerWidth
    }
  },
  data() {
    return {
      initDate: new Date(),
      showDialog: this.value
    };
  },
  computed: {
    gradient() {
      return this.$store.getters['settings/dark'] ? ["white"] : ["black"];
    },
    sparkline() {
      return {
        width: 10,
        radius: 100,
        padding: 0,
        lineCap: "round",
        gradient: this.gradient,
        value: this.sparklineValue,
        gradientDirection: "top"
      };
    },
    computedChartsId() {
      return `${this.initDate.getTime().toString()}_${this.chartsId}`;
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
        return [1, 1];
      }
    }
  },
  watch: {
    showDialog(value) {
      if (value) {
        const traceArray = Object.keys(this.yAxis).map(yAxisKey => {
          return {
            x: this.xAxis,
            y: this.yAxis[yAxisKey],
            opacity: 0.3,
            type: "bar",
            name: yAxisKey,
            connectgaps: true
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
          line: { shape: "spline", smoothing: 0.8 },
          connectgaps: true,
          name: "rate"
        });
        let layout = {
          width: this.width,
          height: this.height,
          yaxis: { title: "Samples" },
          yaxis2: {
            title: "Rate",
            titlefont: { color: "rgb(148, 103, 189)" },
            tickfont: { color: "rgb(148, 103, 189)" },
            overlaying: "y",
            side: "right"
          }
        };

        let data = traceArray;

        Plotly.newPlot(this.computedChartsId, data, layout);
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
.charts-wrapper {
  width: 100%;
  height: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  flex-direction: column;
}
.sparkline {
  width: 40px;
  margin-left: 5px;
}
</style>
