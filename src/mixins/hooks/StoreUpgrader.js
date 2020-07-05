import Console from "@/utils/Console";
// import I18n from "@/mixins/I18n";

export default {
  created () {
    // dark mode
    const dark = this.$store.getters["settings/dark"]
    if (typeof dark === "boolean") {
      this.$store.commit("settings/switchDark", this.dark ? "dark" : "light")
    } else if (dark === null || dark === undefined) {
      this.$store.commit("settings/switchDark", "system")
    }

    // new data
    const oldDataKeys = ["items", "limitations", "stages", "trends", "zones", "personalMatrix", "globalMatrix"];
    if (Object.keys(this.$store.state.data).some(key => ~oldDataKeys.indexOf(key))) {
      Console.info("StoreUpgrader", "deleting old data structure");
      for (const key of oldDataKeys) {
        delete this.$store.state.data[key]
      }
      this.$store.dispatch("data/fetch", true);
    }

    // remove deprecated penguin-stats-cacheTTL (cacheUpdatedAt)
    localStorage.removeItem("penguin-stats-cacheTTL")

    let settings = JSON.parse(localStorage.getItem("penguin-stats-settings"))
    if (settings && settings["settings"] && settings["settings"]["excludedStages"]) {
      delete settings["settings"]["excludedStages"]
      localStorage.setItem("penguin-stats-settings", JSON.stringify(settings))
    }


    // if (this.$store.getters["settings/language"] === "zh") {
    //   this.changeLocale("zh-CN")
    // }
  }
}