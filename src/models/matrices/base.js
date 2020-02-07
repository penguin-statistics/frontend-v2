import ObjectManager from '@/utils/objectManager'
import get from "@/utils/getters";

class MatrixObjectManager extends ObjectManager {
  /** Creates a matrix object manager */
  constructor({ name, api, ttl, ajaxHooks }) {
    super({
      name,
      api,
      transform: [
        (object) => {
          object = object.matrix;

          object.forEach(el => {
            const stage = get.stages.byStageId(el.stageId);
            el.stage = stage;
            el.zone = get.zones.byZoneId(stage.zoneId);
            el.item = get.items.byItemId(el.itemId);

            el.percentage = (el.quantity / el.times);
            el.percentageText = `${(el.percentage * 100).toFixed(2)}%`;
            el.apPPR = (stage.apCost / el.percentage).toFixed(2);
          });

          return object
        }
      ],
      ttl,
      ajaxHooks
    });
  }
}

export default MatrixObjectManager