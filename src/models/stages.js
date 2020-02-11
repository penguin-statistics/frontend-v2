import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const stages = new ObjectManager({
  name: 'stages',
  api: '/stages',
  transform: [
    (object) => {
      // object.push({"stageType":"ACTIVITY","stageId":"test01_001","zoneId":"test01","code":"测试活动 1","apCost":99,"normalDrop":["30011"],"specialDrop":[],"extraDrop":[], "isGacha": true})
      // object.push({"stageType":"ACTIVITY","stageId":"test01_002","zoneId":"test01","code":"测试活动 2","apCost":99,"normalDrop":["30011"],"specialDrop":[],"extraDrop":[], "isGacha": true})

      object.forEach(el => {
        el.dropsSet = [...el.normalDrop, ...el.extraDrop, ...el.specialDrop]
      });
      return object
    }
  ],
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default stages