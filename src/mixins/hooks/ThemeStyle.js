import ThemeStyle from "@/mixins/ThemeStyle";
import specialPeriods from "@/utils/specialPeriods";

export default {
  mixins: [ThemeStyle],
  data() {
    return {
      nextTimer: null,
    };
  },
  created() {
    this.detect();
    this.enableInterval();
  },
  methods: {
    detect() {
      if (specialPeriods.miku()) return this.changeThemeStyle('miku2021', false)
      if (specialPeriods.aprilFools()) return this.changeThemeStyle('seaborn', false)

      const themeStyle = this.$store.getters['settings/themeStyle']
      if (themeStyle !== this.$store.state.ui.activeThemeStyle) return this.changeThemeStyle(themeStyle, false)
    },
    enableInterval() {
      this.nextTimer = setInterval(() => {
        this.detect()
      }, 60000)
    },
    disableInterval() {
      clearInterval(this.nextTimer)
    }
  }
}
