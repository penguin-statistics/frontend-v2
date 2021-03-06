import MatrixObjectManager from './_base'
import commons from '../_common'

const personalMatrix = new MatrixObjectManager({
  name: 'personalMatrix',
  api: {
    requireAuthorization: true,
    serverSensitive: true,

    url: (server) => `/_private/result/matrix/${server}/personal`
  },
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
})

export default personalMatrix
