<template>
  <v-card
    hover
    ripple
    :class="{'d-inline-flex ma-1 stage-card cursor-pointer': true, 'stage-card--light': !dark, 'stage-card--dark': dark }"
  >
    <v-card-title class="subtitle-1 py-1 px-3">
      <span
        v-for="[index, code] in codes.entries()"
        :key="index"
        :class="generateStyle(code.s).c"
        :style="generateStyle(code.s).s"
      >
        {{ code.t }}
      </span>
    </v-card-title>
  </v-card>
</template>

<script>
  const s = {
    separator: -1,
    S: 0,
    prefix: 1,
    middle: 2,
    stage: 3
  }
  export default {
    name: "StageCard",
    props: {
      stage: {
        type: Object,
        required: true
      }
    },
    computed: {
      dark() {
        return this.$vuetify.theme.dark;
      },
      codes () {
        const segments = this.stage.code.split("-");
        const results = [];
        // format: []{s: (style), t: (text)}

        if (segments.length === 1) {
          results.push({
            s: s.stage,
            t: segments[0]
          })
          return results
        }

        for (const [index, segment] of segments.entries()) {
          if (index === 0) {
            // e.g. S4-1 S4-2
            if (segment[0] === "S" && Number.isInteger(+segment[1])) {
              results.push({
                s: s.S,
                t: "S"
              });
              results.push({
                s: s.prefix,
                t: segment.slice(1)
              });
            } else {
              results.push({
                s: s.prefix,
                t: segment
              })
            }
          } else if (index === 1) {
            if (Number.isInteger(+segment.slice(-1))) {
              // is stage code
              results.push({
                s: s.stage,
                t: segment
              })
            } else {
              // e.g. SW-EV-1
              results.push({
                s: s.middle,
                t: segment
              })
            }
          } else if (index === 2) {
            // e.g. SW-EV-1
            results.push({
              s: s.stage,
              t: segment
            })
          }

          if (index !== segments.length - 1) {
            results.push({
              s: s.separator,
              t: "-"
            })
          }
        }
        return results
      }
    },
    methods: {
      generateStyle(type) {
        if (type === s.separator) return {c: ["grey--text"]}
        if (type === s.S) return {c: ["font-weight-bold", this.dark ? "pink--text" : "orange--text text--darken-3"]}
        if (type === s.prefix) return {c: ["grey--text", this.dark ? "text--darken-1" : ""]}
        if (type === s.middle) return {c: ["grey--text", this.dark ? "text--lighten-2" : "text--darken-3"]}
        if (type === s.stage) return {c: ["font-weight-black", this.dark ? "yellow--text text--lighten-2" : "black--text"]}
      }
    },
  }
</script>

<style scoped>
  .stage-card {
    transition: transform 50ms ease-out, box-shadow 35ms ease-out, background 100ms ease-out !important;
    user-select: none;
  }
  .stage-card:hover {
    transform: translateY(-0.5px);
  }
  .stage-card:active {
    transform: translateY(0.5px);
    box-shadow: 0px 0px 3px rgba(0, 0, 0, .5); /*  0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, .9), 0 0 45px rgba(255, 255, 255, .7), 0 0 60px 100px rgba(255, 255, 255, .5) */
  }
  .stage-card--light {
    background: rgba(224, 224, 224, 0.8);
    border: 1px solid rgba(32, 32, 32, 0.95);
  }
  .stage-card--dark {
    background: rgba(32, 32, 32, 0.8);
    border: 1px solid rgba(224, 224, 224, 0.95);
  }
</style>