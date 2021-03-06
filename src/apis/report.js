import { service } from '@/utils/service'
import config from '@/config'
import store from '@/store'
let RecognitionRequestBodyEncrypt
try {
  RecognitionRequestBodyEncrypt = require('../vendors/penguin-crypto/')
} catch (e) {
  RecognitionRequestBodyEncrypt = function (d) {
    return d
  }
}
// import { v4 as uuidv4 } from 'uuid'

// IdempotencyKey
export default {
  async submitReport ({ stageId, drops }, patch) {
    return service.post('/report', {
      drops,
      stageId,
      server: store.getters['dataSource/server'],
      ...config.api.submitParams,
      ...patch
    })
  },
  async recallReport (submissionId) {
    return service.post('/report/recall', submissionId)
  },
  async submitRecognitionReport (batchDrops, patch) {
    console.log(batchDrops)
    let RequestData = {
      batchDrops,
      server: store.getters['dataSource/server'],
      ...config.api.submitParams,
      ...patch
    }
    /*
      API Not Support
      RequestData = RecognitionRequestBodyEncrypt(RequestData);
     */
    console.log(RecognitionRequestBodyEncrypt(RequestData))
    RequestData = RecognitionRequestBodyEncrypt(RequestData)
    return service.post('/report/recognition', RequestData, { headers: { 'Content-Type': 'text/plain' } })
  }
}
