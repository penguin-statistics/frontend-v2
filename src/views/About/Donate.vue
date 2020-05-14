<i18n>
{
	"en": {
		"donate": {
			"donate_0": "Increasing number of users and server fees are putting Penguin Statistics into crisis. In order to protect our beloved Penguin Statistics, the webmaster decided to...",
			"donate_1": "There's now more than 100,000 users who visit Penguin Statistics every month, and the average Page View count has reached 300,000 per month. In order to let Penguin Statistics last long, please consider donating some",
			"donate_2": "server fee",
			"donate_3": "pocky or apple pie are also accepted",
			"donate_4": ". We greatly appreciate your support!",
      "accountBook": "Account Book",
			"methods": {
				"alipay": "Alipay",
				"paypal": "Donate with PayPal",
				"wechatPay": "WeChat Pay"
			},
			"redirectToApp": "Donate with \"{app}\" App"
		}
	},
	"ja": {
		"donate": {
			"donate_0": "ユーザー数が急増し、サーバーの月額は上昇、企鹅数据の運営は危機的状況に...。管理人の紅白は大好きな企鹅数据を守るため、自分に出来ることは何か？紅白が悩んで見つけ出した答えは「アイドルになること」！？",
			"donate_1": "アクセス数が増加し、サーバーが負荷に耐えることが出来なくなっています。サーバーの",
			"donate_2": "運営費用",
			"donate_3": "ポッキーやアップルパイでも可",
			"donate_4": "を寄付頂けると非常にありがたいです。",
			"methods": {
				"alipay": "Alipay",
				"paypal": "PayPal で寄付",
				"wechatPay": "WeChat Pay"
			},
			"redirectToApp": "{app} アプリで寄付します"
		}
	},
	"ko": {
		"donate": {
			"donate_0": "사용자 수와 서버비가 늘어나면서 펭귄 통계는 폐쇄의 위기에 처하게 된다. 관리자는 사랑하는 펭귄 통계를 지키기 위해...",
			"donate_1": "사용자 수가 늘어나면서 서버에 무리가 가고 있습니다. 만약 몇몇 박사들이",
			"donate_2": "서버비",
			"donate_3": "빼빼로나 애플파이도 환영합니다!",
			"donate_4": "를 기부해 줄 수 있다면, 우리는 매우 감사할 것입니다!",
			"methods": {
				"alipay": "Alipay",
				"paypal": "PayPal 로 기부하기",
				"wechatPay": "WeChat Pay"
			},
			"redirectToApp": "{app} 로 기부하기"
		}
	},
	"zh": {
		"donate": {
			"donate_0": "用户量激增，服务器月费上涨，企鹅数据的运营陷入了危机。站长红白为了保护喜爱的企鹅数据而决定...",
			"donate_1": "企鹅物流数据统计每月访问用户已达 10 万余人，平均访问量已达 30 万余次。为了企鹅物流可以维持收支平衡，各位刀客塔可以考虑捐赠一些",
			"donate_2": "服务器费用",
			"donate_3": "pocky、阿噗噜派也可",
			"donate_4": "，我们将不胜感激!",
			"accountBook": "查看收支一览",
			"methods": {
				"alipay": "支付宝",
				"paypal": "使用 PayPal 捐助",
				"wechatPay": "微信支付"
			},
			"redirectToApp": "打开 “{app}” APP 捐助"
		}
	}
}
</i18n>

