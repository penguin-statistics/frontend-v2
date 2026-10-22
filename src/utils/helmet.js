import i18n from '@/i18n'

// the path of a page the server rendered with its own head (the stats pages, which name their item or stage, and
// set their canonical URL, hreflang alternates, Open Graph tags, robots and structured data), read before the app
// mounts and replaces the rendered #pe-ssr section: that head is kept until the app leaves that path
let serverRenderedPath = document.getElementById('pe-ssr') ? decodeURI(window.location.pathname) : null

// the origin of canonical URLs, whatever host serves the app: penguin-stats.cn (mainland China), mirrors and previews
// serve the same pages without the server-rendered head, sitemap and hreflang alternates of penguin-stats.io, so
// they point search engines at it
const canonicalOrigin = 'https://penguin-stats.io'

// whether the head of the server-rendered page has been reset to the generic texts, which follow the UI language
let headReset = false

// sets the content of the <meta> whose attr (name or property) is key, adding the tag if there is none
function setMeta(attr, key, content) {
  let meta = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, key)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

// puts generic texts, in the UI language, in place of the description and Open Graph texts of the server-rendered page
function updateGenericTexts() {
  const name = i18n.t('app.name')
  const description = i18n.t('home.intro.intro_1')
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', name)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image:alt', name)
  setMeta('name', 'twitter:image:alt', name)
}

// once the app has left the server-rendered page, removes the tags of its head that describe only that page, and
// puts generic texts in place of its description: the template's own values were dropped by the server
function resetServerRenderedHead() {
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang], script[type="application/ld+json"], meta[property^="og:locale"]')
    .forEach(el => el.remove())
  headReset = true
  updateGenericTexts()
}

// whether the route is the page the server rendered, whose head the app leaves as is
function serverRendered({path}) {
  return path === serverRenderedPath
}

// whether search engines should not index the route (meta.noindex on it or on a parent)
function noindex({matched}) {
  return matched.some(el => el.meta.noindex)
}

export default {
  serverRendered,
  noindex,
  // updates the head for the route navigated to. path is the route's path as its route record spells it
  update(route, path = route.path) {
    if (serverRenderedPath !== null && !serverRendered(route)) {
      serverRenderedPath = null
      resetServerRenderedHead()
    }
    this.title.update(route)
    this.canonical.update(route, path)
  },
  // updates the texts of the head after the UI language changed
  localeChanged(route) {
    if (headReset) updateGenericTexts()
    this.title.update(route)
  },
  title: {
    assemble({matched}) {
      const titles = matched.map(el => i18n.t(el.meta.i18n))
      titles.reverse()
      return `${titles.join(' ‹ ')} │ ${i18n.t('app.name')}`
    },
    update(route) {
      if (serverRendered(route)) return
      document.title = this.assemble(route)
    }
  },
  canonical: {
    // the canonical URL of a path: without query, hash and trailing slash. a legacy stats route (/result/...) has
    // been redirected to its /{lang}/result/{server}/... path by now, the same URL the server renders that page at
    url(path) {
      return canonicalOrigin + (path.length > 1 ? path.replace(/\/+$/, '') : path)
    },
    update(route, path = route.path) {
      if (serverRendered(route)) return
      const url = this.url(path)
      setMeta('property', 'og:url', url)

      let link = document.head.querySelector('link[rel="canonical"]')
      if (noindex(route)) {
        if (link) link.remove()
        return
      }
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = url
    }
  }
}
