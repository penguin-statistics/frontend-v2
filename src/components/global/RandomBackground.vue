<template>
  <div
    ref="background"
    class="random-background"
    :style="{filter: blurred ? 'blur(5px)' : 'blur(0px)'}"
  />
</template>

<script>
  import Console from "@/utils/Console";

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
        webpSupport: null,
        blurred: false,
        // TODO: Update image map.
        // [key] is a special "zoneId" to display a special "background image"
        // [value] represents a "background image url" on such route
        specialImageMap: {
          "main_06-14": "https://penguin-stats.s3.ap-southeast-1.amazonaws.com/backgrounds/fn_0_1.png", // 6-16
          "main_06-15": "https://penguin-stats.s3.ap-southeast-1.amazonaws.com/backgrounds/fn_0_0.png", // 6-17
        }
      }
    },
    watch: {
      "$route": ["checkSpecialImage", "checkBlur"]
    },
    mounted () {
      this.updateBackgroundByRandom(true);
      this.timer = setInterval(() => {
        !this.lastLoading && this.updateBackgroundByRandom(false)
      }, 1000 * this.interval);

      this.checkBlur(this.$route)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      getImageUrl (id) {
        return `https://penguin-stats.s3.ap-southeast-1.amazonaws.com/backgrounds/${id}.${this.webpSupport ? 'webp' : 'optimized.png'}`
      },
      setBlur (flag) {
        Console.info("setting blur to", flag)
        this.blurred = flag
      },
      async testWebp() {
        return new Promise(res => {
          const webP = new Image();
          webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
          webP.onload = webP.onerror = function () {
            res(webP.height === 2)
          };
        })
      },
      async getRandomBackgroundUrl() {
        let current = this.last;
        // avoid change to the same background than the last one
        while (current === this.last) {
          current = Math.floor(Math.random() * 70)
        }
        this.last = current;
        // Console.log(current)
        if (this.webpSupport === null) {
          this.webpSupport = await this.testWebp();
        }
        return this.getImageUrl(current)
      },
      async updateBackgroundByRandom(ignoreUrl) {
        // Console.log("check at random", this.isSpecialUrl(this.$route), this.$route)
        let isSpecial = this.isSpecialUrl(this.$route);
        if (ignoreUrl || isSpecial === false) {
          this.updateBackgroundByUrl(await this.getRandomBackgroundUrl())
        }
      },
      async updateBackgroundByUrl(url) {
        let background = this.$refs.background;
        this.lastLoading = true;
        window.fetch(url)
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            let dataUrl = URL.createObjectURL(blob);
            background.style.backgroundImage = `url(${dataUrl})`;
            // Console.log(`created ${dataUrl} | revoking ${this.lastUrl}`)
            !this.lastUrl && URL.revokeObjectURL(this.lastUrl);
            this.lastUrl = dataUrl
          })
          .catch(() => {}) // i can do nothing :(
          .finally(() => {
            this.lastLoading = false
          })
      },
      isSpecialUrl (url) {
        if (!url.params || !url.params.stageId || !(url.params.stageId in this.specialImageMap)) {
          return false;
        }
        return true;
      },
      checkSpecialImage (to, from) {
        if (this.isSpecialUrl(to)) {
          // yes we do have a special image for the CURRENT path. APPLY IT!
          let imageUrl = this.specialImageMap[to.params.stageId]
          this.updateBackgroundByUrl(imageUrl)
        } else if (this.isSpecialUrl(from)) {
          // we do not have a special image for the current path but we DO have a special image for the PREVIOUS path.
          // we need to restore the last background image
          this.updateBackgroundByUrl(this.getImageUrl(this.last ? this.last : this.getRandomBackgroundUrl()))
        }
      },
      checkBlur(to) {
        if (to && to.name) this.blurred = to.name === "ErrorNotFound";
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
    width: 90vw;
    background-size: contain;
    background-position: bottom right;
    opacity: .75;
    filter: saturate(.5) drop-shadow(0 2px 5px rgba(0, 0, 0, .75));
    transition: background-image 1s cubic-bezier(0.165, 0.84, 0.44, 1), filter .225s cubic-bezier(0.165, 0.84, 0.44, 1);
    /*background-image: url("../assets/background/1.jpg");*/
    z-index: 0;
  }
</style>