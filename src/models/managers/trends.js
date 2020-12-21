import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const trends = new ObjectManager({
  name: 'trends',
  api: {
    serverSensitive: true,

    url: (server) => `/_private/result/trend/${server}`,
  },
  transform: [
    (object) => {
      return object["trend"]
    },
  ],
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default trends