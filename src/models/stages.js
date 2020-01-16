import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const stages = new ObjectManager({
  name: 'stages',
  api: '/stages',
  transform: [
    (object) => {
      object.forEach(el => {
        el.dropsSet = [...el.normalDrop, ...el.extraDrop, ...el.specialDrop]
      });
      return object
    }
  ],
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default stages