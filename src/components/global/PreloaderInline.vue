<template>
  <div
    :style="dimensions.image"
    class="animated-preloader-wrapper"
  >
    <transition
      mode="in-out"
      appear
      duration="100"
      name="fade-transition"
    >
      <div
        v-if="ready"
        key="preloader"
        class="animated-preloader mx-auto"

        :style="{...dimensions.image, backgroundImage: `url(${url})`}"
      />
      <div
        v-else
        key="circular"
        class="d-flex fill-height align-center justify-center v-image__placeholder"
        style="z-index: 0"
      >
        <v-progress-circular
          indeterminate
          :size="dimensions.pending"
          :width="4"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import randomUtils from '@/utils/randomUtils'
import CDN from '@/mixins/CDN'
import { externalService } from '@/utils/service'
import Console from '@/utils/Console'

export default {
  name: 'PreloaderInline',
  mixins: [CDN],
  props: {
    small: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      preloaders: [
        'croissant', 'exusiai', 'sora', 'texas'
      ],
      ready: false,
      url: ''
    }
  },
  computed: {
    currentPreloaderIndex () {
      return randomUtils.randomInt(this.preloaders.length - 1)
    },
    currentSrc () {
      if (this.$store.getters['settings/themeStyle'] === 'seaborn') {
        return this.cdnDeliver('/images/themes/seaborn/mizuki-running.png')
      } else {
        return this.cdnDeliver(`/images/preloaders/${this.preloaders[this.currentPreloaderIndex]}.png`)
      }
    },
    dimensions () {
      const steps = this.$store.getters['settings/themeStyle'] === 'seaborn' ? 4 : 3
      if (this.size) {
        return {
          image: {
            '--size': this.size + 'px',
            '--steps': steps
          },
          pending: 32
        }
      } else if (this.small) {
        return {
          image: {
            '--size': '64px',
            '--steps': steps
          },
          pending: 32
        }
      } else {
        return {
          image: {
            '--size': '160px',
            '--steps': steps
          },
          pending: 48
        }
      }
    }
  },
  watch: {
    url (_, oldValue) {
      this.revoke(oldValue)
    }
  },
  beforeDestroy () {
    this.revoke(this.url)
  },
  created () {
    this.update()
  },
  methods: {
    revoke (url) {
      if (url !== '') {
        URL.revokeObjectURL(url)
        Console.debug('Preloader', 'revoked blob with URL', url)
      }
    },
    update () {
      this.ready = false
      externalService.get(this.currentSrc, {
        responseType: 'blob'
      })
        .then(({ data }) => {
          this.ready = true
          this.url = URL.createObjectURL(data)
        })
        .catch(() => {
          // we could do nothing here :(
        })
    }
  }
}
</script>

<style scoped>
.animated-preloader {
  --steps: 3;

  height: var(--size);
  width: var(--size);
  animation: preloader infinite;
  animation-duration: 270ms;
  animation-timing-function: steps(var(--steps), end);
  background-size: var(--size);
  background-repeat: no-repeat;
  z-index: 1;
}
@keyframes preloader {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 calc((0 - var(--steps)) * var(--size));
  }
}
.animated-preloader-wrapper {
  position: relative;
  height: var(--size);
  width: var(--size);
}
</style>
