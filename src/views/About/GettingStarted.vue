<template>
  <v-card
    elevation="5"
    class="bkop-medium pa-6"
  >
    <h1 class="headline d-flex align-center flex-row">
      <v-icon
        left
      >
        mdi-speedometer
      </v-icon>

      {{ $t('home.quickStart.title') }}
    </h1>

    <span class="subtitle-2 my-2 d-inline-block">
      {{ $t('home.quickStart.caption').split('\n')[0] }}
      <v-icon
        small
        class="d-inline-block mt-n1"
      >
        mdi-menu
      </v-icon>
      {{ $t('home.quickStart.caption').split('\n')[1] }}
    </span>

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        v-for="link in links"
        :key="link.title"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="3"
        class="align-self-stretch"
      >
        <BackdropCard
          hover
          :to="{name: link.route}"
          :class="{'d-flex flex-row align-center justify-center fill-height': link.wide}"
        >
          <template #backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <template v-if="link.wide">
            <v-icon
              x-large
              style="opacity: 0.9"
            >
              {{ link.icon }}
            </v-icon>

            <h2
              class="ml-0 mr-2"
              :class="{'subtitle-2 font-weight-bold': $vuetify.breakpoint.xsOnly, 'heading my-1': !$vuetify.breakpoint.xsOnly}"
            >
              {{ renderTranslation(link.title) }}
            </h2>

            <span class="caption font-italic">
              {{ $t('meta.quotation.start') }}{{ renderTranslation(link.subtitle) }}{{ $t('meta.quotation.end') }}
            </span>
          </template>
          <template v-else>
            <v-icon
              x-large
              style="opacity: 0.9"
            >
              {{ link.icon }}
            </v-icon>

            <h2 :class="{'subtitle-2 font-weight-bold mt-1': $vuetify.breakpoint.xsOnly, 'heading my-1': !$vuetify.breakpoint.xsOnly}">
              {{ renderTranslation(link.title) }}
            </h2>

            <span class="caption font-italic">
              {{ $t('meta.quotation.start') }}{{ renderTranslation(link.subtitle) }}{{ $t('meta.quotation.end') }}
            </span>
          </template>
        </BackdropCard>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BackdropCard from '@/components/global/BackdropCard'
export default {
  name: 'GettingStarted',
  components: { BackdropCard },
  data () {
    return {
      links: [
        {
          route: 'StatsByItem',
          icon: 'mdi-treasure-chest',
          title: 'home.quickStart.title.byItem',
          subtitle: 'home.quickStart.subtitle.byItem'
        },
        {
          route: 'StatsByStage',
          icon: 'mdi-cube',
          title: 'home.quickStart.title.byStage',
          subtitle: 'home.quickStart.subtitle.byStage'
        },
        {
          route: 'ReportByZone',
          icon: 'mdi-upload',
          title: 'home.quickStart.title.report',
          subtitle: 'home.quickStart.subtitle.report'
        },
        {
          route: 'Planner',
          icon: 'mdi-directions-fork',
          title: 'home.quickStart.title.planner',
          subtitle: 'home.quickStart.subtitle.planner'
        },
      ]
    }
  },
  methods: {
    renderTranslation (t) {
      return this.$t(t)
    }
  }
}
</script>

<style scoped>
  /*.theme--light .backdrop-card {*/
  /*  background: rgba(250, 250, 250, .9) !important;*/
  /*}*/

  /*.theme--dark .backdrop-card {*/
  /*  background: rgba(30, 30, 30, .9) !important;*/
  /*}*/
</style>
