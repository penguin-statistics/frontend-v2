import MatrixObjectManager from './base'
import commons from '../_common'

/** Represents a ObjectManager that was dedicated to utilize GlobalMatrix */
class GlobalMatrixObjectManager extends MatrixObjectManager {
  constructor(props) {
    super(props);
  }
}

const globalMatrix = new GlobalMatrixObjectManager({
  name: 'globalMatrix',
  api: '/result/matrix?show_closed_zones=true',
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default globalMatrix