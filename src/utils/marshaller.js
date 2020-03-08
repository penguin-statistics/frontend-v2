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
      body["exclude"] = ["6-1","6-10","6-11","6-12","6-14","6-15","6-16","6-2","6-3","6-4","6-5","6-8","6-9","S6-1","S6-2","S6-3","S6-4"]
    }

    return body
  }
}