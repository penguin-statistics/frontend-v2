<template>
  <div
    ref="background"
    class="random-background"
    :style="{
      filter: `${blurred ? 'blur(5px)' : null} ${
        isInSpecialUI ? 'grayscale(0.75)' : ''
      }`,
    }"
  >
    <!--    <div class="random-background__copyright">-->
    <!--      干员立绘-->
    <!--      <br>-->
    <!--      &copy; 鹰角网络-->
    <!--    </div>-->
  </div>
</template>

<script>
import CDN from "@/mixins/CDN";
import SpecialUI from "@/mixins/SpecialUI";
import Console from "@/utils/Console";
import randomUtils from "@/utils/randomUtils";
import { externalService } from "@/utils/service";
import { mapGetters } from "vuex";
import environment from "../../utils/environment";

export default {
  name: "RandomBackground",
  mixins: [SpecialUI, CDN],
  props: {
    interval: {
      type: Number,
      default() {
        // low data. we fetch per 30min
        if (this.$store.getters["settings/lowData"]) {
          return 30 * 60;
        } else {
          // 5min shall be enough
          return 5 * 60;
        }
        // eslint-disable-next-line no-unreachable
        // if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
        //   // is mobile device; reduce data usage, use ttl of 30 minutes
        //   return 30 * 60
        // } else {
        //   // is not mobile device; use ttl of 20 minutes to show off ;)
        //   return 20 * 60
        // }
      },
    },
  },
  data() {
    return {
      lastLoading: false,
      last: 1,
      lastUrl: "",
      timer: null,
      webpSupport: null,
      blurred: false,
      // [key] is a special "stageId" to display a special "background image"
      // [value] represents a "background image url" on such route
      specialImageMap: {
        "main_06-14": "/backgrounds/fn_0_1.png", // 6-16
        "main_06-15": "/backgrounds/fn_0_0.png", // 6-17
        "main_08-10": "/backgrounds/sp_main_08-10.png", // 8-10
      }
    };
  },
  computed: {
    ...mapGetters("settings", ["lowData", "themeStyle"]),
  },
  watch: {
    $route: ["checkSpecialImage", "checkBlur"],
    lowData(newValue) {
      if (newValue) {
        this.shutdown();
      } else {
        this.bootup();
      }
    },
    themeStyle: {
      handler() {
        this.updateBackgroundByRandom(false);
      },
      immediate: true,
    },
  },
  mounted() {
    this.bootup();
  },
  beforeDestroy() {
    this.shutdown();
  },
  methods: {
    getImageUrl(id) {
      return this.cdnDeliver(
        `/backgrounds/${id}.${this.webpSupport ? "webp" : "optimized.png"}`
      );
    },
    setBlur(flag) {
      Console.info("RandomBackground", "setting blur to", flag);
      this.blurred = flag;
    },
    async testWebp() {
      return new Promise((resolve) => {
        const webP = new Image();
        webP.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        webP.onload = webP.onerror = function () {
          resolve(webP.height === 2);
        };
      });
    },
    async getRandomBackgroundUrl() {
      // Console.log(current)
      if (this.webpSupport === null) {
        this.webpSupport = await this.testWebp();
      }
      // P(🔪) = 0.2%
      if (Math.random() < 0.002) {
        return this.getImageUrl("frstar");
      }
      if (this.$store.getters['settings/themeStyle'] === 'seaborn') {
        return this.getImageUrl("seaborn/" + Math.floor(
          Math.random() * (6 + 1) // 0-6, 7 images
        ));
      }
      return this.getImageUrl(randomUtils.cachedRandom.get());
    },
    async updateBackgroundByRandom(ignoreUrl) {
      // Console.log("check at random", this.isSpecialUrl(this.$route), this.$route)
      if (!environment.appIsActive) {
        Console.info("RandomBackground", "page is not visible: skipping update");
        return
      }
      const isSpecial = this.isSpecialUrl(this.$route);
      if (ignoreUrl || isSpecial === false) {
        this.updateBackgroundByUrl(await this.getRandomBackgroundUrl());
      }
    },
    async updateBackgroundByUrl(url) {
      const background = this.$refs.background;
      this.lastLoading = true;
      externalService
        .get(url, {
          responseType: "blob",
        })
        .then(({ data }) => {
          const dataUrl = URL.createObjectURL(data);
          background.style.backgroundImage = `url(${dataUrl})`;
          if (this.lastUrl) {
            Console.log('RandomBackground', `created ${dataUrl} | revoking ${this.lastUrl}`)
            URL.revokeObjectURL(this.lastUrl);
          } else {
            Console.log('RandomBackground', `created ${dataUrl} | (skipping revoke)`)
          }
          this.lastUrl = dataUrl;
        })
        .catch(() => {}) // i can do nothing :(
        .finally(() => {
          this.lastLoading = false;
        });
    },
    isSpecialUrl(url) {
      return url.params &&
          url.params.stageId &&
          Object.prototype.hasOwnProperty.call(this.specialImageMap, url.params.stageId);
    },
    checkSpecialImage(to, from) {
      if (this.isSpecialUrl(to)) {
        // yes we do have a special image for the CURRENT path. APPLY IT!
        const imageUrl = this.specialImageMap[to.params.stageId];
        this.updateBackgroundByUrl(this.cdnDeliver(imageUrl));
      } else if (this.isSpecialUrl(from)) {
        // we do not have a special image for the current path but we DO have a special image for the PREVIOUS path.
        // we need to restore the last background image
        this.updateBackgroundByUrl(
          this.getImageUrl(
            this.last ? this.last : this.getRandomBackgroundUrl()
          )
        );
      }
    },
    checkBlur(to) {
      if (to && to.name) this.blurred = to.name === "ErrorNotFound";
    },
    shutdown() {
      clearInterval(this.timer);
    },
    bootup() {
      if (!this.lowData) {
        if (!this.lastUrl) this.updateBackgroundByRandom(true);
        this.timer = setInterval(() => {
          !this.lastLoading && this.updateBackgroundByRandom(false);
        }, 1000 * this.interval);

        this.checkBlur(this.$route);
      }
    },
  },
};
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
  opacity: 0.75;
  /*for performance reasons drop shadow has been disabled*/
  /*filter: drop-shadow(0 2px 5px rgba(0, 0, 0, .75));*/
  transition: background-image 1s cubic-bezier(0.165, 0.84, 0.44, 1),
    filter 0.225s cubic-bezier(0.165, 0.84, 0.44, 1);
  /*background-image: url("../assets/background/1.jpg");*/
  z-index: 0;
}
.random-background__copyright {
  position: absolute;
  bottom: 2rem;
  right: 3rem;
  opacity: 0.35;
  font-size: 10px !important;
  font-weight: bolder !important;
  text-align: right;
}
</style>
