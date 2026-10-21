import i18n from '@/i18n'

// the path of a page the server rendered with its own title (the stats pages, which name their item or stage), read
// before the app mounts and replaces the rendered #pe-ssr section: its title is kept until the app leaves that path
let serverRenderedPath = document.getElementById('pe-ssr') ? decodeURI(window.location.pathname) : null

export default {
  title: {
    assemble({matched}) {
      const titles = matched.map(el => i18n.t(el.meta.i18n))
      titles.reverse()
      return `${titles.join(' ‹ ')} │ ${i18n.t('app.name')}`
    },
    update({matched, path}) {
      if (serverRenderedPath !== null) {
        if (path === serverRenderedPath) return
        serverRenderedPath = null
      }
      document.title = this.assemble({matched})
    }
  }
}
