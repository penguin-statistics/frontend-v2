import ObjectManager from '@/utils/objectManager'
import commons from './_common'

const items = new ObjectManager({
  name: 'items',
  api: '/items?i18n=true',
  transform: [
    (object) => {
      const META_MAP = {
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
        },
        ACTIVITY_ITEM: {
          name: "活动道具",
          icon: "mdi-treasure-chest",
          color: "blue"
        }
      };

      object.forEach(el => {
        el.meta = META_MAP[el.itemType]
      });

      object.sort((a, b) => a.sortId - b.sortId)

      return object
    },
  ],
  ttl: 1000 * 60 * 60, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default items