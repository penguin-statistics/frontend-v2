import timeFormatter from "@/utils/timeFormatter";
import Console from "@/utils/Console";

export default {
  miku() {
    // -> 03-09 00:00:00 ~ 03-09 23:59:59
    // -> 08-31 00:00:00 ~ 08-31 23:59:59 for every year. use user local time.
    const now = timeFormatter.dayjs();
    const ranges = [
      [now.month(2).date(9).startOf("day"), now.month(2).date(9).endOf("day")],
      [
        now.month(7).date(31).startOf("day"),
        now.month(7).date(31).endOf("day"),
      ],
    ];
    return ranges.some(([start, end]) => now.isBetween(start, end));
  },
  aprilFools() {
    // -> 04-01 00:00:00 (forced to interpret as UTC+8) ~ 04-01 23:59:59 (user local time) for every year. use user local time.
    const now = timeFormatter.dayjs();
    const ranges = [
      // [now.month(3).date(1).startOf("day"), now.month(3).date(1).endOf("day")],
      [
        timeFormatter.dayjs("2023-04-01T00:00:00+0800").year(now.year()),
        now.month(3).date(1).endOf("day"),
      ],
    ];
    Console.debug(
      "SpecialPeriods",
      "aprilFools: from",
      ranges[0][0].format(),
      "to",
      ranges[0][1].format()
    );
    return ranges.some(([start, end]) => now.isBetween(start, end));
  },
  avemujica() {
    // -> 2025-09-04 16:00:00 (forced to interpret as UTC+8) ~ 2025-09-25 03:59:59 (forced to interpret as UTC+8)
    const now = timeFormatter.dayjs();
    const ranges = [
      [
        timeFormatter.dayjs("2025-09-04T16:00:00+0800"),
        timeFormatter.dayjs("2025-09-25T03:59:59+0800"),
      ],
    ];
    Console.debug(
      "SpecialPeriods",
      "avemujica: from",
      ranges[0][0].format(),
      "to",
      ranges[0][1].format()
    );
    return ranges.some(([start, end]) => now.isBetween(start, end));
  },
  any() {
    return this.miku() || this.aprilFools();
  },
};
