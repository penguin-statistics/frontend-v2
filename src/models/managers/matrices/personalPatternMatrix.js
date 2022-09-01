import commons from '../_common'
import MatrixObjectManager from './_base'

const personalPatternMatrix = new MatrixObjectManager({
  name: 'personalPatternMatrix',
  api: {
    requireAuthorization: true,
    serverSensitive: true,

    url: (server, category) => `/_private/result/pattern/${server}/personal/${category}`,
  },
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
})

export default personalPatternMatrix
