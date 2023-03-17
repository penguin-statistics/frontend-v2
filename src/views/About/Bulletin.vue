<template>
  <v-scroll-y-transition
    leave-absolute
    hide-on-leave
  >
    <div
      v-if="notices.length"
      class="transparent"
    >
      <NoticeCard
        v-for="notice in notices"
        :key="notice.id"
        :notice="notice"
      />
    </div>
    <div
      v-else-if="loading || error"
      class="transparent"
    >
      <NoticeCard
        :error="error"
        :loading="loading"
      />
    </div>
    <v-card
      v-else
      elevation="5"
      class="bulletin-card pa-6 mb-2"
    >
      <h1 class="headline font-weight-bold d-flex align-center">
        <v-icon left>
          mdi-information
        </v-icon>

        {{ $t('menu.about.bulletin') }}
      </h1>
      <div
        class="mt-4"
      >
        <v-alert
          type="info"
          border="left"
          text
          class="mb-0"
        >
          <span>
            暂无公告
          </span>
        </v-alert>
      </div>
    </v-card>
  </v-scroll-y-transition>
</template>

<script>
import meta from '@/apis/meta'
import strings from '@/utils/strings'
import NoticeCard from '@/components/global/NoticeCard'
import existUtils from '@/utils/existUtils'

export default {
  name: 'Bulletin',
  components: {NoticeCard},
  data() {
    return {
      notices: [],
      loading: false,
      error: null
    }
  },
  computed: {
    strings() {
      return strings
    }
  },
  created() {
    const data = this.$store.getters['ui/notice']
    if (data) {
      this.notices = this.parseNotices(data)
    } else {
      this.update()
    }
  },
  methods: {
    update() {
      this.loading = true
      this.notices = []
      this.error = null
      meta.getNotice()
          .then(({data}) => {
            this.notices = this.parseNotices(data)
            this.$store.commit('ui/setNotice', data)
          })
          .catch(err => {
            this.error = err
          })
          .finally(() => {
            this.loading = false
          })
    },
    // 🎉 12.24 企鹅物流 1.5 周年暨新年贺！
    //       - 另外，我们有 B 站账号啦！[快来 Roll 大月卡！](http://a.com/)
    // - 同时，NGA 的抽奖活动与 B 站账号独立哦！[欢迎各位来捧场w](http://nga.com/)
    parseNotices(notices) {
      // return [{"severity":2,"existence":{"US":{"exist":true},"JP":{"exist":true},"CN":{"exist":true},"KR":{"exist":true}},"conditions":{"servers":["CN","US","JP","KR"]},"content_i18n":{"zh":"🎉 12.24 企鹅物流 1.5 周年暨新年贺！\n- 快去围观[纪念视频](https://www.bilibili.com/video/BV1Ja4y1p7wn) \n- [点我参加 NGA 抽奖活动](！nga帖子链接！)\n- 微博抽奖与 NGA 独立哦~ [点我参加微博抽奖活动](！微博帖子链接！)","en":"🎉 Dec. 24th: Penguin Statistics 1.5 Years Anniversary\n- Watch the [Documentary Video](https://www.bilibili.com/video/BV1Ja4y1p7wn)\n- Participate the [Lottery Activity @ NGA](NGALINK)\n- Participate the separated, [Lottery Activity @ Weibo](WEIBOLINK)"}},
      //   ...notices.filter(notice => {
      //     return existUtils.existence(notice, true)
      //   })
      // ]
      return notices.filter(notice => {
        return existUtils.existence(notice, true)
      })
    }
  }
}
</script>

<style scoped>

.theme--light .notice-card--informational {
  background: repeating-linear-gradient(
      -45deg,
      rgba(240, 240, 240, 0.98),
      rgba(240, 240, 240, 0.98) 45px,
      rgba(255, 255, 255, 0.9) 45px,
      rgba(255, 255, 255, 0.9) 90px
  ) !important;
}

.theme--dark .notice-card--informational {
  background: repeating-linear-gradient(
      -45deg,
      rgba(61, 61, 61, 0.98),
      rgba(61, 61, 61, 0.98) 45px,
      rgba(46, 46, 46, 0.9) 45px,
      rgba(46, 46, 46, 0.9) 90px
  ) !important;
}

[data-theme="seaborn"] .notice-card--informational::v-deep {
  background: repeating-linear-gradient(
      -45deg,
      rgba(23, 78, 89, 0.98),
      rgba(23, 78, 89, 0.98) 45px,
      rgba(15, 53, 61, 0.9) 45px,
      rgba(15, 53, 61, 0.9) 90px
  ) !important;
}
</style>
