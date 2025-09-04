import ThemeStyle from "@/mixins/ThemeStyle";
import specialPeriods from "@/utils/specialPeriods";
import Console from "@/utils/Console";

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
      Console.info('ThemeStyle', 'detecting theme style...')
      if (specialPeriods.miku()) {
        Console.info('ThemeStyle', 'special period detected: miku2021')
        return this.changeThemeStyle('miku2021', false)
      }
      if (specialPeriods.aprilFools()) {
        Console.info('ThemeStyle', 'special period detected: april fools')
        return this.changeThemeStyle('seaborn', false)
      }
      if (specialPeriods.avemujica()) {
        Console.info("ThemeStyle", "special period detected: avemujica");
        return this.changeThemeStyle("avemujica", false);
      }

      const themeStyle = this.$store.getters['settings/themeStyle']
      if (themeStyle !== this.$store.state.ui.activeThemeStyle) {
        Console.info('ThemeStyle', 'theme style changed:', themeStyle)
        return this.changeThemeStyle(themeStyle, false)
      }
    },
    enableInterval() {
      this.nextTimer = setInterval(() => {
        this.detect()
      }, 60 * 1000)
    },
    disableInterval() {
      clearInterval(this.nextTimer)
    }
  }
}
