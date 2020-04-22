export default {
  created () {
    // dark mode
    const dark = this.$store.getters["settings/dark"]
    if (typeof dark === "boolean") {
      this.$store.commit("settings/switchDark", this.dark ? "dark" : "light")
    } else if (dark === null || dark === undefined) {
      this.$store.commit("settings/switchDark", "system")
    }
  }
}