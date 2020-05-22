<template>
  <v-select
    :value="value"
    hide-details
    prepend-icon="mdi-progress-clock"

    :menu-props="{ offsetY: true }"
    filled
    :items="intervals"
    :label="$t('query.selector.interval.title')"
    transition="slide-y-transition"
    class="mt-1"

    @input="update"
  >
    <template v-slot:item="{item}">
      {{ item.text }}
      <v-spacer />
      <v-icon v-if="item.value === value">
        mdi-check
      </v-icon>
    </template>

    <template v-slot:selection="{item}">
      {{ item.text }}
    </template>
  </v-select>
</template>

<script>
  import timeFormatter from "@/utils/timeFormatter";

  export default {
    name: "QuerySelectorInterval",
    props: {
      // eslint-disable-next-line vue/require-prop-types
      value: {
        default () {
          return null
        }
      },
    },
    data() {
      return {
        selected: this.$store.getters["dataSource/source"]
      }
    },
    computed: {
      intervals() {
        const intervals = [
          [1, "hour"],
          [6, "hour"],
          [12, "hour"],
          [1, "day"],
          [4, "day"],
          [1, "week"],
          [2, "week"],
          [3, "week"],
          [1, "month"]
        ].map(interval => {
          const duration = timeFormatter.dayjs.duration(...interval)
          return {
            value: duration.asMilliseconds(),
            text: duration.locale(this.$i18n.locale).humanize()
          }
        })

        intervals.unshift({
          value: null,
          text: this.$t('query.selector.interval.unspecified')
        })

        return intervals
      },
      // formattedValue () {
      //   const humanized = timeFormatter.dayjs.duration(this.value, 'hour').locale(this.$i18n.locale).humanize()
      //   console.log(humanized)
      //   return humanized
      // }
    },
    methods: {
      update(e) {
        this.$emit('input', e)
        this.$emit('update:type', e === null ? "matrix" : "trend")
      }
    },
  }
</script>

<style scoped>

</style>