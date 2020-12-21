<template>
  <div class="chart-container">
    <Chart
      :options="chartData"
      :highcharts="hcInst"
      class="chart my-2"
    />
  </div>
</template>

<script>
import get from "@/utils/getters";

import { Chart } from "highcharts-vue";

import Highcharts from 'highcharts'

export default {
  name: "StagePatternPieChart",
  components: {Chart},
  props: {
    patterns: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      hcInst: Highcharts
    }
  },
  computed: {
    items() {
      return this.patterns.map(el => {
        return {
          ...el,
          pattern: el.pattern.drops.map(ell => ({
            ...ell,
            item: get.items.byItemId(ell.itemId),
          }))
        }
      })
    },

    chartData () {
      const theme = this.$vuetify.theme.currentTheme
      const self = this

      const config = {
        chart: {
          type: 'pie',
          backgroundColor: "rgba(0, 0, 0, 0)",
          style: {
            fontFamily: `"benderregular", SF Mono, "Droid Sans Mono", Ubuntu Mono, Consolas, Courier New, Courier, monospace`,
            color: theme.text
          },
          // width: 400
        },

        title: {
          style: {
            display: "none"
          },
        },

        series: [
          {
            name: "pattern",
            data: this.items.map(el => {
              const patterns = []
              for (const pattern of el.pattern) patterns.push(`${pattern.quantity}×${pattern.item.name}`)

              return {
                i: el.i,
                name: patterns.join(" + ") || this.$t('pattern.empty'),
                y: el.percentage * 100,
                percentageText: el.percentageText,
                quantity: el.quantity
              }
            }),

            dataLabels: {
              formatter: function () {
                let label = ''
                if (this.point.i <= 3) label = `${this.key}<br />`
                return this.point.i <= 10 ? label + `#${this.point.i} — ${this.percentage.toFixed(1)} %` : null;
              },
              distance: -30,
              enabled: true
            }
          }
        ],

        tooltip: {
          // formatter: function () {
          //   return `<h4 class="subtitle-1">${this.key}</h4><span>掉落数：${this.point.quantity}</span><br /><span>百分比：${this.y.toFixed(2)}%</span>`
          // },

          // split: true,
          backgroundColor: theme.background,

          useHTML: true,
          headerFormat: '<h4 class="subtitle-1" style="margin-left: 2px">{point.key}</h4><table>',
          pointFormat: `<tr style="color: ${theme.text}">
  <td style="color: {series.color}; padding-right: .25rem">${this.$t('stats.headers.quantity')}: </td><td style="text-align: right; transform: translateY(1px)"><b>{point.quantity}</b></td>
</tr>
<tr style="color: ${theme.text}">
  <td style="color: {series.color}; padding-right: .25rem">${this.$t('stats.headers.percentage')}: </td><td style="text-align: right; transform: translateY(1px)"><b>{point.percentageText}</b></td>
</tr>`,
          footerFormat: '</table>',

          distance: 8,
          // padding: 5,
          style: {
            color: theme.text
          },
          crosshairs: [true, true]
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

        plotOptions: {
          pie: {
            shadow: false,
            // allowPointSelect: true,
            // cursor: 'pointer',
            // dataLabels: {
            //   enabled: true,
            //   format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            // }
          },
          series: {
            point: {
              events: {
                mouseOver: function() {
                  self.$emit('update:active', this.options.i)
                },
                mouseOut: function() {
                  self.$emit('update:active', 0)
                }
              }
            }
          }
        },

        exporting: { enabled: false },
      }

      // console.log(config)

      return config
    }
  },
}
</script>

<style scoped lang="scss">
//.chart-container {
//  position: relative;
//  width: 100%;
//  height: 100%;
//  min-height: 300px;
//}
//
//.chart {
//  position: absolute;
//  width: 100%;
//}
</style>