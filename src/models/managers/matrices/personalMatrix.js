import commons from '../_common'
import MatrixObjectManager from './_base'

const personalMatrix = new MatrixObjectManager({
  name: 'personalMatrix',
  api: {
    requireAuthorization: true,
    serverSensitive: true,

    url: (server, category) => `/_private/result/matrix/${server}/personal/${category}`,
  },
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
})

export default personalMatrix
