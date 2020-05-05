<template>
  <span>
    <span
      v-for="[index, code] in codes.entries()"
      :key="index"
      :class="generateStyle(code.s).c"
      :style="generateStyle(code.s).s"
    >{{ code.t }}</span>
  </span>
</template>

<script>
  import Theme from "@/mixins/Theme";

  const s = {
    separator: -1,
    S: 0,
    prefix: 1,
    middle: 2,
    stage: 3
  }

  export default {
    name: "StageCode",
    mixins: [Theme],
    props: {
      code: {
        type: String,
        required: true
      },
    },
    computed: {
      codes () {
        const segments = this.code.split("-");
        let results = [];
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

        return results.map(el => {
          el.st = this.generateStyle(el.s)
          return el
        })
      }
    },
    methods: {
      generateStyle(type) {
        if (type === s.separator) return {c: ["grey--text"]}
        if (type === s.S) return {c: ["font-weight-bold", this.dark ? "pink--text" : "orange--text text--darken-3"]}
        if (type === s.prefix) return {c: ["grey--text text--darken-1"]}
        if (type === s.middle) return {c: ["grey--text", this.dark ? "text--lighten-2" : "text--darken-3"]}
        if (type === s.stage) return {c: ["font-weight-black", this.dark ? "yellow--text text--lighten-2" : "black--text"]}
      }
    },
  }
</script>

<style scoped>

</style>