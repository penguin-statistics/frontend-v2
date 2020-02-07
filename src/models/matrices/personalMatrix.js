import MatrixObjectManager from './base'
import commons from '../_common'

const personalMatrix = new MatrixObjectManager({
  name: 'personalMatrix',
  api: '/result/matrix?show_closed_zones=true&is_personal=true',
  ttl: 1000 * 60 * 60 * 1, // 1 hours
  ajaxHooks: commons.defaultAjaxHooks
});

export default personalMatrix