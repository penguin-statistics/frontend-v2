import Theme from "@/mixins/hooks/Theme";
import Telemetry from "@/mixins/hooks/Telemetry";
import CrispCustomizer from "@/mixins/hooks/CrispCustomizer";
import Analytics from "@/mixins/hooks/Analytics";
import Localization from "@/mixins/hooks/Localization";
import RandomizedLogo from "@/mixins/hooks/RandomizedLogo";
import StoreUpgrader from "@/mixins/hooks/StoreUpgrader";

export default {
  mixins: [
    // top-most priority
    StoreUpgrader,

    // first priority
    Theme,
    Localization,

    // secondary priority
    RandomizedLogo,
    Telemetry,
    Analytics,

    // last priority
    CrispCustomizer
  ],
}