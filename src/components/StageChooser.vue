<template>
  <v-card>
    <v-window v-model="step">
      <v-window-item :value="1">

        <v-container fluid grid-list-lg>
          <v-data-iterator
              :items="firstLevelStages"
              :rows-per-page-items="[-1]"
              :pagination.sync="pagination"
              content-tag="v-layout"
              hide-actions
              row
              wrap
          >
            <template v-slot:item="props">
              <v-flex
                  :xs6="props.item.type !== 'ACTIVITY'"
                  :xs12="props.item.type === 'ACTIVITY'"

                  :sm4="props.item.type !== 'ACTIVITY'"
                  :sm8="props.item.type === 'ACTIVITY'"

                  :md3="props.item.type !== 'ACTIVITY'"
                  :md6="props.item.type === 'ACTIVITY'"

                  :lg4="props.item.type === 'ACTIVITY'"
                  :lg3="props.item.type === 'WEEKLY'"
                  :lg2="props.item.type === 'MAINLINE'"
              >
                <v-card
                    :class="{ 'lighten-3': true, indigo: props.item.type === 'MAINLINE', blue: props.item.type === 'WEEKLY', red: props.item.type === 'ACTIVITY' }"
                    @click="selectedZone(props.item.zoneId)"
                >
                  <v-card-title>
                    <h4 class="headline">{{ props.item.zoneName }}</h4>
                  </v-card-title>

                  <v-card-media>
                    <v-img :src="getImage(props.item.zoneId)" :aspect-ratio="props.item.type === 'ACTIVITY' ? props.item.type === 'WEEKLY' ? 1.5 : 2 : 1" />
                  </v-card-media>

                  <v-card-actions v-if="props.item.type === 'ACTIVITY'">
                    <p>{{ $t('openAt') }}{{ new Date(props.item.openTime).toLocaleString() }}</p>
                    <p>{{ $t('closeAt') }}{{ new Date(props.item.closeTime).toLocaleString() }}</p>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </template>
          </v-data-iterator>
        </v-container>

      </v-window-item>

      <v-window-item :value="2">
        <span class="zoneNameHighlight">
          {{ this.zoneSelected.zoneName || '' }}
        </span>
        <v-data-iterator
            :items="secondLevelStages"
            :rows-per-page-items="[-1]"
            :pagination.sync="pagination"
            content-tag="v-layout"
            hide-actions
            row
            wrap
        >
          <template v-slot:item="props">
            <v-flex
                xs3 sm3 md2 lg1
            >
              <v-card
                  @click="selectedStage(props.item.stageId)"
              >
                <v-card-title>
                  <h4 class="headline">{{ props.item.code }}</h4>
                </v-card-title>
              </v-card>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-3 text-xs-center">
          <v-img
              class="mb-3"
              contain
              height="128"
              src="https://cdn.vuetifyjs.com/images/logos/v.svg"
          >
            <template v-slot:placeholder>
              <v-layout
                  fill-height
                  align-center
                  justify-center
                  ma-0
              >
                <v-progress-circular indeterminate color="grey darken-5"></v-progress-circular>
              </v-layout>
            </template>
          </v-img>
          <h3 class="title font-weight-light mb-2">Welcome to Vuetify</h3>
          <span class="caption grey--text">Thanks for signing up!</span>
        </div>
      </v-window-item>
    </v-window>

    <v-divider v-if="step !== 1" />

    <v-card-actions>
      <v-btn
          v-if="step !== 1"
          flat
          @click="step--"
      >
        Back
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script>
  import get from '@/utils/getters'
  export default {
    name: "StageChooser",
    data: () => ({
      step: 1,
      pagination: {
        rowsPerPage: -1,
        // sortBy: "zoneIndex"
      },
      zoneSelected: {}
    }),
    methods: {
      getImage(id) {
        try {
          return require(`../assets/zonePageBackgrounds/${id}.png`)
        } catch {
          return 'http://unsplash.it/512/512?image=' + Math.floor(Math.random() * 100)
        }
      },
      selectedZone (zoneId) {
        this.step += 1
        this.zoneSelected = zoneId
      }
    },
    computed: {
      firstLevelStages () {
        return get.zones.all()
      },
      secondLevelStages () {
        return get.stages.byParentZoneId(this.zoneSelected)
      }
    }
  }
</script>

<style scoped>
  .zoneTitle {
    position: absolute;
    top: -15px;
    left: 2em;
    background: #000000;
    padding: 4px 2em;
    font-size: 16px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, .75)
  }

  .theme--light .zoneTitle {
    color: #fff;
  }

  .zoneNameHighlight{
    position: absolute;
    left: .5em;
    bottom: .5em;
    font-size: calc(108px + 16 * (100vw - 600px) / 500);
    color: rgba(100, 100, 100, 0.9);
    user-select: none;
  }
</style>