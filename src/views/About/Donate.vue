<i18n>
  {
    "zh": {
      "donate": {
        "donate_0": "用户量激增，服务器月费上涨，企鹅数据的运营陷入了危机。站长红白为了保护喜爱的企鹅数据而决定...",
        "redirectToApp": "打开“{app}” APP 捐助",
        "methods": {
          "alipay": "支付宝",
          "wechatPay": "微信支付"
        }
      }
    },
    "en": {
      "donate": {
        "donate_0": "用户量激增，服务器月费上涨，企鹅数据的运营陷入了危机。站长红白为了保护喜爱的企鹅数据而决定...",
        "redirectToApp": "Donate using \"{app}\" App",
        "methods": {
          "alipay": "Alipay",
          "wechatPay": "WeChat Pay"
        }
      }
    },
    "ja": {
      "donate": {
        "donate_0": "ユーザー数が急増し、サーバーの月額は上昇、企鹅数据の運営は危機的状況に...。管理人の紅白は大好きな企鹅数据を守るため、自分に出来ることは何か？紅白が悩んで見つけ出した答えは「アイドルになること」！？",
        "methods": {
          "alipay": "Alipay",
          "wechatPay": "WeChat Pay"
        }
      }
    }
  }
</i18n>

<template>
  <v-card class="mx-auto bkop-light">
    <v-card-title>
      <div><del>{{ $t('donate.donate_0') }}</del></div>
    </v-card-title>

    <v-card-title>
      <div>
        随着访问量的增加，目前的小水管服务器已经有些不堪重负了。如果各位刀客塔能捐助一些
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span
              style="border-bottom:1px dashed #ccc;"
              v-on="on"
            >服务器费用</span>
          </template>
          pocky、阿噗噜派也可
        </v-tooltip>
        ，我们将不胜感激!
      </div>
    </v-card-title>

    <v-card-title>
      <v-layout
        wrap
        align-center
        justify-center
      >
        <v-flex
          xs12
          sm6
        >
          <v-card class="transparent pa-4">
            <v-img
              :src="require('@/assets/qrcodes/alipay-qrcode.svg')"
              :alt="$t('donate.methods.alipay')"
              max-height="128px"

              contain
            />

            <v-card-title primary-title>
              <v-layout
                align-center
                justify-center
                column
                fill-height
              >
                <v-btn
                  v-show="$vuetify.breakpoint.smAndDown"
                  flat
                  outline

                  @click="redirectAlipay"
                >
                  {{ $t('donate.redirectToApp', {app: $t('donate.methods.alipay')}) }}
                </v-btn>
                
                <v-flex>
                  {{ $t('donate.methods.alipay') }}
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-flex>

        <v-flex
          xs12
          sm6
        >
          <v-card class="transparent pa-4">
            <v-img
              :src="require('@/assets/qrcodes/wechatpay-qrcode.svg')"
              :alt="$t('donate.methods.wechatPay')"
              max-height="128px"
              contain
            />

            <v-card-title primary-title>
              <v-layout
                align-center
                justify-center
                column
                fill-height
              >
                <v-btn
                  v-show="$vuetify.breakpoint.smAndDown"
                  flat
                  outline

                  @click="redirectWechatPay"
                >
                  {{ $t('donate.redirectToApp', {app: $t('donate.methods.wechatPay')}) }}
                </v-btn>

                <v-flex>
                  {{ $t('donate.methods.wechatPay') }}
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Donate",
  data () {
    return {
      qr: {
        alipay: "https://qr.alipay.com/fkx03351nnunmv19b5yavdf",
        wechatPay: "wxp://f2f0F8Z93ZkS3boz8JY3FwarwyAwcIfXC2CN"
      }
    }
  },
  methods: {
    redirectAlipay () {
      window.location = this.qr.alipay
    },
    redirectWechatPay () {
      window.location = this.qr.wechatPay
    }
  }
};
</script>
