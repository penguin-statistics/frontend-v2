import service from '@/utils/service'
import config from '@/config'
import store from '@/store'

export default {
  async submitReport({stageId, drops}) {
    return service.post("/report", {
      drops,
      stageId,
      server: store.getters["dataSource/server"],
      ...config.api.submitParams
    })
  },
  async recallReport (submissionId) {
    return service.post(`/report/recall?item_drop_hash_id=${submissionId}`)
  }
}