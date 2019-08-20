import service from '@/utils/service'
import config from '@/config'

export default {
  async submitReport({stageId, drops, furnitureNum}) {
    return service.post("/report", {
      drops,
      furnitureNum,
      stageId,
      ...config.api.submitParams
    })
  },
  async recallReport (submissionId) {
    return service.post(`/report/recall?item_drop_hash_id=${submissionId}`)
  }
}