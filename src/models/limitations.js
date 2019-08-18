import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const limitations = new ObjectManager({
  name: 'limitations',
  api: '/limitations',
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default limitations