import dayjs from "dayjs";

export default {
  miku() {
    // -> 03-09 00:00:00 ~ 03-09 23:59:59
    // -> 08-31 00:00:00 ~ 08-31 23:59:59 for every year. use user local time.
    const now = dayjs();
    const ranges = [
      [now.month(2).date(9).startOf("day"), now.month(2).date(9).endOf("day")],
      [now.month(7).date(31).startOf("day"), now.month(7).date(31).endOf("day")],
    ];
    return ranges.some(([start, end]) => now.isBetween(start, end));
  },
  aprilFools() {
    // -> 04-01 00:00:00 ~ 04-01 23:59:59 for every year. use user local time.
    const now = dayjs();
    const ranges = [
      [now.month(3).date(1).startOf("day"), now.month(3).date(1).endOf("day")],
    ];
    return ranges.some(([start, end]) => now.isBetween(start, end));
  },
  any() {
    return this.miku() || this.aprilFools();
  }
}
