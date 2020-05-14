<i18n>
  {
    "en": {
      "bulletin": [
        "In order to increase the site speed, we built up two mirror websites. Please select the corresponding mirror according to your geographical location. (If you have Penguin Statistics user ID, you need to re-login after you switch to another mirror site)",
        "China: penguin-stats.cn",
        "Global: penguin-stats.io"
      ]
    },
    "ja": {
      "bulletin": [
        "In order to increase the site speed, we built up two mirror websites. Please select the corresponding mirror according to your geographical location. (If you have Penguin Statistics user ID, you need to re-login after you switch to another mirror site)",
        "China: penguin-stats.cn",
        "Global: penguin-stats.io"
      ]
    },
    "ko": {
      "bulletin": [
        "In order to increase the site speed, we built up two mirror websites. Please select the corresponding mirror according to your geographical location. (If you have Penguin Statistics user ID, you need to re-login after you switch to another mirror site)",
        "China: penguin-stats.cn",
        "Global: penguin-stats.io"
      ]
    },
    "zh": {
      "bulletin": [
        "为了优化国内和海外的访问速度，我们建立了相应的镜像站，推荐各位博士根据所处地理位置进行选择。（如果您拥有本站的ID，更换镜像后请重新登录）",
        "国内：penguin-stats.cn",
        "国际：penguin-stats.io"
      ]
    }
  }
</i18n>

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
  import meta from "@/apis/meta";
  import strings from "@/utils/strings";
  import NoticeCard from "@/components/global/NoticeCard";

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
        return strings;
      }
    },
    created() {
      const data = this.$store.getters["ui/notice"];
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
      parseNotices (notices) {
        const self = this;
        return notices.filter(notice => {
          const conditions = notice["conditions"]

          if (!conditions["locale"].includes(self.$i18n.locale)) return false;
          if (conditions["start"] && Date.now() < conditions["start"]) return false;
          if (conditions["end"] && Date.now() > conditions["end"]) return false;

          return true
        })
      }
    },
  }
</script>

<style scoped>
  .line-height-wide {
    line-height: 1.8;
  }

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
</style>
