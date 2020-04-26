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
  <v-card
    elevation="5"
    class="bkop-light pa-6"
  >
    <h1 class="headline font-weight-black d-flex align-center">
      <v-icon left>
        mdi-alert-decagram
      </v-icon>

      {{ $t('menu.about.bulletin') }}
    </h1>
    <v-row>
      <v-col
        cols="12"
        class="subtitle-1 line-height-wide font-weight-bold"
        style="word-break: normal"
      >
        <p
          v-for="bulletin in $t('bulletin')"
          :key="bulletin"
          class="mb-0"
          v-text="bulletin"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'Bulletin'
}
</script>

<style scoped>
.line-height-wide {
  line-height: 1.8;
}
</style>
