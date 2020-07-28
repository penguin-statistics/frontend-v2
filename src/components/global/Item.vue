<template>
  <v-tooltip
    v-if="!disableTooltip"
    :open-delay="2"

    :right="right"
    :bottom="bottom"
    v-bind="tooltipOptions"
    content-class="transparent o-100 backdrop-blur pa-0"
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
          :disable-tooltip="disableTooltip"
          v-on="on"
        />
      </span>
    </template>
    <!--    <span class="force-lang-font">{{ name }}</span>-->
    <PreviewItemCard
      :item-id="item.itemId"
      :tooltip-nudge="5"
    />
  </v-tooltip>
  <ItemIcon
    v-else-if="disableTooltip"
    :item="item"
    :ratio="ratio"
    :disable-tooltip="disableTooltip"
  />
</template>

<script>
  import ItemIcon from "@/components/global/ItemIcon";
  import strings from "@/utils/strings";
  import PreviewItemCard from "@/components/stats/PreviewItemCard";
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
          transition: this.bottom ? "slide-y-transition" : "slide-x-transition"
        }
      }
    },
  };
</script>

<style scoped>
  .sticky-left {
    position: absolute;
  }
</style>
