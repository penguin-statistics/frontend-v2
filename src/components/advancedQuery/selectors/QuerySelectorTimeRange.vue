<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="slide-y-transition"
    offset-y
    min-width="350px"
    max-width="650px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :value="formattedDate"
        label="时间段"
        prepend-icon="mdi-calendar"
        readonly
        filled
        hide-details
        class="mb-1"
        v-on="on"
      />
    </template>
    <v-card
      color="background"
      class="d-flex flex-row"
    >
      <!--      <v-card-title class="heading">-->
      <!--        选择时间段-->
      <!--      </v-card-title>-->
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
      <v-list
        subheader
        two-line
        min-width="170px"
      >
        <v-subheader>
          预设时间
        </v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Item 1
            </v-list-item-title>
            <v-list-item-subtitle>
              19.4.30 - 20.1.1
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>
              mdi-calendar-import
            </v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Item 2
            </v-list-item-title>
            <v-list-item-subtitle>
              19.9.1 - 20.4.5
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>
              mdi-calendar-import
            </v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Item 3
            </v-list-item-title>
            <v-list-item-subtitle>
              19.8.5 - 20.5.1
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>
              mdi-calendar-import
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
  import timeFormatter from "@/utils/timeFormatter";

  export default {
    name: "QuerySelectorTimeRange",
    data() {
      return {
        menu: false,
        internalDate: [timeFormatter.dayjs().format("YYYY-MM-DD")],
      }
    },
    computed: {
      date: {
        get () {
          return this.internalDate
        },
        set (val) {
          let setTo;
          if (val) {
            if (val.length === 0) {
              this.internalDate = []
            } else if (val.length === 1) {
              this.internalDate = val
            } else if (val.length === 2) {
              const first = new Date(val[0]).getTime()
              const second = new Date(val[1]).getTime()

              if (second < first) {
                this.internalDate = [val[1], val[0]]
              } else {
                this.internalDate = val
              }
            }
          } else {
            this.internalDate = setTo
          }
        }
      },
      formattedDate () {
        const start = this.date[0] ? this.date[0] : null
        const end = this.date[1] ? this.date[1] : null
        return timeFormatter.startEnd(start, end)
      },
      today () {
        return timeFormatter.dayjs().format("YYYY-MM-DD")
      }
    },
    methods: {
      dayFormatter (val) {
        return val.split("-")[2]
      },
      titleDateFormatter () {
        return this.formattedDate
      }
    }
  }
</script>

<style scoped>

</style>