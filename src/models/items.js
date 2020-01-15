import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const items = new ObjectManager({
  name: 'items',
  api: '/items',
  ttl: 1000 * 60 * 60, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default items