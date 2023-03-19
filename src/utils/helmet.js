import i18n from '@/i18n'

export default {
  title: {
    assemble({matched}) {
      const titles = matched.map(el => i18n.t(el.meta.i18n))
      titles.reverse()
      return `${titles.join(' ‹ ')} │ ${i18n.t('app.name')}`
    },
    update({matched}) {
      document.title = this.assemble({matched})
    }
  }
}
