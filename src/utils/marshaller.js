import store from '@/store'
import supports from '@/models/supports'

export default {
  planner: {
    config ({ items, options, excludes }) {
      const sanitizedItems = []

      for (const item of items.filter(el => el.need || el.have)) {
        const current = {
          id: item.id
        }
        if (item.have) current.have = item.have
        if (item.need) current.need = item.need
        sanitizedItems.push(current)
      }

      return {
        '@type': '@penguin-statistics/planner/config',
        items: sanitizedItems,
        options,
        excludes
      }
    },
    plan ({ items, options, excludes }) {
      const body = {
        required: {},
        owned: {},
        extra_outc: options.byProduct,
        exp_demand: options.requireExp,
        gold_demand: options.requireLmb,
        input_lang: 'id',
        output_lang: 'id',
        server: store.getters['dataSource/server']
      }

      items.forEach(el => {
        if (el.need) body.required[el.id] = el.need
        if (el.have) body.owned[el.id] = el.have
      })

      if (excludes.length > 0) {
        body.exclude = excludes
      }

      return body
    }
  },
  advancedQuery (queries) {
    const marshalled = []
    for (const query of queries) {
      let start
      let end

      if (query.timeRange && query.timeRange[0]) start = new Date(query.timeRange[0]).getTime()
      if (query.timeRange && query.timeRange[1]) end = new Date(query.timeRange[1]).getTime()

      const marshalledQuery = {
        stageId: query.stage,
        itemIds: query.item,
        server: query.server,
        isPersonal: query.source === 'personal',
        sourceCategory: query.category,
        start,
        end
      }

      if (query.type === 'trend') marshalledQuery.interval = query.interval

      marshalled.push(marshalledQuery)
    }
    return { queries: marshalled }
  },
  pushPreferences (preferences) {
    const marshalled = []
    for (const preference of preferences) {
      marshalled.push({
        ...preference,
        locale: supports.localizations.find(el => el.value === preference.locale).push
      })
    }
    return marshalled
  }
}
