import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const limitations = new ObjectManager({
  api: '/limitations',
  transform: [object => object],
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default limitations
