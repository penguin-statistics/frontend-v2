import Theme from "@/mixins/hooks/Theme";
import Telemetry from "@/mixins/hooks/Telemetry";
import CrispCustomizer from "@/mixins/hooks/CrispCustomizer";
import Analytics from "@/mixins/hooks/Analytics";
import Localization from "@/mixins/hooks/Localization";
import RandomizedLogo from "@/mixins/hooks/RandomizedLogo";

export default {
  mixins: [
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