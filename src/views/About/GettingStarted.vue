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
        :sm="link.wide ? 12 : 6"
        :md="link.wide ? 12 : 6"
        :lg="link.wide ? 12 : 6"
        :xl="link.wide ? 12 : 3"
        class="align-self-stretch"
      >
        <BackdropCard
          hover
          v-bind="linkOf(link)"
          :class="{'d-flex flex-row align-center justify-center fill-height': isWide(link)}"
        >
          <template #backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <template v-if="isWide(link)">
            <v-icon
              x-large
              style="opacity: 0.9"
            >
              {{ link.icon }}
            </v-icon>

            <h2 class="heading mx-3 my-1">
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
import { mcpGuideUrl } from '@/utils/mcp'
export default {
  name: 'GettingStarted',
  components: { BackdropCard },
  data () {
    return {
      links: [
        {
          route: 'StatsByItem',
          icon: 'mdi-treasure-chest',
          title: 'home.quickStart.actions.title.byItem',
          subtitle: 'home.quickStart.actions.subtitle.byItem'
        },
        {
          route: 'StatsByStage',
          icon: 'mdi-cube',
          title: 'home.quickStart.actions.title.byStage',
          subtitle: 'home.quickStart.actions.subtitle.byStage'
        },
        {
          route: 'ReportByZone',
          icon: 'mdi-upload',
          title: 'home.quickStart.actions.title.report',
          subtitle: 'home.quickStart.actions.subtitle.report'
        },
        {
          route: 'Planner',
          icon: 'mdi-directions-fork',
          title: 'home.quickStart.actions.title.planner',
          subtitle: 'home.quickStart.actions.subtitle.planner'
        },
        {
          href: mcpGuideUrl,
          icon: 'mdi-robot',
          title: 'home.quickStart.actions.title.mcp',
          subtitle: 'home.quickStart.actions.subtitle.mcp',
          wide: true
        }
      ]
    }
  },
  methods: {
    // a route, or an external page (href: a function that returns its URL) to open in a new tab
    linkOf (link) {
      if (link.route) return { to: { name: link.route } }
      return { href: link.href(), target: '_blank', rel: 'noopener' }
    },
    // a wide card puts its title beside the icon, which would not fit on phones: there it is like the others
    isWide (link) {
      return link.wide && !this.$vuetify.breakpoint.xsOnly
    },
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
