<template>
  <div
    :style="size.image"
    class="animated-preloader-wrapper"
  >
    <transition
      mode="out-in"
      appear
      duration="125"
      name="fade-transition"
    >
      <div
        v-if="ready"
        key="preloader"
        class="animated-preloader mx-auto"

        :style="{...size.image, backgroundImage: `url(${url})`}"
      />
      <div
        v-else
        key="circular"
        class="d-flex fill-height align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          :size="size.pending"
          :width="4"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import randomUtils from "@/utils/randomUtils";
import CDN from "@/mixins/CDN";
import service from "@/utils/service";
import Console from "@/utils/Console";

export default {
  name: "PreloaderInline",
  mixins: [CDN],
  props: {
    small: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      preloaders: [
        "croissant", "exusiai", "sora", "texas"
      ],
      ready: true,
      url: ''
    }
  },
  computed: {
    currentPreloaderIndex () {
      return randomUtils.randomInt(this.preloaders.length - 1)
    },
    currentSrc() {
      return this.cdnDeliver(`/images/preloaders/${this.preloaders[this.currentPreloaderIndex]}.png`)
    },
    size () {
      if (this.small) {
        return {
          image: {
            "--size": "64px"
          },
          pending: 32
        }
      } else {
        return {
          image: {
            "--size": "160px"
          },
          pending: 48
        }
      }
    }
  },
  created() {
    this.update()
  },
  methods: {
    update() {
      this.ready = false
      service.get(this.currentSrc, {
        withCredentials: false,
        responseType: "blob"
      })
        .then(({data}) => {
          console.log(data)
          const url = URL.createObjectURL(data)
          console.log(url)
          this.ready = true
          this.url = url
        })
        .catch((err) => {
          Console.info("PreloaderInline", "failed to update preloader image: ", err)
          // we could do nothing here :(
        })
    }
  }
}
</script>

<style scoped>
.animated-preloader {
  height: var(--size);
  width: var(--size);
  animation: preloader infinite;
  animation-duration: 270ms;
  animation-timing-function: steps(3, end);
  background-size: var(--size);
  background-repeat: no-repeat;
}
@keyframes preloader {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 calc(-3 * var(--size));
  }
}
.animated-preloader-wrapper {
  height: var(--size);
  width: var(--size);
}
</style>