import MatrixObjectManager from './_base'
import commons from '../_common'

const personalPatternMatrix = new MatrixObjectManager({
  name: 'personalPatternMatrix',
  api: {
    requireAuthorization: true,
    serverSensitive: true,

    url: (server) => `/_private/result/matrix/${server}/personal`,
  },
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
});

export default personalPatternMatrix