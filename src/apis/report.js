import { service } from '@/utils/service'
import config from '@/config'
import store from '@/store'
let encodeBody
try {
  encodeBody = require('../vendors/penguin-crypto/')
} catch (e) {
  encodeBody = body => body
}

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
    let body = {
      batchDrops,
      server: store.getters['dataSource/server'],
      ...config.api.submitParams,
      ...patch
    }
    /*
      API Not Support
      body = encodeBody(body);
     */
    console.log(encodeBody(body))
    body = encodeBody(body)
    return service.post('/report/recognition', body, { headers: { 'Content-Type': 'text/plain' } })
  }
}
