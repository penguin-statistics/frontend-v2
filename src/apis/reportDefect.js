import { service } from '@/utils/service'

export default {
  async initDefectReport ({ environment, recognitionResult }) {
    return service.post('/recognition/defects/report/init', {
      environment,
      recognitionResult
    })
  },

}
