import { externalService } from '@/utils/service'
import { timeFlow } from '@/utils/rum'

export default {
  plan (data) {
    return timeFlow('planner_plan', externalService.post('https://planner.penguin-stats.io/plan', data), {
      server: data.server,
      required_items: Object.keys(data.required).length,
      owned_items: Object.keys(data.owned).length,
      excluded_stages: data.exclude ? data.exclude.length : 0
    }, ({ data }) => (data && data.error ? 'failure' : 'success'))
  }
}
