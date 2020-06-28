import get from "@/utils/getters"
import store from "@/store";

export default {
  planner: {
    config ({items, options, excludes}) {
      const sanitizedItems = [];

      for (const item of items.filter(el => el.need || el.have)) {
        const current = {
          id: item.id
        };
        if (item.have) current.have = item.have
        if (item.need) current.need = item.need
        sanitizedItems.push(current)
      }

      return {
        "@type": "@penguin-statistics/planner/config",
        items: sanitizedItems,
        options,
        excludes
      }
    },
    plan ({items, options, excludes}) {
      const body = {
        required: {},
        owned: {},
        extra_outc: options.byProduct,
        exp_demand: options.requireExp,
        gold_demand: options.requireLmb,
        store: options.calculateStore,
        input_lang: "id",
        output_lang: "id",
        server: store.getters["dataSource/server"]
      };

      items.forEach(el => {
        if (el.need) body.required[el.id] = el.need;
        if (el.have) body.owned[el.id] = el.have;
      });

      if (excludes.length > 0) {
        body["exclude"] = excludes.map(el => {
          el = get.stages.byStageId(el).code || el
          return el
        })
      }

      return body
    }
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