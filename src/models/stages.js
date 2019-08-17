import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const stages = new ObjectManager({
  api: '/stages',
  transform: [object => {
    object.dropsSet = [
      ...object.normalDrop,
      ...object.extraDrop,
      ...object.specialDrop
    ];
    return object
  }],
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default stages
