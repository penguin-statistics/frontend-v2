<template>
  <v-tooltip
    v-if="!disableTooltip"
    :open-delay="60"
    :nudge-top="10"

    v-bind="calculatedTooltipPosition"
  >
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <ItemIcon
          :item="item"
          :ratio="ratio"
          :disable-tooltip="disableTooltip"
        />
      </span>
    </template>
    <span :style="tooltipSize">{{ name }}</span>
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
      },
      tooltipSize () {
        let size = Math.max(this.ratio * 16, 12);
        return {fontSize: `${size}px`}
      }
    },
    methods: {
      redirectItemPage() {
        if (!this.disableLink) {
          this.showTooltip = false;
          this.$router.push({
            name: "StatsByItem_SelectedItem",
            params: {
              itemId: this.item.itemId
            }
          });
        }
      }
    },
  };
</script>

<style scoped>
</style>
