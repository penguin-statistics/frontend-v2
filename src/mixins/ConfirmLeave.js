import environment from '@/utils/environment'

export default {
  data () {
    return {
      confirmLeaveActive: environment.production
    }
  },
  created () {
    if (this.confirmLeaveActive) this.confirmLeaveCreate()
  },
  beforeRouteLeave (to, from, next) {
    if (this.confirmLeaveActive) {
      this.$confirm(this.$t('confirmLeave.subtitle'), {
        title: this.$t('confirmLeave.title'),
        subtitle: this.$t('confirmLeave.subtitle'),
        color: 'error'
      })
        .then((permit) => {
          permit ? next() : next(false)
        })
    } else {
      next()
    }
  },
  beforeDestroy () {
    this.confirmLeaveDestroy()
  },
  watch: {
    confirmLeaveActive (newValue) {
      if (newValue) {
        this.confirmLeaveCreate()
      } else {
        this.confirmLeaveDestroy()
      }
    }
  },
  methods: {
    confirmLeaveCreate () {
      window.onbeforeunload = function (e) {
        e = e || window.event

        if (e) {
          e.returnValue = '确定要离开此页面吗？'
        }

        return '确定要离开此页面吗？'
      }
    },
    confirmLeaveDestroy () {
      window.onbeforeunload = null
    }
  }
}
