import Theme from "@/mixins/hooks/Theme";
import Telemetry from "@/mixins/hooks/Telemetry";
import CrispCustomizer from "@/mixins/hooks/CrispCustomizer";
import Analytics from "@/mixins/hooks/Analytics";
import Localization from "@/mixins/hooks/Localization";
import RandomizedLogo from "@/mixins/hooks/RandomizedLogo";
import StoreUpgrader from "@/mixins/hooks/StoreUpgrader";
import Native from "@/mixins/hooks/Native";
import Probe from "@/mixins/hooks/Probe";

export default {
  mixins: [
    // top-most priority
    StoreUpgrader,
    Native,

    // first priority
    Theme,
    Localization,

    // secondary priority
    RandomizedLogo,
    Telemetry,
    Analytics,
    Probe,

    // last priority
    CrispCustomizer
  ],
}