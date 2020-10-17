<template>
  <v-card
    hover
    :ripple="!stateful"
    :class="{'d-inline-flex ma-1 stage-card cursor-pointer': true, 'stage-card--stateless': !stateful, 'stage-card--light': !dark, 'stage-card--dark': dark, 'stage-card--chosen': stateful, 'stage-card--chosen-true': chosen, 'stage-card--chosen-false': !chosen, 'stage-card--transparent': transparent }"
  >
    <v-card-title
      class="py-1 px-3"
      :class="{'pl-2 pr-3': left, 'pl-3 pr-2': right, 'subtitle-1': !dense, 'subtitle-2': dense}"
    >
      <v-icon
        v-if="left"
        small
        class="mr-1"
        color="grey"
      >
        mdi-page-previous
      </v-icon>
      <v-icon
        v-if="stateful"
        class="stage-card--chosen-icon"
        :size="18"
      >
        {{ chosen ? 'mdi-check' : 'mdi-close' }}
      </v-icon>
      <StageCode :code="translatedCode" />
      <v-icon
        v-if="right"
        small
        class="ml-1"
        color="grey"
      >
        mdi-page-next
      </v-icon>
    </v-card-title>
  </v-card>
</template>

<script>
  import StageCode from "@/components/stats/StageCode";
  import Theme from "@/mixins/Theme";
  import strings from "@/utils/strings";

  export default {
    name: "StageCard",
    components: {StageCode},
    mixins: [Theme],
    props: {
      stage: {
        type: Object,
        required: true
      },
      chosen: {
        type: Boolean,
        default () {
          return null
        }
      },
      dense: {
        type: Boolean,
        default () {
          return false
        }
      },
      transparent: {
        type: Boolean,
        default: () => false
      },
      left: {
        type: Boolean,
        default () {
          return false
        }
      },
      right: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    computed: {
      stateful() {
        return this.chosen !== null;
      },
      translatedCode () {
        return strings.translate(this.stage, "code")
      }
    },
  }
</script>

<style scoped>
  .stage-card {
    transition: transform 75ms ease-out, box-shadow 75ms ease-out, background 100ms ease-out, opacity 100ms cubic-bezier(0,.8,.2,1) !important;
    user-select: none;
  }
  .stage-card:active {
    /*transform: translateY(0.5px);*/
    box-shadow: 0 0 3px rgba(0, 0, 0, .5);
  }

  .stage-card--stateless:hover {
    transform: translateY(-0.5px);
  }

  .stage-card--stateless:active {
    transform: translateY(0.5px);
  }

  .stage-card--light {
    background: rgba(224, 224, 224, 0.95);
    border: 1px solid rgba(32, 32, 32, 0.95) !important;
  }
  .stage-card--dark {
    background: rgba(32, 32, 32, 0.95);
    border: 1px solid rgba(224, 224, 224, 0.95) !important;
  }

  .stage-card--chosen {
    overflow: hidden;
  }
  .stage-card--chosen .stage-card--chosen-icon {
    position: absolute;
    bottom: -.05rem;
    right: -.02rem;
    user-select: none;
    z-index: 0;
    text-shadow: 0 0 2px rgba(0, 0, 0, .3);
  }
  .theme--light .stage-card--chosen-icon {
    color: black;
    text-shadow: 0 0 2px rgba(255, 255, 255, .3);
  }

  .stage-card--chosen.stage-card--chosen-true {
    opacity: .9
  }
  .stage-card--chosen.stage-card--chosen-true:hover {
    opacity: 1
  }

  .theme--light .stage-card--chosen.stage-card--chosen-true {
    background: rgb(206, 229, 203)
  }
  .theme--dark .stage-card--chosen.stage-card--chosen-true{
    background: rgb(49, 92, 40)
  }

  .theme--light .stage-card--chosen.stage-card--chosen-false {
    background: rgb(247, 208, 211)
  }
  .theme--dark .stage-card--chosen.stage-card--chosen-false {
    background: rgb(128, 59, 51)
  }

  .stage-card--transparent {
    background: transparent !important;
  }
</style>