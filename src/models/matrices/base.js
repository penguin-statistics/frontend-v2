import ObjectManager from '@/utils/objectManager'
import stages from '@/models/stages'
import items from '@/models/items'
import zones from '@/models/zones'

class MatrixObjectManager extends ObjectManager {
  /** Creates a matrix object manager */
  constructor({api, transform, ttl, ajaxHooks}) {
    super({
      api,
      transform: [
        (object) => {
          const stage = stages.getOne("stageId", object.stageId);
          object.stage = stage;
          object.zone = zones.getOne("zoneId", stage.zoneId);
          object.item = items.getOne("itemId", object.itemId);

          object.percentage = (object.quantity / object.times);
          object.percentageText = `${(object.percentage * 100).toFixed(2)}%`;
          object.apPPR = (stage.apCost / object.percentage).toFixed(2);

          return object
        },
        transform
      ],
      ttl,
      ajaxHooks
    });
  }
}

export default MatrixObjectManager