<template>
  <figure class="item-icon--sprite" ref="icon"></figure>
</template>

<script>
  export default {
    name: "ItemIcon",
    props: {
      coordinate: {
        type: Array
      }
    },
    mounted() {
      this.$refs.icon.style.backgroundPosition = this.transformCoordinate(this.coordinate)
    },
    methods: {
      transformCoordinate (coordinate) {
        const FACTOR = 60
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
  }
</style>