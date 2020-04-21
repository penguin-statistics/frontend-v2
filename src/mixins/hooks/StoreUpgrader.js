export default {
  created () {
    if (typeof this.dark === "boolean") {
      this.appDark = this.dark ? "dark" : "light"
    } else if (this.dark === null || this.dark === undefined) {
      this.appDark = "system"
    }
  }
}