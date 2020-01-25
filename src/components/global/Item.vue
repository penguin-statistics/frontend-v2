<template>
  <v-tooltip
    v-if="!disableTooltip"
    :open-delay="40"
    :nudge-top="10"

    v-bind="calculatedTooltipPosition"
  >
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <ItemIcon
          :item="item"
          :ratio="ratio"
          :class="{'sticky-left': sticky === 'left'}"
          :disable-tooltip="disableTooltip"
        />
      </span>
    </template>
    <span>{{ name }}</span>
  </v-tooltip>
  <ItemIcon
    v-else-if="disableTooltip"
    :item="item"
    :ratio="ratio"
    :class="{'sticky-left': sticky === 'left'}"
    :disable-tooltip="disableTooltip"
  />
</template>

<script>
  import ItemIcon from "@/components/global/ItemIcon";
  import strings from "@/utils/strings";
  export default {
    name: "Item",
    components: {ItemIcon},
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
      disableLink: {
        type: Boolean,
        default() {
          return false;
        }
      },
      tooltipPosition: {
        type: String,
        default () {
          return "bottom";
        }
      },
      sticky: {
        type: String,
        default () {
          return "";
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
      calculatedTooltipPosition () {
        return {[this.tooltipPosition]: true}
      }
    },
  };
</script>

<style scoped>
  .sticky-left {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
  }
</style>
