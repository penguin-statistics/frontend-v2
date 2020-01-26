import MatrixObjectManager from './base'
import commons from '../_common'

const globalMatrix = new MatrixObjectManager({
  name: 'globalMatrix',
  api: '/result/matrix?show_closed_zones=true',
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default globalMatrix