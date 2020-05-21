import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const items = new ObjectManager({
  name: 'stats',
  api: {
    serverSensitive: true,

    url: "/stats/",
  },
  transform: [
    (object) => object,
  ],
  ttl: 1000 * 60 * 10, // 10 minutes
  ajaxHooks: commons.defaultAjaxHooks
});

export default items