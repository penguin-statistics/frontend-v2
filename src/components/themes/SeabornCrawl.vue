<template>
  <div
    v-if="$store.getters['ui/activeThemeStyle'] === 'seaborn' && !hide"
    :class="['crawl-wrapper', drawer ? 'crawl-wrapper--drawer-expanded' : '']"
  >
    <div class="seaborn-creature" />
  </div>
</template>

<script>
export default {
  name: 'SeabornCrawl',
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
          url: '/seaborn/crawling-creatures/0.png',
          steps: 16,
        },
        {
          url: '/seaborn/crawling-creatures/1.png',
          steps: 14,
        },
        {
          url: '/seaborn/crawling-creatures/2.png',
          steps: 13,
        },
        {
          url: '/seaborn/crawling-creatures/3.png',
          steps: 23,
        }
      ],
      currentCreature: 0,
      nextTimer: null,
      hide: false,
    }
  },
  mounted() {
    this.changeCreature(Math.floor(Math.random() * this.creatures.length))
  },
  created() {
    this.nextTimer = setTimeout(this.enableHide, 70 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.nextTimer)
  },
  methods: {
    changeCreature(index) {
      const creature = this.creatures[index]
      this.$el.querySelector('.seaborn-creature').style.backgroundImage = `url('${creature.url}')`
      this.$el.querySelector('.seaborn-creature').style.setProperty('--steps', creature.steps)
    },
    enableHide() {
      this.hide = true
    }
  }
}
</script>

<style scoped>
.seaborn-creature {
  --size: 75px;
  width: 75px;
  height: 75px;
  background: url('/seaborn/creeper-chunks.png') no-repeat;
  background-size: var(--size);
  animation: crawl-chunks infinite forwards;
  animation-duration: 1000ms;
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
  left: -2px;
  top: 0;
  z-index: 20;
  pointer-events: none;
  transform: translateX(0px);

  animation: crawl 70s linear forwards;
  transition: left 200ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: left;
}

.crawl-wrapper--drawer-expanded {
  left: 297px;
}

@keyframes crawl {
  0% {
    transform: translate(0, -100px) rotate(90deg);
  }
  100% {
    transform: translate(0, 100vh) rotate(90deg);
  }
}
</style>
