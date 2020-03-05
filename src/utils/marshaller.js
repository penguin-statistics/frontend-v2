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

    return body
  }
}