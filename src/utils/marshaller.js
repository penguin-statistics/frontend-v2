import get from "@/utils/getters"

export default {
  planner ({items, options, exclude}) {
    const body = {
      required: {},
      owned: {},
      extra_outc: false,
      exp_demand: false,
      gold_demand: false
    };

    items.forEach(el => {
      if (el.need) body.required[el.name] = el.need;
      if (el.have) body.owned[el.name] = el.have;
    });

    body.extra_outc = options.byProduct;
    body.exp_demand = options.requireExp;
    body.gold_demand = options.requireLmb;
    if (exclude.length > 0) {
      body["exclude"] = exclude.map(el => {
        el = get.stages.byStageId(el).code || el
        return el
      })
    }

    return body
  },
  advancedQuery(queries) {
    const marshalled = []
    for (const query of queries) {
      let start;
      let end;

      if (query.timeRange && query.timeRange[0]) start = new Date(query.timeRange[0]).getTime()
      if (query.timeRange && query.timeRange[1]) end = new Date(query.timeRange[1]).getTime()

      const marshalledQuery = {
        stageId: query.stage,
        itemIds: query.item,
        server: query.server,
        isPersonal: query.source === "personal",
        start,
        end
      }

      if (query.type === "trend") marshalledQuery["interval"] = query["interval"]

      marshalled.push(marshalledQuery)
    }
    return {queries: marshalled}
  }
}