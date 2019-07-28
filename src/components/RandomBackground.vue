<template>
  <div class="random-background" ref="background" />
</template>

<script>
  export default {
    name: "RandomBackground",
    data () {
      return {
        lastLoading: false,
        last: 1,
        lastUrl: "",
        timer: null
      }
    },
    props: {
      interval: Number
    },
    mounted () {
      this.updateBackground();
      this.timer = setInterval(() => {
        !this.lastLoading && this.updateBackground()
      }, 1000 * this.interval)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      getBackground() {
        let current = this.last;
        // avoid change to the same background than the last one
        while (current === this.last) {
          current = Math.floor(Math.random() * 69)
        }
        this.last = current;
        // console.log(current)
        return require(`../assets/backgrounds/${current}.png`)
      },
      updateBackground() {
        let background = this.$refs.background;
        this.lastLoading = true;
        window.fetch(this.getBackground())
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            let dataUrl = URL.createObjectURL(blob);
            background.style.backgroundImage = `url(${dataUrl})`;
            // console.log(`created ${dataUrl} | revoking ${this.lastUrl}`)
            !this.lastUrl && URL.revokeObjectURL(this.lastUrl);
            this.lastUrl = dataUrl
          })
          .finally(() => {
            this.lastLoading = false
          })
      }
    }
  }
</script>

<style scoped>
  .random-background {
    position: fixed;
    bottom: 0;
    right: 5vw;
    margin: 2em 0;
    height: 50vh;
    width: 100vw;
    background-size: contain;
    background-position: bottom right;
    opacity: .75;
    filter: saturate(.5) drop-shadow(0 2px 5px rgba(0, 0, 0, .75));
    transition: background-image 2s cubic-bezier(0.165, 0.84, 0.44, 1);
    /*background-image: url("../assets/background/1.jpg");*/
    z-index: 0;
  }
</style>