import objectManager from '@/utils/objectManager'
import commons from './_common'

const items = new objectManager({
  id: 'items',
  // TODO: migrate getters to here
  transform: (object) => {
    return object
  },
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default items
