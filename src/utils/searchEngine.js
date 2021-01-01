import store from "@/store"
import strings from "@/utils/strings"
import Fuse from 'fuse.js'
import i18n from "@/i18n";
import get from '@/utils/getters'

function arrByLang(object, lang = i18n.locale) {
  return object ? (object[lang] || object[i18n.fallbackLocale] || []) : []
}

function processPron(arr) {
  const replaced = arr.map(el => el.replace(/`/g, ' '))
  const chunked = arr.map(el => el.replace(/`/g, ''))
  const firstChar = replaced.map(e => e.split(' ').map(el => el.charAt(0)).join(''))
  return [...replaced, ...chunked, ...firstChar]
}

class SearchEngine {
  constructor({ name, data }) {
    this.name = name
    this.engineOptions = {
      includeScore: true,
      ignoreLocation: true,
      useExtendedSearch: true,
      threshold: 0.45
    }
    this.ready = new Promise(() => {})
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

class StageSearchEngine extends SearchEngine {
  constructor(options) { super(options); }
  updateEngine () {
    const docs = this.data.map(el => ({
      stageId: el.stageId,
      code: strings.translate(el, "code"),
      alias: arrByLang(el.alias),
      pron: processPron(arrByLang(el.pron)),
    }))
    // console.log('stage docs mapped as', docs)
    this.engine = new Fuse(docs,{
      ...this.engineOptions,
      keys: [
        "stageId",
        "code",
        "alias",
        "pron"
      ]
    })
    this.ready = Promise.resolve()
  }
}

class ItemSearchEngine extends SearchEngine {
  constructor(options) { super(options); }
  updateEngine () {
    const docs = this.data
      .filter(el => get.items.validItemTypes.includes(el.itemType))
      .map(el => ({
        itemId: el.itemId,
        name: strings.translate(el, "name"),
        alias: arrByLang(el.alias),
        pron: processPron(arrByLang(el.pron)),
      }))
    this.engine = new Fuse(docs,{
      ...this.engineOptions,
      keys: [
        "itemId",
        "name",
        "alias",
        "pron"
      ]
    })
    this.ready = Promise.resolve()
  }
}

class CompactedSearchEngine {
  constructor() {
    this.engines = [
      new ItemSearchEngine({
        name: 'items',
        data: store.getters["data/content"]({id: "items"})
      }),
      new StageSearchEngine({
        name: 'stages',
        data: store.getters["data/content"]({id: "stages"})
      })
    ]
  }

  update(key, data) {
    this.engines.find(el => el.name === key).update(data)
  }

  ready() {
    return Promise.all(this.engines.map(el => el.ready))
  }

  search(query, options = {}) {
    if (!query) return []

    const results = [];
    // const start = Date.now()
    for (const engine of this.engines) {
      const result = engine.engine.search(query, options)
        .map(el => ({...el, type: engine.name}))
      results.push(...result)
    }
    // console.log(Date.now() - start)
    results.sort((a, b) => a.score - b.score)

    return results
  }
}

export default CompactedSearchEngine