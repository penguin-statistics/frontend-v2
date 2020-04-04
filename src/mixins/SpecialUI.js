import Console from "@/utils/Console";

export default {
  computed: {
    isInSpecialUI () {
      const time = new Date().getTime() >= 1585929600000 && new Date().getTime() <= 1586031000000
      Console.debug(
        "Special UI conditions matching:",
        "In special ui time duration",
        time,
        "| current time parsed as",
        new Date().toString(),
        "| locale is",
        this.$i18n.locale
      );
      return time && this.$i18n.locale === "zh"
    }
  },
}