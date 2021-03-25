<template>
  <v-card
    outlined
    :color="
      hasException
        ? (dark ? 'rgba(241,97,87,0.5)' : 'rgba(241,97,87,0.3)')
        : ''"
    style="width: 100%; transition: all .225s cubic-bezier(0.165, 0.84, 0.44, 1);"
    :style="{'opacity': (!selected && !hasException) ? 0.6 : 1}"
    class="transition-all align-self-stretch fill-height d-flex flex-column justify-start overflow-hidden"
  >
    <div class="bkop-medium">
      <v-img
        v-ripple
        :src="result.blobUrl"
        contain
        style="cursor: zoom-in"
        min-height="120px"
        max-height="240px"
        class="unknown-ratio-glow"
        @click="$emit('popup', result.blobUrl)"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height caption">
            {{ $t('report.recognition.confirm.loadingImage') }}
          </div>
        </template>
        <template #default>
          <div class="d-flex flex-row full-width justify-end fallthrough">
            <span
              class="monospace font-weight-bold bkop-medium text-right border-outlined img-side-tag elevation-4"
            >
              {{ result.file.lastModified | timeAbsolute }}
              <span
                class="d-block text-right"
                style="font-size: small; line-height: 1.5em"
              >
                {{ result.file.lastModified | timeRelative }}
              </span>
            </span>
          </div>
        </template>
      </v-img>
    </div>
    <v-divider />

    <v-card-title class="align-start">
      <div
        v-if="result.result.stage.stageId"
        class="d-inline-flex flex-row align-start"
      >
        <FactTableItem>
          <template #title>
            <span class="textDarken--text">{{ $t('stage.name') }}</span>
          </template>
          <template #content>
            <span class="monospace font-weight-bold">
              {{ result.result.stage.stageCode }}
            </span>
          </template>
        </FactTableItem>
        <FactTableItem>
          <template #title>
            <span class="textDarken--text">{{ $t('report.recognition.confirm.itemsTotal') }}</span>
          </template>
          <template #content>
            <span class="monospace font-weight-bold">
              ×{{ result.result.drops.reduce((prev, curr) => prev + curr.quantity, 0) }}
            </span>
          </template>
        </FactTableItem>
      </div>

      <div
        v-else
        class="align-self-start mr-4"
      >
        {{ $t('report.recognition.confirm.unknownStage') }}
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text
      class="pt-2 transition-all position-relative"
      :class="{
        'reco-result__wrapper--invalid': hasException,
        'reco-result__wrapper--invalid-no-results': !result.result.drops.length
      }"
    >
      <div class="reco-result__details">
        <div
          v-for="item in result.result.drops"
          :key="item.itemId"
          class="d-inline-flex align-center justify-center flex-column pa-2 mt-2 mr-2 border-outlined"
          style="border-radius: 4px"
        >
          <div>
            {{ $t(`stage.loots.${item.dropType}`) || item.dropType }}
          </div>

          <v-badge
            bottom
            overlap
            bordered
            label
            color="indigo"
            :offset-x="24"
            :offset-y="20"
            :content="`×${item.quantity}`"
          >
            <ItemIcon
              disable-tooltip
              :ratio="0.7"
              :item="getItem(item.itemId)"
            />
          </v-badge>
        </div>
      </div>
      <v-alert
        v-if="hasException"
        outlined
        color="text"
        border="left"
        class="my-4 reco-result__alert"
        type="error"
      >
        <div>
          <div>{{ $t('report.recognition.confirm.abnormal.' + (result.result.stage.stageCode ? 'error' : 'fatal')) }}</div>

          <div
            v-if="result.result.drops.length"
            class="d-inline-flex caption chip-label"
          >
            <v-icon
              left
              small
            >
              mdi-cursor-default-click
            </v-icon>
            {{ $t('report.recognition.confirm.abnormal.hover') }}
          </div>
        </div>

        <RecognizeResultAlertCard
          :alerts="result.result.exceptions"
          icon="mdi-alert-decagram"
        />
      </v-alert>
    </v-card-text>

    <v-spacer />

    <v-divider />

    <v-card-actions class="pa-2">
      <v-card
        v-ripple="!hasException"
        class="background-transparent font-weight-bold elevation-2 pa-2"
        :class="
          hasException ?
            'transparent elevation-0' :
            (selected ?
              'success darken-2' :
              'warning darken-4'
            )
        "
        style="width: 100%"
      >
        <v-checkbox
          :input-value="value"
          :value="index"
          hide-details
          :class="{'input-white--text': !dark && !hasException}"
          class="pt-0 mt-0"
          :disabled="!!hasException"
          :off-icon="hasException ? 'mdi-close-box' : '$checkboxOff'"
          :label="
            hasException ?
              $t('report.recognition.confirm.cherryPick.disabled') :
              (selected ?
                $t('report.recognition.confirm.cherryPick.accepted') :
                $t('report.recognition.confirm.cherryPick.rejected')
              )
          "
          @change="e => $emit('input', e)"
        />
      </v-card>
    </v-card-actions>
  </v-card>
</template>

<script>
import get from "@/utils/getters";
import ItemIcon from "@/components/global/ItemIcon";
import RecognizeResultAlertCard from "@/components/recognition/RecognizeResultAlertCard";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";
import Theme from "@/mixins/Theme";
export default {
  name: "RecognitionResultCard",
  components: {FactTableItem, RecognizeResultAlertCard, ItemIcon},
  mixins: [Theme],
  props: {
    result: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  computed: {
    hasException() {
      return this.result.result.exceptions.length;
    },
    selected() {
      return this.value.includes(this.index)
    }
  },
  methods: {
    getItem(itemId) {
      return get.items.byItemId(itemId, false, false) || {}
    }
  },
}
</script>

<style scoped lang="scss">
.img-side-tag {
  padding: 3px 9px 2px 8px;
  border-radius: 0 0 0 8px;
  border-right-width: 0 !important;
  border-top-width: 0 !important;
}

.reco-result {
  &__wrapper--invalid:not(.reco-result__wrapper--invalid-no-results) {
    position: relative;
    transform-origin: top center;
    $easing: cubic-bezier(0, 0.55, 0.45, 1);

    & .reco-result__details {
      transition: all .225s $easing;
      max-height: 108px;
      opacity: 0.7;
      transform: scale(0.94);
      filter: brightness(0.8) contrast(0.6);
    }
    & .reco-result__alert {
      transition: all .225s $easing;
      margin-top: -68px !important;
      background: rgba(128, 34, 25, .85) !important;
      .theme--light & {
        background: rgba(230, 103, 92, .85) !important;
      }
    }

    &:hover {
      & .reco-result__details {
        max-height: 600px;
        opacity: 1;
        transform: scale(1);
        filter: brightness(1);
      }
      & .reco-result__alert {
        pointer-events: none;
        margin-top: -68px !important;
        filter: blur(5px);
        opacity: 0.12;
        background: rgba(128, 34, 25, .2) !important;
        transform: scale(1.047);
      }
    }
  }
}

.input-white--text ::v-deep  {
  & .v-label, & .v-icon {
    color: rgba(255, 255, 255, .8) !important;
  }
}
</style>