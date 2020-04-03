import timeFormatter from "@/utils/timeFormatter";

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
      return time && this.$i18n.locale === "zh"
    }
  },
}