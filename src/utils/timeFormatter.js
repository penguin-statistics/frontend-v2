import moment from 'moment'

const FORMATS = {
  MD: "M.D",
  YMD: "YYYY.M.D",
  HM: "H:mm",
  HMS: "H:mm:ss",
};

function needYear(moments) {
  for (let index in moments) {
    if (index === "0") continue;
    if (!(moments[index].isSame.apply(moments[index], [moments[index - 1], 'year']))) {
      return true
    }
  }
  return false
}

export default {
  moment,
  isOutdated(rangeEnd) {
    return moment().isAfter(rangeEnd)
  },
  dates (times) {
    times = times.map(ts => {
      return moment(ts)
    });
    let needsYear = needYear(times);
    times = times.map(time => {
      return time.format(`${needsYear ? FORMATS.YMD : FORMATS.MD} ${FORMATS.HM}`)
    });
    return times
  },
}
