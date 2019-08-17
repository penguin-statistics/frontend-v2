import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const ITEM_META_MAP = {
  CARD_EXP: {
    name: "作战记录",
    icon: "mdi-card-bulleted",
    color: "light-blue"
  },
  MATERIAL: {
    name: "材料",
    icon: "mdi-cube-outline",
    color: "lime"
  },
  FURN: {
    name: "家具",
    icon: "mdi-lamp",
    color: "blue-grey"
  }
};

const items = new ObjectManager({
  api: '/items',
  transform: [(object) => {
    object.meta = ITEM_META_MAP[object.itemType];
    object.sort((a, b) => a.sortId - b.sortId);
    return object
  }],
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default items
