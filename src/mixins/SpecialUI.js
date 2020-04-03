import timeFormatter from "@/utils/timeFormatter";
import Console from "@/utils/Console";

export default {
  computed: {
    isInSpecialUI () {
      const time = timeFormatter.dayjs()
        .isBetween(
          '2020-04-04T00:00:00+0800',
          '2020-04-05T04:10:00+0800',
          null,
          '[)'
        );
      Console.info("in special ui time duration", time, "| current time parsed as", timeFormatter.dayjs().toString());
      return time && this.$i18n.locale === "zh"
    }
  },
}