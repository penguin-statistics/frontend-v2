import timeFormatter from "@/utils/timeFormatter";
import i18n from "@/i18n"

export default {
  fool () {
    return i18n.locale === "zh" && timeFormatter.dayjs().isBetween('2020-04-01', '2020-04-02', 'day', '[)')
  }
}