<template>
  <figure
    v-if="item.itemId !== 'furni' && item.spriteCoord"
    :class="{'item-icon--sprite': true, 'item-icon--sprite--disable-hover-effect': disableTooltip}"
    :alt="item.name"
    :style="style"
  />
  <v-icon
    v-else-if="item.itemId === 'furni'"
    :class="furniturePadding"
    class="deep-orange item-icon--special white--text"
    :size="30 * ratio"
  >
    mdi-lamp
  </v-icon>
  <v-icon
    v-else-if="item.itemId !== 'furni' && !item.spriteCoord"
    :class="furniturePadding"
    class="primary item-icon--special white--text"
    :size="30 * ratio"
  >
    mdi-help
  </v-icon>
</template>

<script>
import CDN from '@/mixins/CDN'

export default {
  name: 'ItemIcon',
  mixins: [CDN],
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
    }
  },
  data () {
    return {
      previousIconSize: 60,
      resolutions: {
        high: {
          iconSize: 183,
          dimensions: [1098, 2928],
          url: '/sprite/sprite.202109171627.png'
        },
        low: {
          iconSize: 183 / 2,
          dimensions: [1098 / 2, 2928 / 2],
          url: '/sprite/sprite.202109171627.small.png'
        }
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
        return ['pa-4']
      } else {
        return ['pa-6']
      }
    },
    lowResolution () {
      let lowResolution = true
      if (window.matchMedia) {
        if (window.devicePixelRatio >= 2 || window.matchMedia('(min-resolution: 192dpi)').matches) { lowResolution = false }
      }
      return lowResolution
    },
    current () {
      return this.resolutions[this.lowResolution ? 'low' : 'high']
    },
    config () {
      const zoom = this.ratio * (this.previousIconSize / this.current.iconSize)
      return {
        iconSize: zoom * this.current.iconSize,
        url: this.cdnDeliver(this.current.url),
        zoom
      }
    },
    style () {
      const style = {
        height: `${this.config.iconSize}px`,
        width: `${this.config.iconSize}px`,
        backgroundSize: `${this.config.zoom * this.current.dimensions[0]}px ${this.config.zoom * this.current.dimensions[1]}px`,
        backgroundImage: `url(${this.config.url})`
      }
      if (this.item.spriteCoord) {
        style.backgroundPosition = this.transformCoordinate(this.item.spriteCoord)
      }
      return style
    }
  },
  methods: {
    transformCoordinate (coordinate) {
      const factorized = this.config.iconSize
      return `-${coordinate[0] * factorized}px -${coordinate[1] * factorized}px`
    }
  }
}
</script>

<style scoped>
.item-icon--sprite {
  background-repeat: no-repeat;
  height: 60px;
  width: 60px;
  display: inline-block;
  overflow: hidden;
  transition: transform 150ms cubic-bezier(.25,.8,.5,1);

  transform-origin: center center;
}

.item-icon--sprite:hover {
  transform: translateY(-4px) scale(1.2);
}

.item-icon--sprite--disable-hover-effect {
  transform: none !important;
}

  .item-icon--special {
    border-radius: 50%;
    /*margin: 0 .2rem;*/
  }
</style>
