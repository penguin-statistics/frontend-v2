import MatrixObjectManager from './base'
import commons from '../_common'

/** Represents a ObjectManager that was dedicated to utilize PersonalMatrix */
class PersonalMatrixObjectManager extends MatrixObjectManager {
  constructor(props) {
    super(props)
  }

  /**
   * Get the item, if the item doesn't exist, create the drop and return the item
   * @param {string} itemId the ID of the item
   * @param {string} stageId the ID of the stage
   * @returns {Object.<number, number>} corresponding drop matrix item
   */
  _getOrCreateDrop(itemId, stageId) {
    let item = this.cache.data.find(v => v.itemId === itemId && v.stageId === stageId);
    if (item === undefined) {
      this.cache.data.push({
        itemId: itemId,
        times: 0,
        quantity: 0,
        stageId: stageId
      });
      return this.cache.data.find(v => v.itemId === itemId && v.stageId === stageId)
    }
    return item
  }

  /**
   * Add drops to the manager
   * @param {Object.<number, number>[]} drops
   * @param {string} stageId
   */
  add({ drops, stageId }) {
    let context = this;
    for (let drop of drops) {
      let item = context._getOrCreateDrop(drop.itemId, stageId);
      item.quantity += drop.quantity;
      item.times += 1;
    }
  }
}

const personalMatrix = new PersonalMatrixObjectManager({
  name: 'personalMatrix',
  api: '/result/matrix?is_personal=true',
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default personalMatrix