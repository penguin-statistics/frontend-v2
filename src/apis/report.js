import { service } from '@/utils/service'
import config from '@/config'
import store from '@/store'
import { timeFlow } from '@/utils/rum'

export default {
  async submitReport ({ stageId, drops }, patch) {
    const server = store.getters['dataSource/server']
    return timeFlow('report_submit', service.post('/report', {
      drops,
      stageId,
      server,
      ...config.api.submitParams,
      ...patch
    }), { stage_id: stageId, server, drops: drops.length })
  },
  async recallReport (submissionId) {
    return timeFlow('report_recall', service.post('/report/recall', submissionId))
  }
}
