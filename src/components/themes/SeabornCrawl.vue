<template>
  <div class="crawl-wrapper">
    <div class="seaborn-creature" />
  </div>
</template>

<script>
export default {
  name: 'SeabornCrawl',
  data() {
    return {
      creatures: [
        {
          url: '/seaborn/creeper-chunks.png',
          steps: 14,
        },
        {
          url: '/seaborn/creature1-chunks.png',
          steps: 45,
        },
        {
          url: '/seaborn/creature2-chunks.png',
          steps: 10,
        }
      ],
      currentCreature: 0,
      nextTimer: null,
    }
  },
  mounted() {
    this.changeCreature(this.currentCreature)
  },
  created() {
    this.nextTimer = setInterval(this.nextCreature, 60 * 1000)
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
    nextCreature() {
      this.currentCreature = (this.currentCreature + 1) % this.creatures.length
      this.changeCreature(this.currentCreature)
    }
  }
}
</script>

<style scoped>
.seaborn-creature {
  --size: 100px;
  width: 100px;
  height: 100px;
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
  left: 290px;
  top: 0;
  z-index: 20;
  pointer-events: none;

  animation: crawl 60s infinite linear;
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
