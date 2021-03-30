import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const period = new ObjectManager({
  name: 'period',
  api: {
    url: '/period'
  },
  transform: [
    (object) => object
  ],
  validator: commons.defaultValidator,
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
})

export default period
