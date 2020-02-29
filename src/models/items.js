import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const items = new ObjectManager({
  name: 'items',
  api: '/items?i18n=true',
  transform: [
    (object) => {
      object.sort((a, b) => a.sortId - b.sortId)

      return object
    },
  ],
  ttl: 1000 * 60 * 60, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default items