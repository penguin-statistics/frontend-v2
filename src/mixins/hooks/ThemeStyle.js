import ThemeStyle from "@/mixins/ThemeStyle";
import specialPeriods from "@/utils/specialPeriods";

export default {
  mixins: [ThemeStyle],
  created () {
    if (specialPeriods.miku2021()) return this.changeThemeStyle('miku2021', false)

    const themeStyle = this.$store.getters['settings/themeStyle']
    if (themeStyle !== this.$store.state.ui.activeThemeStyle) return this.changeThemeStyle(themeStyle, false)
  }
}
