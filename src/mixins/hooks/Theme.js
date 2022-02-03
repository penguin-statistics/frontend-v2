import { mapGetters } from 'vuex'
import Console from '@/utils/Console'
import environment from '@/utils/environment'
import ThemeStyle from "@/mixins/ThemeStyle";
import { Plugin } from '@capacitor/core';

export default {
  mixins: [ThemeStyle],
  watch: {
    dark: ['onDarkChange']
  },
  computed: {
    ...mapGetters('settings', ['dark'])
  },
  created () {
    this.onDarkChange(this.dark)
  },
  data () {
    return {
      ignoreAutoDetection: false
    }
  },
  methods: {
    themeToggle (isDark) {
      const windowsIndicator = environment.isWindows ? 'platform--windows' : 'platform--not-windows'
      this.$vuetify.theme.dark = isDark
      if (isDark) {
        document.documentElement.classList.add('vuetify-theme--dark', windowsIndicator)
        document.body.style.backgroundColor = '#121212'
      } else {
        document.documentElement.classList.add('vuetify-theme--light', windowsIndicator)
        document.body.style.backgroundColor = '#f5f5f5'
      }

      this.triggerThemeUpdate()
    },
    onDarkChange (newValue) {
      Console.info('Theme', 'setting to', newValue)
      if (newValue === 'dark') {
        this.themeToggle(true)

      } else if (newValue === 'light') {
        this.themeToggle(false)

      } else if (newValue === 'system') {
        this.initiateAutoDetection()
      }
    },
    async initiateAutoDetection () {
      const self = this
      if (window.matchMedia && !environment.isAppAndroid) {
        // if support we then apply the current settings
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        this.themeToggle(mediaQuery.matches)
        // and we listen for any additional changes being applied
        // using deprecated `addListener` instead of `addEventListener`: iOS 13.4 doesn't support `addEventListener`
        // so the former one has been used. More at https://codepen.io/galvingao/pen/zYvoZeM.
        mediaQuery.addListener(function (e) {
          if (self.dark === 'system' && self.ignoreAutoDetection === false) {
            self.themeToggle(e.matches)
          }
        })
      } else if (environment.isAppAndroid) {
        const isDark = await Plugin.PenguinPlugin.isDarkMode()
        this.themeToggle(isDark)

        Plugin.PenguinPlugin.addListener('onDarkModeChange', (isDark) => {
          if (self.dark === 'system' && self.ignoreAutoDetection === false) {
            self.themeToggle(isDark)
          }
        })
      } else {
        // if the system doesn't support matchMedia, we then fallback to dark mode
        this.themeToggle(true)
      }
    },
    terminateAutoDetection() {
      this.ignoreAutoDetection = true
    }
  }
}
