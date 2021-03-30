import mirror from '@/utils/mirror'

export default {
  methods: {
    cdnDeliver (path) {
      return mirror.deliver(path)
    }
  }
}
