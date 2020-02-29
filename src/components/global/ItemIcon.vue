<template>
  <figure
    v-if="item.itemId !== 'furni' && item.spriteCoord"
    :class="{'item-icon--sprite': true, 'item-icon--sprite--disable-hover-effect': disableTooltip}"
    :alt="`item(${item.itemId})`"
    :style="style"
  />
  <v-icon
    v-else-if="item.itemId === 'furni'"
    :class="furniturePadding"
    class="deep-orange item-icon--special"
    :size="30 * ratio"
  >
    mdi-lamp
  </v-icon>
  <v-icon
    v-else-if="item.itemId !== 'furni' && !item.spriteCoord"
    :class="furniturePadding"
    class="blue item-icon--special"
    :size="30 * ratio"
  >
    mdi-treasure-chest
  </v-icon>
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
        return ["pa-4"];
      } else {
        return ["pa-6"];
      }
    },
    style () {
      const style = {
        height: `${this.ratio * this.originalIconSize}px`,
        width: `${this.ratio * this.originalIconSize}px`,
        backgroundSize: `${this.ratio * this.originalSpriteDimensions.x}px ${this.ratio * this.originalSpriteDimensions.y}px`,
      };
      if (this.item.spriteCoord) {
        style["backgroundPosition"] = this.transformCoordinate(this.item.spriteCoord)
      }
      return style
    }
  },
  methods: {
    transformCoordinate(coordinate) {
      const FACTOR = this.ratio * this.originalIconSize;
      return `-${coordinate[0] * FACTOR}px -${coordinate[1] * FACTOR}px`;
    }
  }
};
</script>

<style>
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

  .item-icon--special {
    border-radius: 50%;
  }
</style>
