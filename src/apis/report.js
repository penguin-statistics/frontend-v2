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
  }
}