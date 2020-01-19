import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const stages = new ObjectManager({
  name: 'stages',
  api: '/stages',
  transform: [
    (object) => {
      object.forEach(el => {
        el.dropsSet = [...el.normalDrop, ...el.extraDrop, ...el.specialDrop]
      });
      object.push(
        {"stageType":"ACTIVITY","stageId":"teststage01","zoneId":"testzone","code":"TE-ST-01","apCost":6,"normalDrop":["30031"],"specialDrop":[],"extraDrop":[],"dropsSet":["30031"]},
        {"stageType":"ACTIVITY","stageId":"teststage02","zoneId":"testzone","code":"TEST-02","apCost":6,"normalDrop":["30031"],"specialDrop":[],"extraDrop":[],"dropsSet":["30031"]},
      )
      return object
    }
  ],
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default stages