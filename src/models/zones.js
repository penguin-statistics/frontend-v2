import ObjectManager from '@/utils/objectManager'
import commons from './_common'
import formatter from "@/utils/timeFormatter";

const ICON_MAP = {
  "MAINLINE": "mdi-checkerboard",
  "WEEKLY": "mdi-treasure-chest",
  "ACTIVITY": "mdi-sack"
};

const zones = new ObjectManager({
  api: '/zones',
  transform: [object => {
    object.icon = ICON_MAP[object.type];
    object.isActivity = object.type === "ACTIVITY";

    if (object.isActivity) {
      object.activityActiveTime = formatter.dates([object.openTime, object.closeTime]);
      object.isOutdated = formatter.isOutdated(object.closeTime)
    }
    return object
  }],
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default zones
