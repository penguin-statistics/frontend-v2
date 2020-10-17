import {externalService} from '@/utils/service'

export default {
  plan (data) {
    return externalService.post("https://planner.penguin-stats.io/plan", data)
  }
}