<template>
  <v-tooltip bottom content-class="elevation-0 transparent" lazy :open-delay="200">
    <template v-slot:activator="{ on }">
      <v-icon v-show="item.itemId === 'furni'" class="light-blue" style="border-radius: 50%;">mdi-lamp</v-icon>
      <figure class="item-icon--sprite" ref="icon" v-on="on" v-show="item.itemId !== 'furni'"></figure>
    </template>
    <v-card>
      <v-card-title>
        <h1 class="mr-2">{{ item.name }}</h1>

        <v-chip :color="chip.color" text-color="black">
          <v-avatar>
            <v-icon>{{ chip.icon }}</v-icon>
          </v-avatar>
          {{ chip.name }}
        </v-chip>
      </v-card-title>
    </v-card>
  </v-tooltip>
</template>

<script>
  export default {
    name: "Item",
    props: {
      item: {
        type: Object,
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
      item: function(newItem) {
        if (this.item.itemId !== "furni") this.updatePosition(newItem.spriteCoord)
      },
      ratio: function(newRatio) {
        this.updateScale(newRatio);
        if (this.item.itemId !== "furni") this.updatePosition(this.item.spriteCoord)
      }
    },
    mounted() {
      if (this.item.itemId !== "furni") this.updatePosition(this.item.spriteCoord);
      this.updateScale(this.ratio)
    },
    methods: {
      updatePosition (coordinate) {
        this.$refs.icon.style.backgroundPosition = this.transformCoordinate(coordinate);
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
    },
    computed: {
      chip () {
        const ITEM_CHIP_MAP = {
          CARD_EXP: {
            name: "作战记录",
            icon: "mdi-card-bulleted",
            color: "light-blue"
          },
          MATERIAL: {
            name: "材料",
            icon: "mdi-cube-outline",
            color: "lime"
          },
          FURN: {
            name: "家具",
            icon: "mdi-lamp",
            color: "blue-grey"
          }
        };

        return ITEM_CHIP_MAP[this.item.itemType]
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

  .item-card {
    position: absolute;
  }
</style>