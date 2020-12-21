import store from "@/store"
import strings from "@/utils/strings"
import MiniSearch from 'minisearch'
import i18n from "@/i18n";
import get from '@/utils/getters'
import Console from "@/utils/Console";

function arrByLang(object, lang = i18n.locale) {
  return object ? (object[lang] || object[i18n.fallbackLocale] || []) : []
}

function processPron(arr) {
  const replaced = arr.map(el => el.replace(/`/g, ' '))
  const chunked = arr.map(el => el.replace(/`/g, ''))
  const firstChar = replaced.map(e => e.split(' ').map(el => el.charAt(0)).join(''))
  return [...replaced, ...chunked, firstChar].join(',')
}

class SearchEngine {
  constructor({ name, data }) {
    this.name = name
    this.engineOptions = {
      weights: {
        prefix: 2.5,
        fuzzy: .8,
      },
      fuzzy: 0.4
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
    this.engine = new MiniSearch({
      fields: ['stageId', 'code', 'alias', 'pron'],
      storeFields: ['stageId'],
      searchOptions: {
        ...this.engineOptions,
        boost: {
          code: 2,
          alias: 0.95,
          pron: 0.8,
          stageId: 0.05
        }
      }
    })
    const docs = this.data.map(el => ({
      id: el.stageId,
      stageId: el.stageId,
      code: strings.translate(el, "code"),
      alias: arrByLang(el.alias),
      pron: processPron(arrByLang(el.pron)),
    }))
    // console.log('stage docs mapped as', docs)
    this.ready = this.engine.addAllAsync(docs)
      .then(() => {
        Console.info("StageSearchEngine", "indexed all documents")
      })
  }
}

class ItemSearchEngine extends SearchEngine {
  constructor(options) { super(options); }
  updateEngine () {
    this.engine = new MiniSearch({
      fields: ['itemId', 'name', 'alias', 'pron'],
      storeFields: ['itemId'],
      searchOptions: {
        ...this.engineOptions,
        boost: {
          name: 2,
          alias: 0.95,
          pron: 0.8,
          itemId: 0.05
        }
      }
    })
    const docs = this.data
      .filter(el => get.items.validItemTypes.includes(el.itemType))
      .map(el => ({
        id: el.itemId,
        itemId: el.itemId,
        name: strings.translate(el, "name"),
        alias: arrByLang(el.alias),
        pron: processPron(arrByLang(el.pron)),
      }))
    // console.log('item docs mapped as', docs)
    this.ready = this.engine.addAllAsync(docs)
      .then(() => {
        Console.info("ItemSearchEngine", "indexed all documents")
      })
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
        .filter(el => el.score > 0.2)
        .map(el => ({...el, type: engine.name}))
      // console.log(result)
      results.push(...result)
    }
    // console.log(Date.now() - start)
    return results
  }
}

export default CompactedSearchEngine