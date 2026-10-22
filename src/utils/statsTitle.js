import store from '@/store'
import get from '@/utils/getters'

// the titles of the stats pages as the server renders them (backend-next internal/controller/seo/texts.go, page.go),
// so that a page reached by client-side navigation has the same title as when it is loaded. keep them in sync
const texts = {
  zh: {
    site: '企鹅物流数据统计',
    servers: {CN: '国服', US: '美服', JP: '日服', KR: '韩服'},
    item: '{name} 掉率统计（{server}）',
    stage: '{stage} 掉落统计（{server}）',
    itemList: '素材掉率 · 按素材（{server}）',
    stageList: '素材掉率 · 按作战（{server}）',
    notFound: '未找到该页面'
  },
  en: {
    site: 'Penguin Statistics',
    servers: {CN: 'CN server', US: 'US server', JP: 'JP server', KR: 'KR server'},
    item: '{name} Drop Rates ({server})',
    stage: '{stage} Drop Rates ({server})',
    itemList: 'Drop Rates by Item ({server})',
    stageList: 'Drop Rates by Stage ({server})',
    notFound: 'Page not found'
  },
  ja: {
    site: 'ペンギン急便データ統計処理部門',
    servers: {CN: '大陸版', US: '英語版', JP: '日本版', KR: '韓国版'},
    item: '{name} ドロップ率（{server}）',
    stage: '{stage} ドロップ率（{server}）',
    itemList: '素材別ドロップ率（{server}）',
    stageList: '作戦別ドロップ率（{server}）',
    notFound: 'ページが見つかりません'
  },
  ko: {
    site: '펭귄 물류 데이터 분석 부서',
    servers: {CN: 'CN 서버', US: 'US 서버', JP: 'JP 서버', KR: 'KR 서버'},
    item: '{name} 드랍률 ({server})',
    stage: '{stage} 드랍률 ({server})',
    itemList: '아이템별 드랍률 ({server})',
    stageList: '스테이지별 드랍률 ({server})',
    notFound: '페이지를 찾을 수 없습니다'
  }
}

function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key])
}

// the name in lang, falling back to English, then Chinese, then the ID, as the server does
function localized(names, lang, fallback) {
  for (const l of [lang, 'en', 'zh']) {
    if (names && names[l]) return names[l]
  }
  return fallback
}

function title(t, text, values) {
  return `${fill(text, values)} | ${t.site}`
}

// the title of the stats page of route (a /{lang}/result/{server}/... route), or null while the data it names is not
// loaded. pages the server answers with 404 (an item or stage not on the server) get its "not found" title
export default function statsTitle(route) {
  const {lang, server: serverParam, itemId, stageId} = route.params
  const t = texts[lang]
  if (!t || !serverParam) return null
  const serverId = serverParam.toUpperCase()
  const server = t.servers[serverId]
  const isItem = route.name === 'StatsByItem' || route.name === 'StatsByItem_SelectedItem'

  if (isItem && !itemId) return title(t, t.itemList, {server})
  if (!isItem && !stageId) return title(t, t.stageList, {server})
  if (!get.statistics.loaded()) return null

  if (isItem) {
    if (!get.items.all(false, false).length) return null
    const item = get.items.byItemId(itemId, false, false)
    const onServer = get.items.validItemTypes.includes(item.itemType) &&
      ((item.existence && item.existence[serverId] && item.existence[serverId].exist) || get.statistics.byItemId(itemId).length > 0)
    if (!onServer) return `${t.notFound} | ${t.site}`
    return title(t, t.item, {name: localized(item.name_i18n, lang, itemId), server})
  }

  if (!get.stages.all().length) return null
  const stage = get.stages.byStageId(stageId)
  // the zones as fetched: get.zones caches its result whatever filter it was asked for, and may leave closed ones out
  const zones = store.getters['data/content']({id: 'zones'}) || []
  const zone = stage.stageId ? zones.find(el => el.zoneId === stage.zoneId) : null
  const onServer = zone && zone.zoneId &&
    ((stage.existence && stage.existence[serverId] && stage.existence[serverId].exist) || get.statistics.byStageId(stageId).length > 0)
  if (!onServer) return `${t.notFound} | ${t.site}`
  // the code of the stage and the name of its zone, once if they are the same (the recruitment statistics)
  const code = localized(stage.code_i18n, lang, stageId)
  const zoneName = localized(zone.zoneName_i18n, lang, zone.zoneId)
  return title(t, t.stage, {stage: zoneName === code ? code : `${code} ${zoneName}`, server})
}
