import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const trends = new ObjectManager({
  name: 'trends',
  api: '/result/trends',
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default trends