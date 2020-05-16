<template>
  <v-dialog
    v-model="showDialog"
    transition="scale-transition"
    max-width="850px"
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
      <Chart
        v-if="showDialog"
        :options="chartData"
        :highcharts="highchartsInst"
        class="charts mt-4"
      />
      <div class="text-center caption">
        {{ $t('stats.lastUpdated', {date: lastUpdated}) }}
      </div>
    </DialogCard>
  </v-dialog>
</template>

<script>
import formatter from "@/utils/timeFormatter";
import Theme from "@/mixins/Theme";
import DialogCard from "@/components/global/DialogCard";
import { Chart } from "highcharts-vue";
import timeFormatter from "@/utils/timeFormatter";

import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import exportDataInit from 'highcharts/modules/export-data'

exportingInit(Highcharts)
exportDataInit(Highcharts)

export default {
  name: "Charts",
  components: {DialogCard, Chart},
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
    highchartsInst () {
      return Highcharts
    },
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
      return formatter.dates(array, false);
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
    lastUpdated () {
      const last = this.$store.getters["data/updated"]({id: "trends"})
      return `${timeFormatter.date(last, true, true)} (${timeFormatter.dayjs(last).fromNow()})`
    },
    chartData () {
      if (this.showDialog) {
        const theme = this.$vuetify.theme.currentTheme

        return {
          title: {
            style: {
              color: theme.text
            },
            text: this.meta.name
          },

          subtitle: {
            style: {
              color: theme.textDarken
            },
            text: this.$t('stats.trends.name')
          },

          xAxis: {
            categories: this.xAxis,
            labels: {
              style: {
                color: theme.text
              }
            },
            title: {
              style: {
                color: theme.text
              }
            },
            crosshair: true
          },

          yAxis: [
            {
              min: 0,
              name: this.$t('stats.trends.set.rate'),
              title: {
                style: {
                  color: theme.text
                },
                text: this.$t('stats.trends.set.rate'),
              },
              labels: {
                format: '{value} %',
                style: {
                  color: theme.text
                }
              },
              opposite: true
            },
            {
              min: 0,
              name: this.$t('stats.trends.set.sample'),
              title: {
                style: {
                  color: theme.text
                },
                text: this.$t('stats.trends.set.sample'),
              },
              labels: {
                style: {
                  color: theme.text
                }
              },
              minTickInterval: 1
            }
          ],

          series: [
            {
              name: this.$t('stats.trends.set.sample'),
              type: "column",
              yAxis: 1,
              data: this.data["times"],
              color: theme.accent1
            },
            {
              name: this.$t('stats.trends.set.drops'),
              type: "column",
              yAxis: 1,
              data: this.data["quantity"],
              color: theme.accent2
            },
            {
              name: this.$t('stats.trends.set.rate'),
              type: "spline",
              yAxis: 0,
              data: this.sparklineData,
              tooltip: {
                valueSuffix: '%',
                valueDecimals: 2,
              },
              color: theme.accent3,
              marker: {
                lineWidth: 2,
                radius: 2,
                lineColor: theme.text,
                fillColor: theme.text
              },
              connectNulls: true
            }
          ],

          tooltip: {
            shared: true,
            // formatter: function () {
            //   console.log("this", this)
            //   return this.points.reduce(function (s, point, index) {
            //     console.log("reduce", s, point, index)
            //     let y = point.y
            //     if (index === 1) y = `${y.toFixed(2)} %`
            //     return `${s}<br/>${point.series.name}: ${y}`;
            //   }, `<b>${this.x}</b>`);
            // },

            // split: true,
            backgroundColor: theme.background,

            useHTML: true,
            headerFormat: '<h4 class="subtitle-1" style="margin-left: 2px">{point.key}</h4><table>',
            pointFormat: `<tr style="color: ${theme.text}"><td style="color: {series.color}">{series.name}: </td>` +
              `<td style="text-align: right"><b>{point.y}</b></td></tr>`,
            footerFormat: '</table>',

            // distance: 8,
            // padding: 5,
            style: {
              color: theme.text
            },
            crosshairs: true,
          },

          credits: {
            enabled: false
          },

          legend: {
            itemStyle: {
              color: theme.text
            }
          },

          pane: {
            background: {
              backgroundColor: theme.background
            }
          },

          chart: {
            backgroundColor: theme.background,
            style: {
              fontFamily: `"benderregular", SF Mono, "Droid Sans Mono", Ubuntu Mono, Consolas, Courier New, Courier, monospace`,
              color: theme.text
            }
          },

          plotOptions: {
            column: {
              grouping: true,
              shadow: false,
              borderWidth: 0
            }
          }
        }

      } else {
        return {}
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
