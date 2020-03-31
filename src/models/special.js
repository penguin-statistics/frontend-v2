import timeFormatter from "@/utils/timeFormatter";

export default {
  fool () {
    return this.$i18n.locale === "zh" && timeFormatter.dayjs().isBetween('2020-04-01', '2020-04-02', 'day', '[)')
  }
}