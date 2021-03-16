import i18n from '@/i18n'

export default {
  title: {
    update ({ matched }) {
      const titles = matched.map(el => i18n.t(el.meta.i18n))
      titles.reverse()
      document.title = `${titles.join(' ‹ ')} │ ${i18n.t('app.name')}`
    }
  }
}
