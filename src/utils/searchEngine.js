import store from "@/store"
import PinyinEngine from "pinyin-engine"
import strings from "@/utils/strings";

class PinyinEngineManager {
  constructor({ data }) {
    this.update(data)
  }
  updateEngine() {}
  update(data) {
    this.data = data || []
    this.updateEngine()
  }
  query(keyword) {
    if (!this.engine) throw new Error("search engine called before not initialized")
    return this.engine.query(keyword)
  }
}

class PinyinEngineManagerStages extends PinyinEngineManager {
  constructor(options) { super(options); }
  updateEngine () {
    this.engine = new PinyinEngine(this.data.map(el => ({
      zoneId: el.zoneId,
      stageId: el.stageId,
      code: strings.translate(el, "code")
    })), [
      "stageId",
      "code"
    ])
  }
}

class PinyinEngineManagerItems extends PinyinEngineManager {
  constructor(options) { super(options); }
  updateEngine () {
    this.engine = new PinyinEngine(this.data.map(el => ({
      itemId: el.itemId,
      name: strings.translate(el, "name")
    })), [
      "itemId",
      "name"
    ])
  }
}

class SearchEngine {
  constructor() {
    this.pinyinEngines = {
      items: new PinyinEngineManagerItems({
        data: store.getters["data/content"]({id: "items"})
      }),
      stages: new PinyinEngineManagerStages({
        data: store.getters["data/content"]({id: "stages"})
      })
    }
  }

  update(key, data) {
    this.pinyinEngines[key].update(data)
  }

  query(query) {
    if (!query) return []

    const results = [];
    for (const [key, engine] of Object.entries(this.pinyinEngines)) {
      results.push(...engine.query(query).map(el => ({...el, type: key})))
    }
    return results
  }
}

export default SearchEngine