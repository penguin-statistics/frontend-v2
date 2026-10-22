import { markFirstDataRender } from '@/utils/rum'

// marks the first time a view shows data: the component tells whether it renders any with `rendersData`
export default {
  mounted () {
    markFirstDataRender(() => this.rendersData)
  },
  updated () {
    markFirstDataRender(() => this.rendersData)
  }
}
