import MatrixObjectManager from './_base'
import commons from '../_common'

const personalMatrix = new MatrixObjectManager({
  name: 'personalMatrix',
  api: {
    serverSensitive: true,
    requireAuthorization: true,

    url: '/result/matrix',
    extraParams: {
      "show_closed_zones": true,
      "is_personal": true
    }
  },
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
});

export default personalMatrix