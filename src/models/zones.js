import ObjectManager from '@/utils/objectManager'
import commons from './_common'
import formatter from "@/utils/timeFormatter";

function getIcon (key) {
  const ICON_MAP = {
    "MAINLINE": "mdi-checkerboard",
    "WEEKLY": "mdi-treasure-chest",
    "ACTIVITY": "mdi-sack"
  };
  return ICON_MAP[key]
}

const zones = new ObjectManager({
  name: 'zones',
  api: '/zones?i18n=true',
  transform: [
    (object) => {
      // object.push({"zoneId":"test01","zoneIndex":0,"type":"ACTIVITY","zoneName":"测试活动","openTime":1577174400000,"closeTime":1598340799000,"stages":["test01_001","test01_002"],"zoneName_i18n":{"ja":"测试活动 ja","en":"测试活动 en","zh":"测试活动 zh"}})

      object.forEach((el) => {
        el.icon = getIcon(el.type);

        el.isActivity = el.type === "ACTIVITY";
        if (el.isActivity) {
          el.activityActiveTime = formatter.dates([el.openTime, el.closeTime]);

          el.isOutdated = formatter.isOutdated(el.closeTime)
        }
      });
      return object
    }
  ],
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default zones