<template>
  <div class="global-tapwaves">
    <div
      v-for="tapwave in tapwaves"
      :key="tapwave.id"
      class="global-tapwave"
      :style="tapwave.style"
    />
  </div>
</template>

<script>
import {throttle} from "lodash";

export default {
  name: 'SeabornTapwaves',
  data() {
    return {
      tapwaves: {},
      tapwaveTapListener: null,
      tapwaveMoveListener: null,
      rootEl: null
    }
  },
  mounted() {
    // this.rootEl = document.querySelector('#penguin-content')
    this.rootEl = window

    this.tapwaveTapListener = function (e) {
      if (e instanceof TouchEvent && e.touches.length === 0) return

      if (e instanceof MouseEvent) {
        this.handleTapwave(e.clientX, e.clientY)
      } else if (e instanceof TouchEvent) {
        this.handleTapwave(e.touches[0].clientX, e.touches[0].clientY)
      }
    }.bind(this)
    this.tapwaveMoveListener = throttle(function (e) {
      // e is MouseEvent or TouchEvent
      // only fire if the event is a touch event or the mouse button is pressed
      if (e instanceof MouseEvent && e.buttons === 0) return
      // ignore movements that are too small
      if (e instanceof MouseEvent && Math.abs(e.movementX) < 2 && Math.abs(e.movementY) < 2) return
      if (e instanceof TouchEvent && e.touches.length === 0) return

      if (e instanceof MouseEvent) {
        this.handleTapwave(e.clientX, e.clientY)
      } else if (e instanceof TouchEvent) {
        this.handleTapwave(e.touches[0].clientX, e.touches[0].clientY)
      }
    }.bind(this), 100, {
      leading: true,
      trailing: false
    })

    this.rootEl.addEventListener('mousedown', this.tapwaveTapListener)
    this.rootEl.addEventListener('mousemove', this.tapwaveMoveListener)
    this.rootEl.addEventListener('touchmove', this.tapwaveMoveListener)
  },
  beforeDestroy() {
    this.rootEl.removeEventListener('mousedown', this.tapwaveTapListener)
    this.rootEl.removeEventListener('mousemove', this.tapwaveMoveListener)
    this.rootEl.removeEventListener('touchmove', this.tapwaveMoveListener)
  },
  methods: {
    handleTapwave: function (x, y) {
      const tapwave = {
        id: Date.now(),
        style: {
          top: (y - 75) + 'px',
          left: (x - 75) + 'px',
        }
      }
      this.$set(this.tapwaves, tapwave.id, tapwave)
      setTimeout(function () {
        this.$delete(this.tapwaves, tapwave.id)
      }.bind(this), 750)
    }
  },
}
</script>

<style scoped>
.global-tapwave {
  --size: 150px;
  position: fixed;
  width: 150px;
  height: 150px;
  opacity: 1;
  z-index: 10000;
  pointer-events: none;
  animation: tapwave 750ms steps(27, end) normal forwards;
  background-size: var(--size);
  background-repeat: no-repeat;
  background-image: url(/seaborn/tapwave-chunks.png);
}

@keyframes tapwave {
  0% {
    background-position: 0 0;
  }
  to {
    background-position: 0 calc(-27 * var(--size));
  }
}

@media (prefers-reduced-motion: reduce) {
  .global-tapwave {
    display: none !important;
  }
}
</style>
