import Console from "@/utils/Console";

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
      Console.info("StoreMigrater", "deleting old data structure");
      for (const key of oldDataKeys) {
        delete this.$store.state.data[key]
      }
    }
  }
}