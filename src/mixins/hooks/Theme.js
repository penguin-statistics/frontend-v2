import {mapGetters} from "vuex";
import Console from "@/utils/Console";

export default {
  watch: {
    'dark': ['onDarkChange']
  },
  computed: {
    ...mapGetters('settings', ['dark']),
  },
  created () {
    this.onDarkChange(this.dark);
  },
  methods: {
    themeToggle (isDark) {
      this.$vuetify.theme.dark = isDark
      if (isDark) {
        document.body.style.backgroundColor = "#121212"
      } else {
        document.body.style.backgroundColor = "#ffffff"
      }
    },
    onDarkChange (newValue) {
      Console.info("Theme", "setting to", newValue)
      if (newValue === "dark") {
        this.themeToggle(true)
      } else if (newValue === "light") {
        this.themeToggle(false)
      } else if (newValue === "system") {
        const self = this;
        if (window.matchMedia) {
          // if support we then apply the current settings
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          this.themeToggle(mediaQuery.matches)
          // and we listen for any additional changes being applied
          // using deprecated `addListener` instead of `addEventListener`: iOS 13.4 doesn't support `addEventListener`
          // so the former one has been used. More at https://codepen.io/galvingao/pen/zYvoZeM.
          mediaQuery.addListener(function (e) {
            if (self.dark === "system") self.themeToggle(e.matches)
          })
        } else {
          // if the system doesn't support matchMedia, we then fallback to dark mode
          this.themeToggle(true)
        }
      }
    }
  }
}