<template>
  <figure class="item-icon--sprite" ref="icon"></figure>
</template>

<script>
  export default {
    name: "ItemIcon",
    props: {
      coordinate: {
        type: Array,
        required: true
      },
      ratio: {
        type: Number,
        default () {
          return 1
        }
      }
    },
    data () {
      return {
        originalIconSize: 60,
        originalSpriteDimensions: {
          x: 360,
          y: 480
        }
      }
    },
    watch: {
      coordinate: function(newCoordinates) {
        this.updatePosition(newCoordinates)
      },
      ratio: function(newRatio) {
        this.updateScale(newRatio)
        this.updatePosition(this.coordinate)
      }
    },
    mounted() {
      this.updatePosition(this.coordinate);
      this.updateScale(this.ratio)
    },
    methods: {
      updatePosition (coord) {
        this.$refs.icon.style.backgroundPosition = this.transformCoordinate(coord);
      },
      updateScale (ratio) {
        this.$refs.icon.style.height = `${ratio * this.originalIconSize}px`;
        this.$refs.icon.style.width = `${ratio * this.originalIconSize}px`;
        this.$refs.icon.style.backgroundSize = `${ratio * this.originalSpriteDimensions.x}px ${ratio * this.originalSpriteDimensions.y}px`;
      },
      transformCoordinate (coordinate) {
        const FACTOR = this.ratio * this.originalIconSize
        return `-${coordinate[0] * FACTOR}px -${coordinate[1] * FACTOR}px`
      }
    }
  }
</script>

<style>
  .item-icon--sprite {
    background-image: url("https://penguin-stats.s3-ap-southeast-1.amazonaws.com/item_sprite.png");
    background-repeat: no-repeat;
    height: 60px;
    width: 60px;
    display: inline-block;
    overflow: hidden;
    background-size: 360px 480px;
  }
</style>