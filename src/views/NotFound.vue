<template>
  <v-container
    id="__not_found_page"
    fluid
    fill-height
    grid-list-xl
    style="cursor: pointer"
    @click="redirect"
  >
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        xs12
        style="box-shadow: 0 3px 5px rgba(0, 0, 0, .6)"
      >
        <v-layout
          row
          wrap
          align-center
          justify-center
          class="prts-notice"
          style="height: 128px; font-size: 1.5em"
        >
          <v-flex
            style="max-width: 96px"
          >
            <v-icon
              class="right"
              :size="small ? 48 : 64"
              :style="{padding: small ? '8px' : '16px'}"
            >
              mdi-alert
            </v-icon>
          </v-flex>
          <v-flex style="flex-grow: 0">
            <v-layout
              row
              align-center
            >
              <div
                class="display-2 font-weight-medium letter"
                style="padding: 4px 4px 2px 16px"
              >
                PRTS提示
              </div>
            </v-layout>
            <v-layout
              row
              align-center
            >
              <div
                class="display-2 font-weight-medium letter strip"
                style="margin-top: -2px; margin-right: -64px; padding: 4px 64px 4px 16px"
              >
                页面不存在
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout
          row
          wrap
          align-center
          style="height: 48px; background: #20211e"
        >
          <v-flex xs12>
            <div class="title text-center letter">
              {{ small ? "此地" : "未知环境" }}不宜久留 / PRTS请求返回首页
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <div class="float-bottom subheading text-center light-shadow wide-letter">
      点击画面以继续
    </div>
  </v-container>
</template>

<script>
export default {
  name: "NotFound",
  data: () => ({}),
  computed: {
    small() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    redirect() {
      this.$router.push({name: "home"})
    }
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
  .letter {
    letter-spacing: 0.5px !important;
  }
  .wide-letter {
    letter-spacing: 1px !important;
  }
  .prts-notice {
    /*background: linear-gradient(to bottom, #4a0f0c, #6f180a);*/
    background: linear-gradient(90deg, #6f180a 14px, transparent 1%) center, linear-gradient(#6f180a 14px, transparent 1%) center, #000;
    background-size: 16px 16px;
  }
.float-bottom {
  position: absolute;
  bottom: 5vh;
  width: 100%;
  margin-left: -15px;
}

  .light-shadow {
    animation: blinking 2s infinite ease-out alternate-reverse;
  }
  @keyframes blinking {
    from {
      opacity: 0.3;
      text-shadow: 0 1px #0e0e0e, 0 0 0px rgba(255, 255, 255, 0);
    }
    to {
      opacity: 1;
      text-shadow: 0 1px #0e0e0e, 0 0 8px rgba(255, 255, 255, 1);
    }
  }

  .strip {
    background: #080b08;
    color: #f3cf49;
  }
  #__not_found_page, .strip {
    overflow: hidden;
  }
</style>