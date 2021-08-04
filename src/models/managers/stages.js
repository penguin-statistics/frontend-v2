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
      object.push({
        "stageType": "ACTIVITY",
        "stageId": "act12side_zone1_001",
        "zoneId": "act12side_zone1",
        "code": "TEST-1",
        "apCost": 12,
        "existence": {
          "US": {
            "exist": false
          },
          "JP": {
            "exist": false
          },
          "KR": {
            "exist": false
          },
          "CN": {
            "exist": true
          }
        },
        "minClearTime": 192000,
        "code_i18n": {
          "ko": "TEST-1",
          "ja": "TEST-1",
          "en": "TEST-1",
          "zh": "TEST-1"
        },
        "dropInfos": [
          {
            "itemId": "30013",
            "dropType": "NORMAL_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "30021",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "30041",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "30051",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "2001",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "30022",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "30042",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "30052",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "2002",
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "itemId": "furni",
            "dropType": "FURNITURE",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "dropType": "NORMAL_DROP",
            "bounds": {
              "lower": 0,
              "upper": 1
            }
          },
          {
            "dropType": "SPECIAL_DROP",
            "bounds": {
              "lower": 0,
              "upper": 0
            }
          },
          {
            "dropType": "EXTRA_DROP",
            "bounds": {
              "lower": 1,
              "upper": 1
            }
          }
        ]
      })
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
