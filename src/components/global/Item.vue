<template>
  <v-tooltip
    v-if="!disableTooltipCalculated"
    allow-overflow
    offset-overflow
    :open-delay="-1"

    :right="right"
    :bottom="bottom"
    v-bind="tooltipOptions"
    content-class="transparent backdrop-blur o-100 pa-0"
  >
    <template v-slot:activator="{ on }">
      <span
        class="d-flex align-center"
        v-on="on"
      >
        <ItemIcon
          :item="item"
          :ratio="ratio"
          :class="contentClass"
          :disable-tooltip="disableTooltipCalculated"
          v-on="on"
        />
      </span>
    </template>
    <!--    <span class="force-lang-font">{{ name }}</span>-->
    <PreviewItemCard :item-id="item.itemId" />
  </v-tooltip>
  <ItemIcon
    v-else-if="disableTooltipCalculated"

    :item="item"
    :ratio="ratio"
    :class="contentClass"
    :disable-tooltip="disableTooltipCalculated"
  />
</template>

<script>
  import ItemIcon from "@/components/global/ItemIcon";
  import strings from "@/utils/strings";
  import PreviewItemCard from "@/components/stats/PreviewItemCard";
  import environment from "@/utils/environment";
  export default {
    name: "Item",
    components: {PreviewItemCard, ItemIcon},
    props: {
      item: {
        type: Object,
        required: true
      },
      ratio: {
        type: Number,
        default() {
          return 0.75;
        }
      },
      disableTooltip: {
        type: Boolean,
        default() {
          return false;
        }
      },
      tooltipNudge: {
        type: Number,
        default () {
          return 0
        }
      },
      right: {
        type: Boolean,
        default () {
          return false
        }
      },
      bottom: {
        type: Boolean,
        default () {
          return true
        }
      },
      contentClass: {
        type: String,
        default () {
          return ""
        }
      }
    },
    data() {
      return {
        showTooltip: false
      };
    },
    computed: {
      name() {
        return strings.translate(this.item, "name")
      },
      tooltipOptions () {
        return {
          [this.bottom ? 'nudgeTop' : 'nudgeLeft']: this.tooltipNudge,
          [this.bottom ? 'nudgeBottom' : 'nudgeRight']: this.tooltipNudge ? 0 : false,
          transition: this.bottom ? "slide-y-transition" : "slide-x-transition"
        }
      },
      disableTooltipCalculated () {
        // always disable tooltip on environment that cannot support hover
        return !environment.canHover || this.disableTooltip
      }
    },
  };
</script>

<style scoped>
  .sticky-left {
    position: absolute;
  }
</style>
