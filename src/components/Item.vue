<template>
  <span @click="redirectItemPage" :class="{ 'cursor-pointer': !this.disableLink }" >
    <v-tooltip bottom content-class="elevation-0 transparent" lazy :open-delay="200" v-if="!disableTooltip">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-icon v-if="item.itemId === 'furni'" class="deep-orange" :class="furniturePadding" style="border-radius: 50%" :style="furnitureWidth">mdi-lamp</v-icon>
          <figure class="item-icon--sprite" ref="icon" v-show="item.itemId !== 'furni'"></figure>
        </span>
      </template>
      <v-card>
        <v-card-title>
          <h1 class="mr-2">{{ item.name }}</h1>

          <v-chip :color="item.meta.color" text-color="black">
            <v-avatar>
              <v-icon>{{ item.meta.icon }}</v-icon>
            </v-avatar>
            {{ item.meta.name }}
          </v-chip>
        </v-card-title>
      </v-card>
    </v-tooltip>
    <span v-else>
      <v-icon v-if="item.itemId === 'furni'" class="deep-orange" :class="furniturePadding" style="border-radius: 50%;" :style="furnitureWidth">mdi-lamp</v-icon>
      <figure class="item-icon--sprite" ref="icon" v-show="item.itemId !== 'furni'"></figure>
    </span>
  </span>
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
      },
      disableTooltip: {
        type: Boolean,
        default () {
          return false
        }
      },
      disableLink: {
        type: Boolean,
        default () {
          return false
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
        if (newItem.itemId !== "furni") this.updatePosition(newItem.spriteCoord);
        this.updateScale(this.ratio);
        this.updateHoverEffect()
      },
      ratio: function(newRatio, oldRatio) {
        this.updateScale(newRatio);
        if (this.item.itemId !== "furni") this.updatePosition(this.item.spriteCoord);
        this.updateHoverEffect()
      }
    },
    mounted() {
      if (this.item.itemId !== "furni") {
        this.updatePosition(this.item.spriteCoord);
        this.updateScale(this.ratio);
        this.updateHoverEffect()
      }
    },
    methods: {
      updateHoverEffect () {
        if (this.disableTooltip) {
          this.$refs.icon.classList.add('item-icon--sprite--disable-hover-effect')
        } else {
          this.$refs.icon.classList.remove('item-icon--sprite--disable-hover-effect')
        }
      },
      updatePosition (coordinate) {
        this.$refs.icon.style.backgroundPosition = this.transformCoordinate(coordinate);
      },
      updateScale (ratio) {
        this.$refs.icon.style.height = `${ratio * this.originalIconSize}px`;
        this.$refs.icon.style.width = `${ratio * this.originalIconSize}px`;
        this.$refs.icon.style.backgroundSize = `${ratio * this.originalSpriteDimensions.x}px ${ratio * this.originalSpriteDimensions.y}px`;
      },
      transformCoordinate (coordinate) {
        const FACTOR = this.ratio * this.originalIconSize;
        return `-${coordinate[0] * FACTOR}px -${coordinate[1] * FACTOR}px`
      },
      redirectItemPage () {
        if (!this.disableLink) {
          this.$router.push({
            name: "StatsByItem_SelectedItem",
            params: {
              itemId: this.item.itemId
            }
          })
        }
      }
    },
    computed: {
      furniturePadding () {
        if (this.ratio <= 0.25) {
          return ['pa-0']
        } else if (this.ratio <= 0.5) {
          return ['pa-1']
        } else if (this.ratio <= 0.75) {
          return ['pa-2']
        } else if (this.ratio <= 1) {
          return ['pa-3']
        } else {
          return ['pa-4']
        }
      },
      furnitureWidth () {
        return {
          fontSize: 36 * this.ratio
        }
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

    transition: all 225ms cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .item-icon--sprite:hover {
    transform: translateY(-4px) scale(1.2);
  }

  .item-icon--sprite--disable-hover-effect {
    transform: none !important;
  }

  .item-card {
    position: absolute;
  }
</style>