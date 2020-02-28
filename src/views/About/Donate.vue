<i18n>
  {
    "zh": {
      "donate": {
        "donate_0": "用户量激增，服务器月费上涨，企鹅数据的运营陷入了危机。站长红白为了保护喜爱的企鹅数据而决定...",
        "donate_1": "随着访问量的增加，目前的小水管服务器已经有些不堪重负了。如果各位刀客塔能捐助一些",
        "donate_2": "服务器费用",
        "donate_3": "pocky、阿噗噜派也可",
        "donate_4": "，我们将不胜感激!",
        "redirectToApp": "打开“{app}” APP 捐助",
        "methods": {
          "alipay": "支付宝",
          "wechatPay": "微信支付",
          "paypal": "使用PayPal捐助"
        }
      }
    },
    "en": {
      "donate": {
        "donate_0": "Increasing number of users and server fee make Penguin Statistics drop into crisis. In order to protect our beloved Penguin Statistics, the webmaster decides to...",
        "donate_1": "The number of accesses is increasing. The server is becoming overwhelmed. If Doctors can donate some",
        "donate_2": "server fee",
        "donate_3": "pocky or apple pie is also accepted",
        "donate_4": ", we will be much appreciated!",
        "redirectToApp": "Donate with \"{app}\" App",
        "methods": {
          "alipay": "Alipay",
          "wechatPay": "WeChat Pay",
          "paypal": "Donate with PayPal"
        }
      }
    },
    "ja": {
      "donate": {
        "donate_0": "ユーザー数が急増し、サーバーの月額は上昇、企鹅数据の運営は危機的状況に...。管理人の紅白は大好きな企鹅数据を守るため、自分に出来ることは何か？紅白が悩んで見つけ出した答えは「アイドルになること」！？",
        "donate_1": "アクセス数が増加し、サーバーが負荷に耐えることが出来なくなっています。サーバーの",
        "donate_2": "運営費用",
        "donate_3": "ポッキーやアップルパイでも可",
        "donate_4": "を寄付頂けると非常にありがたいです。",
        "redirectToApp": "{app}アプリで寄付します",
        "methods": {
          "alipay": "Alipay",
          "wechatPay": "WeChat Pay",
          "paypal": "PayPalで寄付"
        }
      }
    },
    "ko": {
      "donate": {
        "donate_0": "사용자 수와 서버비가 늘어나면서 펭귄 통계는 폐쇄의 위기에 처하게 된다. 관리자는 사랑하는 펭귄 통계를 지키기 위해...",
        "donate_1": "사용자 수가 늘어나면서 서버에 무리가 가고 있습니다. 만약 몇몇 박사들이",
        "donate_2": "서버비",
        "donate_3": "빼빼로나 애플파이도 환영합니다!",
        "donate_4": "를 기부해 줄 수 있다면, 우리는 매우 감사할 것입니다!",
        "redirectToApp": "{app}로 기부하기",
        "methods": {
          "alipay": "Alipay",
          "wechatPay": "WeChat Pay",
          "paypal": "PayPal로 기부하기"
        }
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
    </v-card-title>

    <v-row
      align="start"
      justify="center"
      class="px-2"
    >
      <v-col
        cols="12"
        sm="6"
      >
        <v-card class="bkop-light py-4 elevation-5">
          <v-img
            :src="require('@/assets/qrcodes/alipay-qrcode.svg')"
            :alt="$t('donate.methods.alipay')"
            max-height="128px"
            contain
            aspect-ratio="1"
          />

          <v-row
            align="center"
            justify="center"
            class="py-2"
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
              class="my-0 d-block"
              :href="qr.alipay"
              target="_blank"
            >
              {{ $t('donate.redirectToApp', {app: $t('donate.methods.alipay')}) }}
            </v-btn>
          </v-row>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
      >
        <v-card class="bkop-light py-4 elevation-5">
          <v-img
            :src="require('@/assets/qrcodes/wechatpay-qrcode.svg')"
            :alt="$t('donate.methods.wechatPay')"
            max-height="128px"
            contain
            aspect-ratio="1"
          />

          <v-row
            align="center"
            justify="center"
            class="py-2"
          >
            <span class="text-center title">
              {{ $t('donate.methods.wechatPay') }}
            </span>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
      class="pt-5 pb-3"
    >
      <v-btn
        rounded
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
export default {
  name: "Donate",
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
