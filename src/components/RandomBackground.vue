<template>
  <div
    ref="background"
    class="random-background"
  />
</template>

<script>
  export default {
    name: "RandomBackground",
    props: {
      interval: {
        type: Number,
        default () {
          if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
            // is mobile device; reduce data usage, use ttl of 15 minutes
            return 15 * 60
          } else {
            // is not mobile device; use ttl of 5 minutes to show off ;)
            return 5 * 60
          }
        }
      }
    },
    data () {
      return {
        lastLoading: false,
        last: 1,
        lastUrl: "",
        timer: null,
        webpSupport: null
      }
    },
    mounted () {
      this.updateBackground();
      this.timer = setInterval(() => {
        !this.lastLoading && this.updateBackground()
      }, 1000 * this.interval);
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      async testWebp() {
        return new Promise(res => {
          const webP = new Image();
          webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
          webP.onload = webP.onerror = function () {
            res(webP.height === 2)
          };
        })
      },
      async getBackground() {
        let current = this.last;
        // avoid change to the same background than the last one
        while (current === this.last) {
          current = Math.floor(Math.random() * 70)
        }
        this.last = current;
        // console.log(current)
        if (this.webpSupport === null) {
          this.webpSupport = await this.testWebp();
        }
        return `https://penguin-stats.cdn.iblueg.cn/backgrounds/${current}.${this.webpSupport ? 'webp' : 'jpg'}`
      },
      async updateBackground() {
        let background = this.$refs.background;
        this.lastLoading = true;
        window.fetch(await this.getBackground())
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
          .catch(() => {}) // i can do nothing :(
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