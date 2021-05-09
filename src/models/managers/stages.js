import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const stages = new ObjectManager({
  name: 'stages',
  api: {
    serverSensitive: true,

    url: (server) => `/stages?server=${server}`
  },
  transform: [
    (object) => {
      // object.push({"stageType":"PERMANENT","stageId":"test01_001","zoneId":"test01","code":"测试活动 1","code_i18n":{"ko":"测试活动 1 ko","ja":"测试活动 1 ja","en":"测试活动 1 en","zh":"测试活动 1 zh"},"apCost":6,"dropInfos":[{"itemId":"2001","dropType":"NORMAL_DROP","bounds":{"lower":2,"upper":4}},{"itemId":"30011","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30021","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30031","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30051","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30061","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"3003","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"2001","dropType":"EXTRA_DROP","bounds":{"lower":1,"upper":2}},{"itemId":"furni","dropType":"FURNITURE","bounds":{"lower":0,"upper":1}},{"dropType":"NORMAL_DROP","bounds":{"lower":1,"upper":1}},{"dropType":"SPECIAL_DROP","bounds":{"lower":0,"upper":0}},{"dropType":"EXTRA_DROP","bounds":{"lower":1,"upper":2}},{"itemId":"30041","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}}]})
      // object.push({"stageType":"PERMANENT","stageId":"test01_002","zoneId":"test01","code":"测试活动 2","code_i18n":{"ko":"测试活动 2 ko","ja":"测试活动 2 ja","en":"测试活动 2 en","zh":"测试活动 2 zh"},"apCost":6,"dropInfos":[{"itemId":"2001","dropType":"NORMAL_DROP","bounds":{"lower":2,"upper":4}},{"itemId":"30011","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30021","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30031","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30051","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"30061","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"3003","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}},{"itemId":"2001","dropType":"EXTRA_DROP","bounds":{"lower":1,"upper":2}},{"itemId":"furni","dropType":"FURNITURE","bounds":{"lower":0,"upper":1}},{"dropType":"NORMAL_DROP","bounds":{"lower":1,"upper":1}},{"dropType":"SPECIAL_DROP","bounds":{"lower":0,"upper":0}},{"dropType":"EXTRA_DROP","bounds":{"lower":1,"upper":2}},{"itemId":"30041","dropType":"EXTRA_DROP","bounds":{"lower":0,"upper":1}}]})
      // object.push({"stageType":"PERMANENT","stageId":"test01_003","zoneId":"test01","code":"测试活动 3","code_i18n":{"ko":"测试活动 3 ko","ja":"测试活动 3 ja","en":"测试活动 3 en","zh":"测试活动 3 zh 无dropInfos"},"apCost":6})
      //
      // object.push({"stageType":"PERMANENT","stageId":"test02_001","zoneId":"test02","code":"测试活动 2 1","code_i18n":{"ko":"测试活动 2 1 ko","ja":"测试活动 2 1 ja","en":"测试活动 2 1 en","zh":"测试活动 2 1 zh 无dropInfos"},"apCost":6})
      // object.push({"stageType":"PERMANENT","stageId":"test02_002","zoneId":"test02","code":"测试活动 2 2","code_i18n":{"ko":"测试活动 2 2 ko","ja":"测试活动 2 2 ja","en":"测试活动 2 2 en","zh":"测试活动 2 2 zh 无dropInfos"},"apCost":6})
      // object.push({"stageType":"PERMANENT","stageId":"test02_003","zoneId":"test02","code":"测试活动 2 3","code_i18n":{"ko":"测试活动 2 2 ko","ja":"测试活动 2 2 ja","en":"测试活动 2 2 en","zh":"测试活动 2 3 zh 空dropInfos"},"apCost":6,"dropInfos":[]})
      return object
    }
  ],
  validator: commons.defaultValidator,
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
})

export default stages
