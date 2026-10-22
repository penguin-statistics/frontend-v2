import { service } from '@/utils/service'
import { timeFlow } from '@/utils/rum'

export default {
  advancedQuery (queries) {
    return timeFlow('advanced_query', service.post('/result/advanced', queries), {
      queries: queries.queries.length,
      trend: queries.queries.some(query => query.interval !== undefined),
      personal: queries.queries.some(query => query.isPersonal)
    })
  }
}
