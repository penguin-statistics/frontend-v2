import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const zones = new ObjectManager({
  name: 'zones',
  api: '/zones',
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default zones