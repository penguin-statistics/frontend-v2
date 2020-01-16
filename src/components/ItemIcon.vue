<template>
  <span>
    <figure
      v-if="item.itemId !== 'furni' && item.spriteCoord"
      ref="icon"
      :class="{'item-icon--sprite': true, 'item-icon--sprite--disable-hover-effect': disableTooltip}"
      :alt="`${item.name} (${item.itemId})`"
    />
    <v-icon
      v-else-if="item.itemId === 'furni'"
      :class="furniturePadding"
      :style="furnitureWidth"
      class="deep-orange"
      style="border-radius: 50%;"
    >mdi-lamp</v-icon>
    <v-icon
      v-else-if="item.itemId !== 'furni' && !item.spriteCoord"
      :class="furniturePadding"
      :style="furnitureWidth"
      class="blue"
      style="border-radius: 50%;"
    >mdi-treasure-chest</v-icon>
  </span>
</template>

<script>
export default {
  name: "ItemIcon",
  props: {
    item: {
      type: Object,
      required: true
    },
    ratio: {
      type: Number,
      default() {
        return 1;
      }
    },
    disableTooltip: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data() {
    return {
      originalIconSize: 60,
      originalSpriteDimensions: {
        x: 360,
        y: 600
      }
    };
  },
  computed: {
    furniturePadding() {
      if (this.ratio <= 0.25) {
        return ["pa-0"];
      } else if (this.ratio <= 0.5) {
        return ["pa-1"];
      } else if (this.ratio <= 0.75) {
        return ["pa-2"];
      } else if (this.ratio <= 1) {
        return ["pa-3"];
      } else {
        return ["pa-4"];
      }
    },
    furnitureWidth() {
      return {
        fontSize: 36 * this.ratio
      };
    }
  },
  watch: {
    item: function(newItem) {
      if (newItem.itemId !== "furni") this.updatePosition(newItem.spriteCoord);
      this.updateScale(this.ratio);
    },
    ratio: function(newRatio) {
      this.updateScale(newRatio);
      if (this.item.itemId !== "furni")
        this.updatePosition(this.item.spriteCoord);
    }
  },
  mounted() {
    if (this.item.itemId !== "furni" && this.item.spriteCoord) {
      this.updatePosition(this.item.spriteCoord);
      this.updateScale(this.ratio);
    }
  },
  methods: {
    updatePosition(coordinate) {
      this.$refs.icon.style.backgroundPosition = this.transformCoordinate(
        coordinate
      );
    },
    updateScale(ratio) {
      this.$refs.icon.style.height = `${ratio * this.originalIconSize}px`;
      this.$refs.icon.style.width = `${ratio * this.originalIconSize}px`;
      this.$refs.icon.style.backgroundSize = `${ratio *
        this.originalSpriteDimensions.x}px ${ratio *
        this.originalSpriteDimensions.y}px`;
    },
    transformCoordinate(coordinate) {
      const FACTOR = this.ratio * this.originalIconSize;
      return `-${coordinate[0] * FACTOR}px -${coordinate[1] * FACTOR}px`;
    }
  }
};
</script>

<style scoped>
.item-icon--sprite {
  background-image: url("https://penguin-stats.s3.ap-southeast-1.amazonaws.com/item_sprite.png");
  background-repeat: no-repeat;
  height: 60px;
  width: 60px;
  display: inline-block;
  overflow: hidden;
  background-size: 360px 600px;
  transition: transform 150ms cubic-bezier(.25,.8,.5,1);
}

.item-icon--sprite:hover {
  transform: translateY(-4px) scale(1.2);
}

.item-icon--sprite--disable-hover-effect {
  transform: none !important;
}
</style>
