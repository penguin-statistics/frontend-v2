import store from '@/store'
import formatter from "@/utils/timeFormatter";
// import Console from "@/utils/Console";

const Getters = {};

Getters.items = {
  _cache: null,
  all(map = false) {
    let items = store.getters["data/content"]({id: "items"});
    if (!items) return []

    items = items.filter(item => {
      return item["existence"][store.getters["dataSource/server"]]["exist"]
    })

    if (map) {
      if (!this._cache) this._cache = new Map(items.map(item => [item.itemId, item]))
      return this._cache
    } else {
      return items
    }
  },
  byItemId(itemId) {
    const got = this.all();
    if (!got) return {};
    return got.find(el => el.itemId === itemId) || {}
  },
  byName (name) {
    const got = this.all();
    if (!got) return {};
    return got.find(el => el.name === name) || {}
  },
}

// Getters.limitations = {
//   byStageId(stageId) {
//     return store.getters["data/content"]({id: "stages"}).find(el => {
//       return el.name === stageId
//     })
//   }
// }

Getters.statistics = {
  base (filter) {
    const matrix = store.getters["data/content"]({id: `${store.getters["dataSource/source"]}Matrix`});
    if (!matrix) return null;
    return matrix
      .filter(filter)
      .map(el => {
        const stage = Getters.stages.byStageId(el.stageId);
        el.stage = stage;
        el.percentage = (el.quantity / el.times);
        el.percentageText = `${(el.percentage * 100).toFixed(2)}%`;

        el.apPPR = (stage.apCost / el.percentage).toFixed(2)
        return el
      });
  },
  byItemId(itemId) {
    const matrix = this.base(el => {
      return el.itemId === itemId
    })
    if (!matrix) return []

    return matrix.map(el => {
      el.zone = Getters.zones.byZoneId(el.stage.zoneId);
      return el
    });
  },
  byStageId(stageId) {
    const matrix = this.base(el => {
      return el.stageId === stageId
    })
    if (!matrix) return []

    return matrix.map(el => {
      el.item = Getters.items.byItemId(el.itemId);
      return el
    });
  },
}

Getters.stages = {
  all() {
    const stages = store.getters["data/content"]({id: "stages"})
    if (!stages) return []
    return stages
  },
  byStageId(stageId) {
    return this.all().find(el => {
      return el.stageId === stageId
    }) || {}
  },
  byParentZoneId(zoneId) {
    return this.all().filter(el => {
      return el.zoneId === zoneId
    }) || {}
  },
}

Getters.zones = {
  all() {
    let zones = store.getters["data/content"]({id: "zones"})
    if (!zones) return []

    const server = store.getters["dataSource/server"]

    zones = zones.filter(el => el["existence"][server]["exist"])
    zones = zones.map(el => {
      if (el.isActivity) {
        const existence = el["existence"][server]

        if (!existence["openTime"] && !existence["closeTime"]) {
          el.isPermanentOpen = true
        } else {
          el.activityActiveTime = formatter.dates([existence["openTime"], existence["closeTime"]]);
          el.isOutdated = formatter.isOutdated(existence["closeTime"])
        }
      }
      return el
    })
    return zones
  },
  byZoneId(zoneId) {
    return this.all().find(el => {
      return el.zoneId === zoneId
    })
  },
  byType(type) {
    return this.all().filter(el => {
      return el.type === type
    });
  },
}

Getters.trends = {
  byItemId(itemId) {
    let temp = {};
    let trends = this.all();
    console.info("getting trends for item ", itemId)
    if (trends) {
      Object.keys(trends).map(key => {
        // if stage contains item
        if (
          trends[key] &&
          trends[key]["results"] &&
          trends[key]["results"][itemId]
        ) {
          // create an obj in temp, keyed with stageId
          temp[key] = {};
          // only include the current item data in the object
          temp[key]["results"] = trends[key]["results"][itemId];
          // copy all other values
          temp[key]["interval"] = trends[key]["interval"];
          temp[key]["startTime"] = trends[key]["startTime"];
        }
      });
    }
    return temp;
  },
  byStageId(stageId) {
    console.info("getting trends for stage", stageId, this.all()[stageId])
    // data has been already keyed with stageId. Just get it ;)
    return this.all() && this.all()[stageId];
  },
  all() {
    // when data source is not global, it is unable to get the trend
    // (trend of personalMatrix is not supported)
    if (store.getters['dataSource/source'] !== 'global') {
      return {};
    }
    // otherwise just return it
    return store.getters["data/content"]({id: "trends"}) || {}
  }
}

export default Getters