<template>
  <v-card 
    elevation="5" 
    class="bkop-light pa-6"
  >
    <h1 class="headline">
      {{ $t('menu.about.donate') }}
    </h1>

    <v-card-title style="word-break:normal">
      <del class="caption mb-2">
        {{ $t('donate.donate_0') }}
      </del>
      <div class="subtitle-1">
        {{ $t('donate.donate_1') }}
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span
              style="border-bottom:1px dashed #ccc;"
              v-on="on"
            >{{ $t('donate.donate_2') }}</span>
          </template>
          {{ $t('donate.donate_3') }}
        </v-tooltip>
        {{ $t('donate.donate_4') }}
      </div>
      <v-btn
        color="blue-grey"
        href="https://shimo.im/sheets/GJXgP9XQcPrj6rtg/2fC1m"
        target="_blank"
        class="mt-1"
      >
        <v-icon left>
          mdi-bank-transfer
        </v-icon>
        {{ $t('donate.accountBook') }}
        <v-icon
          right
          small
        >
          mdi-open-in-new
        </v-icon>
      </v-btn>
    </v-card-title>

    <svg
      style="position: absolute; width: 0; height: 0;"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <symbol
          id="alipay"
          viewBox="0 0 40 40"
        >
          <path
            d="M32.9 25.1c-1.6-.5-3.7-1.4-6.1-2.2a31.32 31.32 0 003.3-8.4h-7.9v-2.8h9.7v-1.6h-9.7V5.4h-3.9a.69.69 0 00-.7.7v4H7.8v1.6h9.8v2.8H9.5v1.6h15.6a24.52 24.52 0 01-2.3 5.5c-5.1-1.7-10.5-3-13.9-2.2a7.64 7.64 0 00-4.4 2.5c-3.8 4.6-1.1 11.5 6.9 11.5 4.7 0 9.3-2.6 12.8-6.9 5.3 2.5 15.7 6.8 15.7 6.8v-6.2a50.91 50.91 0 01-7-2zm-22.1 5.6c-6.2 0-8.1-4.9-5-7.6a7.72 7.72 0 013.9-1.4c3.7-.4 7.1 1 11.2 3-2.9 3.7-6.5 6-10.1 6z"
            fill="currentColor"
          />
        </symbol>
        <symbol
          id="wechatpay"
          viewBox="0 0 40.1 35.4"
        >
          <path
            fill="currentColor"
            d="M14.5 22.5a1.27 1.27 0 01-.6.1 1.52 1.52 0 01-1.2-.7l-.1-.2-3.6-8c0-.1-.1-.2-.1-.3a.68.68 0 01.7-.7.6.6 0 01.4.1l4.3 3.1a2 2 0 001.1.3 1.7 1.7 0 00.7-.1l20.2-9A21.27 21.27 0 0020 0C9 0 0 7.5 0 16.7c0 5 2.7 9.5 6.9 12.6a1.36 1.36 0 01.6 1.1.6.6 0 01-.1.4c-.3 1.3-.9 3.3-.9 3.4s-.1.3-.1.5a.68.68 0 00.7.7c.1 0 .3-.1.4-.1l4.4-2.5a2 2 0 011.1-.3 1.27 1.27 0 01.6.1 22.69 22.69 0 006.5.9c11 0 20-7.5 20-16.7a13.92 13.92 0 00-2.3-7.7l-23 13.3-.3.1z"
          />
        </symbol>
      </defs>
    </svg>

    <v-row
      align="start"
      justify="center"
      class="px-2"
    >
      <v-col
        cols="12"
        sm="6"
      >
        <BackdropCard
          darken
          class="bkop-light pt-6 pb-4 elevation-3"
        >
          <template v-slot:backdrop>
            <svg
              :alt="$t('donate.methods.alipay')"
              style="height: 96px; width: 96px; color: inherit"
            >
              <use xlink:href="#alipay" />
            </svg>
          </template>

          <img
            svg-inline
            :src="require('@/assets/qrcodes/alipay-qrcode.svg')"
            :alt="$t('donate.methods.alipay')"
            style="max-height: 128px"
            class="d-block justify-center mx-auto"
          >

          <v-row
            align="center"
            justify="center"
            class="pt-2"
          >
            <span class="text-center title">
              {{ $t('donate.methods.alipay') }}
            </span>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <v-btn
              v-if="$vuetify.breakpoint.xsOnly"
              text
              outlined
              rounded
              class="my-0"
              :href="qr.alipay"
              target="_blank"
            >
              {{ $t('donate.redirectToApp', {app: $t('donate.methods.alipay')}) }}
            </v-btn>
          </v-row>
        </BackdropCard>
      </v-col>

      <v-col
        cols="12"
        sm="6"
      >
        <BackdropCard
          darken
          class="bkop-light pt-6 pb-4 elevation-3"
        >
          <template v-slot:backdrop>
            <svg
              :alt="$t('donate.methods.wechatPay')"
              style="height: 96px; width: 96px; color: inherit"
            >
              <use xlink:href="#wechatpay" />
            </svg>
          </template>

          <img
            svg-inline
            :src="require('@/assets/qrcodes/wechatpay-qrcode.svg')"
            :alt="$t('donate.methods.wechatPay')"
            style="max-height: 128px"
            class="d-block justify-center mx-auto"
          >

          <v-row
            align="center"
            justify="center"
            class="pt-2"
          >
            <span class="text-center title">
              {{ $t('donate.methods.wechatPay') }}
            </span>
          </v-row>
        </BackdropCard>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
      class="pt-5 pb-3"
    >
      <v-btn
        rounded
        large
        color="primary"
        :href="qr.paypal"
        target="_blank"
      >
        <v-icon left>
          mdi-paypal
        </v-icon> {{ $t('donate.methods.paypal') }}
      </v-btn>
    </v-row>
  </v-card>
</template>

<script>
import Theme from "@/mixins/Theme";
import BackdropCard from "@/components/global/BackdropCard";

export default {
  name: "Donate",
  components: {BackdropCard},
  mixins: [Theme],
  data() {
    return {
      qr: {
        alipay: "https://qr.alipay.com/fkx03351nnunmv19b5yavdf",
        wechatPay: "wxp://f2f0F8Z93ZkS3boz8JY3FwarwyAwcIfXC2CN",
        paypal: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T9LRK3VEL645J&item_name=Penguin+Statistics+Donation&currency_code=USD&source=url"
      }
    }
  }
};
</script>

<style>

</style>
