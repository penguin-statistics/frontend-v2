<template>
  <div v-if="!hide">
    <div :class="['crawl-wrapper', drawer ? 'crawl-wrapper--drawer-expanded' : '']">
      <div
        ref="seabornCreature"
        class="seaborn-creature"
      >
      &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
import mirror from "@/utils/mirror";
import CDN from "@/mixins/CDN";
import {mapGetters} from "vuex";

export default {
  name: 'SeabornCrawl',
  mixins: [CDN],
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      creatures: [
        {
          url: mirror.deliver('/images/themes/seaborn/crawling-creatures/0.png'),
          steps: 16,
        },
        {
          url: mirror.deliver('/images/themes/seaborn/crawling-creatures/1.png'),
          steps: 14,
        },
        {
          url: mirror.deliver('/images/themes/seaborn/crawling-creatures/2.png'),
          steps: 13,
        },
        {
          url: mirror.deliver('/images/themes/seaborn/crawling-creatures/3.png'),
          steps: 23,
        }
      ],
      currentCreature: 0,
      nextTimer: null,
      hide: true,
    }
  },
  computed: {
    ...mapGetters('ui', ['activeThemeStyle']),
  },
  watch: {
    activeThemeStyle: {
      handler() {
        if (this.activeThemeStyle === 'seaborn') {
          this.enable()
        } else {
          this.disable()
        }
      },
      immediate: true,
    }
  },
  beforeDestroy() {
    clearTimeout(this.nextTimer)
  },
  methods: {
    changeCreature(index) {
      const creature = this.creatures[index]
      if (!this.$refs.seabornCreature) return
      this.$refs.seabornCreature.style.backgroundImage = `url('${creature.url}')`
      this.$refs.seabornCreature.style.setProperty('--steps', creature.steps)
    },
    enable() {
      this.hide = false
      this.$nextTick(() => {
        this.changeCreature(Math.floor(Math.random() * this.creatures.length))
      })
      this.nextTimer = setTimeout(this.disable, 70 * 1000) // show for 70 seconds
    },
    disable() {
      this.hide = true
    },
  }
}
</script>

<style scoped>
.seaborn-creature {
  --size: 75px;
  width: 75px;
  height: 75px;
  background-repeat: no-repeat;
  background-size: var(--size);
  animation: crawl-chunks infinite forwards;
  animation-duration: 750ms;
  animation-timing-function: steps(var(--steps), end);
}

@keyframes crawl-chunks {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 calc((0 - var(--steps)) * var(--size));
  }
}

.crawl-wrapper {
  position: fixed;
  left: calc(env(safe-area-inset-left) - 4px);
  top: 0;
  z-index: 20;
  pointer-events: none;

  animation: crawl 70s linear forwards;
  transition: left 200ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: left;
}

@media (prefers-reduced-motion: reduce) {
  .crawl-wrapper {
    display: none !important;
  }
}

.crawl-wrapper--drawer-expanded {
  left: calc(env(safe-area-inset-left) + 300px - 4px) !important;
}

@keyframes crawl {
  0% {
    transform: translate(0, -75px) rotate(90deg);
  }
  100% {
    transform: translate(0, 100vh) rotate(90deg);
  }
}
</style>
