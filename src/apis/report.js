import {service} from '@/utils/service'
import config from '@/config'
import store from '@/store'
// import { v4 as uuidv4 } from 'uuid'

// IdempotencyKey
export default {
  async submitReport({stageId, drops},patch) {
    return service.post("/report", {
      drops,
      stageId,
      server: store.getters["dataSource/server"],
      ...config.api.submitParams,
      ...patch
    })
  },
  async recallReport (submissionId) {
    return service.post("/report/recall", submissionId)
  }
}