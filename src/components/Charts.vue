<template>
  <v-dialog
    v-model="value"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <slot />
      <div
        class="skyline"
        v-on="on"
      >
        <v-sparkline
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
          @click="value = !value"
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
import Plotly from "plotly.js-dist";
export default {
  name: "Charts",
  props: {
    value: {
      type: Boolean,
      default: false
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
    },
    gradient: {
      type: Array,
      default: () => {
        return ["white"];
      }
    }
  },
  data() {
    return {
      initDate: new Date()
    };
  },
  computed: {
    sparkline() {
      return {
        width: 10,
        radius: 10,
        padding: 8,
        lineCap: "round",
        gradient: this.gradient,
        value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
        gradientDirection: "top"
      };
    },
    computedChartsId() {
      return `${this.initDate.getTime().toString()}_${this.chartsId}`;
    }
  },
  watch: {},
  mounted() {
    var trace1 = {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: "scatter"
    };

    var trace2 = {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: "scatter"
    };

    var layout = {
      width: this.width,
      height: this.height,
      showlegend: false
    };

    var data = [trace1, trace2];

    Plotly.newPlot(this.computedChartsId, data, layout);
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
.skyline {
  width: 40px;
  margin-left: 5px;
}
</style>
