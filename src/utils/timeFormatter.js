import dayjs from 'dayjs'
import 'dayjs/locale/zh'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
const relativeTime = require('dayjs/plugin/relativeTime')
import 'dayjs/locale/zh'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import i18n from "@/i18n";
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

const FORMATS = {
  MD: "M.D",
  YMD: "YY.M.D",
  HM: "H:mm",
  HMS: "H:mm:ss",
};

function needYear(moments) {
  for (const index in moments) {
    if (index === "0") continue;
    if (!dayjs().isSame(moments[index], 'year') || !(moments[index].isSame.apply(moments[index], [moments[index - 1], 'year']))) {
      return true
    }
  }
  return false
}

export default {
  get dayjs () {
    dayjs.locale(i18n.locale)
    return dayjs
  },
  isOutdated(rangeEnd) {
    return dayjs().isAfter(rangeEnd)
  },
  dates (times, includeTime=true) {
    times = times.map(ts => {
      return dayjs(ts)
    });
    let needsYear = needYear(times);
    times = times.map(time => {
      if (includeTime) return time.format(`${needsYear ? FORMATS.YMD : FORMATS.MD} ${FORMATS.HM}`)
      return time.format(`${needsYear ? FORMATS.YMD : FORMATS.MD}`)
    });
    return times
  },
  date (date, detectSameYear=false, includeTime=false) {
    let template = FORMATS.MD;
    if (detectSameYear) {
      const isSameYear = dayjs(date).isSame(dayjs(), 'year')
      template = isSameYear ? FORMATS.MD : FORMATS.YMD
    }
    if (includeTime) template += ` ${FORMATS.HM}`
    return dayjs(date).format(template)
  },
  startEnd (start, end) {
    if (start && end) {
      return i18n.t('stats.timeRange.inBetween', this.dates([start, end], false))
    } else if (start && !end) {
      return i18n.t('stats.timeRange.toPresent', {date: this.date(start, true)})
    } else if (!start && end) {
      return i18n.t('stats.timeRange.endsAt', {date: this.date(end, true)})
    } else {
      return i18n.t('stats.timeRange.unknown')
    }
  }
}
