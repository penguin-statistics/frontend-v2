import { service } from '@/utils/service'

export default {
  getNotice (data) {
    return service.get('/notice', data)
  }
}
