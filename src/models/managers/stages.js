import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const stages = new ObjectManager({
  name: 'stages',
  api: {
    serverSensitive: true,

    url: '/stages',
    extraParams: {
      "show_closed_zones": true
    }
  },
  transform: [
    (object) => {
      // object.push({"stageType":"ACTIVITY","stageId":"test01_001","zoneId":"test01","code":"测试活动 1","apCost":99,"normalDrop":["30011"],"specialDrop":[],"extraDrop":[], "isGacha": true})
      // object.push({"stageType":"ACTIVITY","stageId":"test01_002","zoneId":"test01","code":"测试活动 2","apCost":99,"normalDrop":["30011"],"specialDrop":[],"extraDrop":[], "isGacha": true})
      return object
    }
  ],
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
});

export default stages