export default {
  planner ({items, options}) {
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
    if (options.foreignServer) {
      body["exclude"] = [
        // Chapter 6
        "6-1","6-10","6-11","6-12","6-14","6-15","6-16","6-2","6-3","6-4","6-5","6-8","6-9","S6-1","S6-2","S6-3","S6-4",
        // DM Activity
        "DM-1","DM-2","DM-3","DM-4","DM-5","DM-6","DM-7","DM-8",
        // Chapter 7
        "7-2","7-3","7-4","7-5","7-6","7-8","7-9","7-10","7-11","7-12","7-13","7-14","7-15","7-16","7-17","7-18","S7-1","S7-2"
      ]
    }

    return body
  }
}