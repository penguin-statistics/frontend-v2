<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="slide-y-transition"
    offset-y
    min-width="350px"
    max-width="700px"
    max-height="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="formattedDate"
        :label="`${$t('query.selector.timeRange.title')} (*${$t('validator.required')})`"
        prepend-icon="mdi-calendar"
        readonly
        filled
        hide-details
        class="mb-1"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-card
      color="background"
      class="d-flex flex-column"
      :elevation="12"
    >
      <v-date-picker
        v-model="date"
        :max="today"
        min="2019-04-30"
        :no-title="$vuetify.breakpoint.smAndDown"
        :landscape="!$vuetify.breakpoint.smAndDown"
        range
        full-width

        color="indigo"
        :day-format="dayFormatter"

        :title-date-format="titleDateFormatter"
      />
      <div class="flex-row flex-wrap ma-2">
        <Subheader class="mx-2">
          {{ $t('query.selector.timeRange.presets.title') }}
        </Subheader>
        <QuerySelectorTimeRangePresetPeriod
          v-for="(period, i) in periods"
          :key="i"
          :period="period"
          class="d-inline-flex ma-1"
          @update:selection="selectPeriod"
        />
      </div>
    </v-card>
  </v-menu>
</template>

<script>
  import timeFormatter from "@/utils/timeFormatter";
  import QuerySelectorTimeRangePresetPeriod
    from "@/components/advancedQuery/selectors/QuerySelectorTimeRangePresetPeriod";
  import get from "@/utils/getters"
  import Subheader from "@/components/global/Subheader";

  export default {
    name: "QuerySelectorTimeRange",
    components: {Subheader, QuerySelectorTimeRangePresetPeriod},
    props: {
      value: {
        type: Array,
        required: true
      },
      server: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        menu: false,
      }
    },
    computed: {
      date: {
        get () {
          return this.value
        },
        set (val) {
          let setTo;
          if (val) {
            if (val.length === 0) {
              this.$emit('input', [])
            } else if (val.length === 1) {
              this.$emit('input', val)
            } else if (val.length === 2) {
              const first = new Date(val[0]).getTime()
              const second = new Date(val[1]).getTime()

              if (second < first) {
                this.$emit('input', [val[1], val[0]])
              } else {
                this.$emit('input', val)
              }
            }
          } else {
            this.$emit('input', setTo)
          }
        }
      },
      formattedDate () {
        const start = this.date[0] ? this.date[0] : null
        const end = this.date[1] ? this.date[1] : null
        return timeFormatter.startEnd(start, end, true)
      },
      today () {
        return timeFormatter.dayjs().format("YYYY-MM-DD")
      },
      periods () {
        return get.period.all(this.server)
      }
    },
    methods: {
      dayFormatter (val) {
        return val.split("-")[2]
      },
      titleDateFormatter () {
        return this.formattedDate
      },
      selectPeriod (period) {
        const utcDate = new Date(period).toISOString().substr(0, 10)
        if (this.date.length < 2) {
          this.date = [...this.date, utcDate]
        } else {
          this.date = [utcDate]
        }
      }
    }
  }
</script>

<style scoped>

</style>