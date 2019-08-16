<template>
  <v-card class="mx-auto bkop-light">
    <v-card-title>
      <div><del>用户量激增，服务器月费上涨，企鹅数据的运营陷入了危机。站长红白为了保护喜爱的企鹅数据而决定...</del></div>
    </v-card-title>

    <v-card-title>
      <div>
        随着访问量的增加，目前的小水管服务器已经有些不堪重负了。如果各位刀客塔能捐助一些
        <v-tooltip
          top
        >
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
    <v-layout
      row
      wrap
    >
      <v-flex
        xs6
        md6
      >
        <v-card class="transparent">
          <v-img
            src="https://penguin-stats.s3-ap-southeast-1.amazonaws.com/alipay.png"
            alt="支付宝二维码"
          />

          <v-card-title primary-title>
            <v-layout
              align-center
              justify-center
              row
              fill-height
            >
              支付宝二维码
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex
        xs6
        md6
      >
        <v-card class="transparent">
          <v-img
            src="https://penguin-stats.s3-ap-southeast-1.amazonaws.com/wechat.png"
            alt="微信支付二维码"
          />

          <v-card-title primary-title>
            <v-layout
              align-center
              justify-center
              row
              fill-height
            >
              微信支付二维码
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "Donate"
};
</script>
