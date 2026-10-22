import Theme from '@/mixins/hooks/Theme'
import Telemetry from '@/mixins/hooks/Telemetry'
import Analytics from '@/mixins/hooks/Analytics'
import Localization from '@/mixins/hooks/Localization'
import RandomizedLogo from '@/mixins/hooks/RandomizedLogo'
import StoreUpgrader from '@/mixins/hooks/StoreUpgrader'
import Native from '@/mixins/hooks/Native'
import ThemeStyle from "@/mixins/hooks/ThemeStyle";
import FeaturedTheme from "@/mixins/hooks/FeaturedTheme";
import StatsRoute from "@/mixins/hooks/StatsRoute";

export default {
  mixins: [
    // top-most priority
    StoreUpgrader,
    Native,

    // first priority
    Theme,
    ThemeStyle,
    Localization,
    FeaturedTheme,
    // after the locale has been applied, and before App fetches the data
    StatsRoute,

    // secondary priority
    RandomizedLogo,
    Telemetry,
    Analytics
  ]
}
