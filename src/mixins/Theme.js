import Console from "@/utils/Console";

export default {
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
        if (window.matchMedia) {
          // if support we then apply the current settings
          const getMatch = () => {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
          }
          this.themeToggle(getMatch())
          // and we listen for any additional changes being applied
          window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function() {
              this.themeToggle(getMatch())
            })
        } else {
          // if the system doesn't support matchMedia, we then fallback to dark mode
          this.themeToggle(true)
        }
      }
    }
  }
}