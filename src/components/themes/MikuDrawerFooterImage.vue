<template>
  <div v-if="$store.state.ui.activeThemeStyle === 'miku2021'">
    <v-img
      :src="cdnDeliver('/images/themes/miku2021/portrait.png')"
      style="position: absolute; bottom: 0; z-index: 0"
      position="bottom right"
      height="calc(250px + 10vh)"
      width="100%"
      :aspect-ratio="1"
      class="v-image--fade-down fallthrough"
    />

    <v-theme-provider dark>
      <v-hover>
        <template #default="{ hover }">
          <div
            style="position: absolute; width: 100%; height: 48px; bottom: 0; right: 0; z-index: 0; user-select: none; background: linear-gradient(to top, #39c5bb, rgba(57,197,187, 0)); text-shadow: 0 0 4px rgba(0, 0, 0, .5)"
            class="d-flex align-center justify-center text-center overline cursor-default"
          >
            <span class="d-flex flex-row align-center justify-center white--text pt-1">
              <v-slide-x-reverse-transition>
                <span
                  v-if="hover"
                  class="degraded-opacity"
                >❤</span>
              </v-slide-x-reverse-transition>
              <div
                class="mx-1"
                style="max-width: 15rem"
              >{{ $t('specials.mikubirthday2021.caption') }}</div>
              <v-slide-x-transition>
                <span
                  v-if="hover"
                  class="degraded-opacity"
                >❤</span>
              </v-slide-x-transition>
            </span>
          </div>
        </template>
      </v-hover>
    </v-theme-provider>
  </div>
</template>

<script>
import CDN from '@/mixins/CDN'

export default {
  name: 'MikuDrawerFooterImage',
  mixins: [CDN]
}
</script>
