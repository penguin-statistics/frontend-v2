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
      this.$confirm('确定要离开此页面吗？', {
        title: '确定要离开此页面吗？',
        subtitle: '未保存的更改可能会丢失。',
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
